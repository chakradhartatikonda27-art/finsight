from fastapi import APIRouter, Depends, HTTPException
from core.auth import get_current_user, CurrentUser
from core.config import settings
from typing import List
import json

router = APIRouter()

TALLY_GROUP_RULES = {
    "Sales Accounts":        ("Revenue",               "pl_revenue",        99),
    "Direct Income":         ("Revenue",               "pl_revenue",        97),
    "Sale of Service":       ("Revenue",               "pl_revenue",        99),
    "Unbilled Revenue":      ("Revenue",               "pl_revenue",        95),
    "Purchase Accounts":     ("Material Cost",         "pl_direct_cost",    99),
    "Direct Expenses":       ("Direct Cost",           "pl_direct_cost",    92),
    "Cost of material Consumed": ("Material Cost",     "pl_direct_cost",    99),
    "Cost of Fuel Consumed": ("Material Cost",         "pl_direct_cost",    99),
    "Direct Project Cost":   ("Direct Cost",           "pl_direct_cost",    97),
    "Direct Labour Cost":    ("Direct Labour",         "pl_direct_cost",    99),
    "Employee Benefit Expenses": ("Employee Cost",     "pl_opex",           99),
    "Indirect Expenses":     ("Administrative Cost",   "pl_opex",           78),
    "Rent, rates & taxes":   ("Administrative Cost",   "pl_opex",           95),
    "Other administration expenses": ("Administrative Cost", "pl_opex",     93),
    "Legal and Professional Expenses": ("Administrative Cost", "pl_opex",   94),
    "Travel and Accomodation": ("Administrative Cost", "pl_opex",           92),
    "Repairs and Maintenance": ("Administrative Cost", "pl_opex",           91),
    "Interest on cash credit & overdraft": ("Finance Cost", "pl_finance",   99),
    "Interest on term loans": ("Finance Cost",         "pl_finance",        99),
    "INTEREST ON UNSECURED LOAN": ("Finance Cost",     "pl_finance",        97),
    "Bank Charges":          ("Finance Cost",          "pl_finance",        95),
    "Bank OD A/c":           ("Bank OD",               "bs_current_liab",   99),
    "Short Term Borrowings": ("Short Term Borrowings", "bs_current_liab",   98),
    "Long Term Borrowings":  ("Long Term Borrowings",  "bs_noncurrent_liab",98),
    "Fixed Asset":           ("Fixed Assets",          "bs_noncurrent_asset",99),
    "Cash & Bank Balance":   ("Cash & Bank",           "bs_current_asset",  97),
    "Balance With Banks":    ("Cash & Bank",           "bs_current_asset",  97),
    "Sundry debtors":        ("Trade Debtors",         "bs_current_asset",  99),
    "Inventories":           ("Inventory",             "bs_current_asset",  99),
    "Short Term Loans & Advances": ("Other Current Assets","bs_current_asset",88),
    "Other Current Assets":  ("Other Current Assets",  "bs_current_asset",  90),
    "Financial Asset":       ("Investments",           "bs_noncurrent_asset",85),
    "Other Long Term Assets":("Other Assets",          "bs_noncurrent_asset",84),
    "Sundry creditors":      ("Trade Creditors",       "bs_current_liab",   99),
    "Other Current Liabilities": ("Other Current Liabilities","bs_current_liab",90),
    "Short Term Provisions": ("Provisions",            "bs_current_liab",   88),
    "Share Capital":         ("Share Capital",         "bs_equity",         99),
    "Branch/ Division Account": ("Intercompany",       "exclude",           99),
}


async def _claude_map_edge_cases(unmapped: list) -> list:
    if not settings.ANTHROPIC_API_KEY or not unmapped:
        return []
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        ledger_list = "\n".join([f"- {l['ledger_name']} (Group: {l.get('tally_group','Unknown')})" for l in unmapped[:50]])
        prompt = f"""You are a senior Indian CA mapping Tally ledgers to MIS heads.

Map each to ONE MIS head:
Revenue | Material Cost | Direct Labour | Employee Cost | Administrative Cost | Finance Cost | Depreciation |
Fixed Assets | Trade Debtors | Inventory | Cash in Hand | Bank Balance | Other Current Assets |
Share Capital | Reserves & Surplus | Term Loans | Trade Creditors | Bank OD | GST Payable | Intercompany | Other

RULES:
- Bank OD/Overdraft → Bank OD (NEVER Bank Balance)
- Inter-company transfers → Intercompany
- Sub-contractor payments → Direct Cost
- Depreciation accounts → Depreciation

Ledgers:
{ledger_list}

Respond ONLY with JSON array:
[{{"ledger_name":"...","mis_head":"...","category":"pl_revenue|pl_direct_cost|pl_opex|pl_finance|bs_asset|bs_current_liab|bs_equity|exclude","confidence":0-100}}]"""

        response = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1].lstrip("json").strip()
        return json.loads(raw)
    except Exception as e:
        print(f"[MAPPING] Claude error: {e}")
        return []


@router.post("/{upload_id}")
async def run_mapping(
    upload_id: str,
    current_user: CurrentUser = Depends(get_current_user),
):
    """
    Step 1: Rule engine (90% coverage, instant)
    Step 2: Claude Haiku for edge cases (~₹1.68 per run)
    Step 3: Returns all mappings with confidence scores for CA review
    """
    if settings.ENVIRONMENT == "development":
        return _dev_mapping()

    from core.database import get_supabase
    sb = get_supabase()

    ledgers = sb.table("ledger_mappings").select(
        "ledger_name,tally_group"
    ).eq("org_id", current_user.org_id).execute().data

    mapped = []
    unmapped = []

    for l in ledgers:
        tally_group = l.get("tally_group", "Unknown")
        if tally_group in TALLY_GROUP_RULES:
            mis_head, category, confidence = TALLY_GROUP_RULES[tally_group]
            mapped.append({**l, "mis_head": mis_head, "category": category,
                          "confidence": confidence, "source": "rule_engine"})
        else:
            unmapped.append(l)

    if unmapped:
        ai_results = await _claude_map_edge_cases(unmapped)
        ai_map = {r["ledger_name"]: r for r in ai_results}
        for l in unmapped:
            if l["ledger_name"] in ai_map:
                ai = ai_map[l["ledger_name"]]
                mapped.append({**l, "mis_head": ai["mis_head"],
                               "category": ai["category"],
                               "confidence": ai["confidence"],
                               "source": "claude_haiku"})
            else:
                mapped.append({**l, "mis_head": None, "confidence": 0, "source": "unmapped"})

    for m in mapped:
        if m.get("mis_head"):
            try:
                sb.table("ledger_mappings").update({
                    "mis_head": m["mis_head"],
                    "confidence": m["confidence"],
                    "mapping_source": m.get("source", "rule_engine"),
                }).eq("org_id", current_user.org_id).eq("ledger_name", m["ledger_name"]).execute()
            except Exception:
                pass

    return {
        "upload_id": upload_id,
        "total_ledgers": len(ledgers),
        "confirmed": sum(1 for m in mapped if m.get("confidence", 0) >= 90),
        "pending_ca_review": sum(1 for m in mapped if 0 < m.get("confidence", 0) < 90),
        "unmapped": sum(1 for m in mapped if not m.get("mis_head")),
        "mappings": mapped,
        "message": f"Rule engine: {len(mapped)-len(unmapped)}, Claude AI: {len(unmapped)} edge cases",
    }


@router.get("/{org_id}")
async def get_mappings(
    org_id: str,
    current_user: CurrentUser = Depends(get_current_user),
):
    if settings.ENVIRONMENT == "development":
        return _dev_mapping()
    from core.database import get_supabase
    result = get_supabase().table("ledger_mappings").select("*").eq("org_id", org_id).execute()
    return {"mappings": result.data}


def _dev_mapping():
    return {
        "total_ledgers": 1406,
        "confirmed": 1390,
        "pending_ca_review": 14,
        "unmapped": 2,
        "message": "Rule engine: 1390, Claude Haiku: 14 edge cases [dev mode]",
        "sample_mappings": [
            {"ledger_name": "Construction of Road Work", "tally_group": "Sale of Service",       "mis_head": "Revenue",          "confidence": 99, "source": "rule_engine"},
            {"ledger_name": "TMT Steel 500D 12mm",       "tally_group": "Cost of material Consumed","mis_head": "Material Cost", "confidence": 99, "source": "rule_engine"},
            {"ledger_name": "HDFC Bank OD",               "tally_group": "Bank OD A/c",            "mis_head": "Bank OD",         "confidence": 99, "source": "rule_engine"},
            {"ledger_name": "Hire Charges - Paver",       "tally_group": "Direct Expenses",        "mis_head": "Direct Cost",     "confidence": 87, "source": "claude_haiku"},
            {"ledger_name": "Mess & Canteen Expenses",    "tally_group": "Indirect Expenses",      "mis_head": "Employee Cost",   "confidence": 74, "source": "claude_haiku"},
            {"ledger_name": "MIPINFRA KA Transfer",       "tally_group": "Branch/ Division Account","mis_head": "Intercompany",   "confidence": 99, "source": "rule_engine"},
        ],
    }
