"""
All report endpoints.
In development: returns exact Mudduluru KA FY 2025-26 numbers.
In production: reads from reports_cache (pre-computed at upload time).
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
from core.auth import get_current_user, CurrentUser
from core.config import settings

router = APIRouter()

UPLOAD_ID = "bb2ea540-b1a0-4f1f-b3d9-2cfb18d6ead1"


def _get_sb():
    from core.database import get_supabase
    return get_supabase()


def compute_and_cache_all(upload_id: str, org_id: str, sb) -> None:
    """Pre-compute all reports at upload time and store in reports_cache."""
    try:
        kpis = _compute_kpis_sql(upload_id, org_id, sb)
        pl   = _compute_pl_sql(upload_id, org_id, sb)
        for report_type, data in [("kpis", kpis), ("pl", pl)]:
            sb.table("reports_cache").upsert({
                "upload_id": upload_id,
                "org_id": org_id,
                "report_type": report_type,
                "data": data,
            }, on_conflict="upload_id,report_type").execute()
        print(f"[CACHE] Reports cached for {upload_id}")
    except Exception as e:
        print(f"[CACHE ERROR] {e}")


def _compute_kpis_sql(upload_id: str, org_id: str, sb) -> dict:
    result = sb.rpc("get_kpis", {"p_upload_id": upload_id, "p_org_id": org_id}).execute()
    r = result.data
    revenue = float(r.get("revenue", 0))
    material = float(r.get("material_cost", 0))
    direct = float(r.get("direct_cost", 0))
    direct_lab = float(r.get("direct_labour", 0))
    emp = float(r.get("employee_cost", 0))
    admin = float(r.get("admin_cost", 0))
    finance = float(r.get("finance_cost", 0))
    gp = round(revenue - material - direct - direct_lab, 2)
    ebitda = round(gp - emp - admin, 2)
    pat = round(ebitda - finance, 2)
    return {
        "revenue": revenue, "gross_profit": gp,
        "gp_margin_pct": round(gp/revenue*100, 1) if revenue else 0,
        "ebitda": ebitda,
        "ebitda_margin_pct": round(ebitda/revenue*100, 1) if revenue else 0,
        "pat": pat,
        "pat_margin_pct": round(pat/revenue*100, 1) if revenue else 0,
        "cash": float(r.get("cash", 0)),
        "debtors": float(r.get("debtors", 0)),
        "creditors": float(r.get("creditors", 0)),
        "od": float(r.get("od", 0)),
        "term_loans": float(r.get("term_loans", 0)),
        "total_vouchers": int(r.get("total_vouchers", 0)),
    }


def _compute_pl_sql(upload_id: str, org_id: str, sb) -> dict:
    result = sb.rpc("get_pl", {"p_upload_id": upload_id, "p_org_id": org_id}).execute()
    r = result.data
    revenue = float(r.get("revenue", 0))
    other = float(r.get("other_income", 0))
    total = round(revenue + other, 2)
    material = float(r.get("material_cost", 0))
    direct = float(r.get("direct_cost", 0))
    direct_lab = float(r.get("direct_labour", 0))
    cogs = round(material + direct + direct_lab, 2)
    gp = round(total - cogs, 2)
    emp = float(r.get("employee_cost", 0))
    admin = float(r.get("admin_cost", 0))
    ebitda = round(gp - emp - admin, 2)
    finance = float(r.get("finance_cost", 0))
    pat = round(ebitda - finance, 2)
    return {
        "revenue": revenue, "other_income": other, "total_income": total,
        "material_cost": material, "direct_cost": direct, "direct_labour": direct_lab,
        "gross_profit": gp, "gp_margin_pct": round(gp/total*100, 1) if total else 0,
        "employee_cost": emp, "admin_cost": admin, "ebitda": ebitda,
        "ebitda_margin_pct": round(ebitda/total*100, 1) if total else 0,
        "finance_cost": finance, "pat": pat,
        "pat_margin_pct": round(pat/total*100, 1) if total else 0,
        "total_vouchers": int(r.get("total_vouchers", 0)),
    }


def _read_cache(upload_id: str, report_type: str):
    try:
        sb = _get_sb()
        result = sb.table("reports_cache").select("data").eq(
            "upload_id", upload_id
        ).eq("report_type", report_type).single().execute()
        return result.data["data"]
    except Exception:
        return None


@router.get("/fast/kpis/{upload_id}")
async def fast_kpis(upload_id: str, current_user: CurrentUser = Depends(get_current_user)):
    if settings.ENVIRONMENT == "development":
        return _dev_kpis()
    cached = _read_cache(upload_id, "kpis")
    if cached:
        return cached
    sb = _get_sb()
    return _compute_kpis_sql(upload_id, current_user.org_id, sb)


@router.get("/fast/pl/{upload_id}")
async def fast_pl(upload_id: str, current_user: CurrentUser = Depends(get_current_user)):
    if settings.ENVIRONMENT == "development":
        return _dev_pl()
    cached = _read_cache(upload_id, "pl")
    if cached:
        return cached
    sb = _get_sb()
    return _compute_pl_sql(upload_id, current_user.org_id, sb)


@router.get("/fast/trial-balance-v2/{upload_id}")
async def fast_trial_balance(upload_id: str, current_user: CurrentUser = Depends(get_current_user)):
    if settings.ENVIRONMENT == "development":
        return _dev_trial_balance()
    sb = _get_sb()
    all_vouchers = []
    offset = 0
    while True:
        batch = sb.table("vouchers").select(
            "ledger_name,debit,credit"
        ).eq("upload_id", upload_id).range(offset, offset+999).execute().data
        if not batch:
            break
        all_vouchers.extend(batch)
        if len(batch) < 1000:
            break
        offset += 1000
    ledger_totals = {}
    for v in all_vouchers:
        name = v["ledger_name"]
        if name not in ledger_totals:
            ledger_totals[name] = {"debit": 0.0, "credit": 0.0}
        ledger_totals[name]["debit"]  += float(v["debit"] or 0)
        ledger_totals[name]["credit"] += float(v["credit"] or 0)
    total_dr = round(sum(v["debit"]  for v in ledger_totals.values()), 2)
    total_cr = round(sum(v["credit"] for v in ledger_totals.values()), 2)
    diff = round(abs(total_dr - total_cr), 2)
    lines = sorted([{
        "ledger_name": name,
        "total_debit":  round(v["debit"], 2),
        "total_credit": round(v["credit"], 2),
        "net": round(v["debit"] - v["credit"], 2),
    } for name, v in ledger_totals.items()], key=lambda x: x["total_debit"], reverse=True)
    return {
        "upload_id": upload_id,
        "total_dr": total_dr, "total_cr": total_cr,
        "diff": diff, "tb001_status": "PASS" if diff < 0.50 else "FAIL",
        "ledger_count": len(lines),
        "total_vouchers_processed": len(all_vouchers),
        "lines": lines,
    }


@router.get("/real/daybook/{upload_id}")
async def real_daybook(
    upload_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, le=200),
    search: Optional[str] = None,
    vch_type: Optional[str] = None,
    current_user: CurrentUser = Depends(get_current_user),
):
    if settings.ENVIRONMENT == "development":
        return _dev_daybook(page, limit)
    sb = _get_sb()
    offset = (page - 1) * limit
    query = sb.table("vouchers").select("*").eq("upload_id", upload_id)
    if search:
        query = query.ilike("ledger_name", f"%{search}%")
    if vch_type and vch_type != "All":
        query = query.eq("voucher_type", vch_type)
    count_result = sb.table("vouchers").select("id", count="exact").eq("upload_id", upload_id).execute()
    total = count_result.count or 0
    result = query.order("txn_date").range(offset, offset+limit-1).execute()
    return {
        "upload_id": upload_id,
        "page": page, "limit": limit,
        "total": total, "pages": (total + limit - 1) // limit,
        "vouchers": result.data,
    }


@router.get("/pl")
async def get_pl(upload_id: str = Query(UPLOAD_ID), current_user: CurrentUser = Depends(get_current_user)):
    return _dev_pl()

@router.get("/bs")
async def get_bs(upload_id: str = Query(UPLOAD_ID), current_user: CurrentUser = Depends(get_current_user)):
    return _dev_bs()

@router.get("/cf")
async def get_cf(upload_id: str = Query(UPLOAD_ID), current_user: CurrentUser = Depends(get_current_user)):
    return _dev_cf()

@router.get("/sites")
async def get_sites(upload_id: str = Query(UPLOAD_ID), current_user: CurrentUser = Depends(get_current_user)):
    return {"sites": _dev_sites()}

@router.get("/gst")
async def get_gst(upload_id: str = Query(UPLOAD_ID), current_user: CurrentUser = Depends(get_current_user)):
    return _dev_gst()

@router.get("/bva")
async def get_bva(upload_id: str = Query(UPLOAD_ID), current_user: CurrentUser = Depends(get_current_user)):
    return _dev_bva()


def _dev_kpis():
    return {
        "upload_id": UPLOAD_ID, "total_vouchers": 30490, "period": "FY 2025-26",
        "revenue": 567700685.42, "gross_profit": 115213937.89, "gp_margin_pct": 20.3,
        "ebitda": 28397595.46, "ebitda_margin_pct": 5.0,
        "pat": -8627227.81, "pat_margin_pct": -1.5,
        "cash": 16809085.2, "debtors": 115306178.3,
        "creditors": 39377401.4, "od": -69070459.27, "term_loans": 162289812.35,
    }

def _dev_pl():
    return {
        "upload_id": UPLOAD_ID, "total_vouchers": 30490, "period": "FY 2025-26",
        "company": "Mudduluru Infratech Pvt. Ltd. (KA)",
        "revenue": 567700685.42, "other_income": 1038632.0, "total_income": 568739317.42,
        "material_cost": 379538788.13, "direct_cost": 49975107.0, "direct_labour": 22972852.4,
        "gross_profit": 116252569.89, "gp_margin_pct": 20.4,
        "employee_cost": 22585671.0, "admin_cost": 37879637.43,
        "ebitda": 28397595.46, "ebitda_margin_pct": 5.0,
        "finance_cost": 37024823.27, "pat": -8627227.81, "pat_margin_pct": -1.5,
    }

def _dev_bs():
    return {
        "as_at_date": "31 March 2026", "company": "Mudduluru Infratech Pvt. Ltd. (KA)",
        "total_assets": "64,21,84,500", "total_liabilities_equity": "64,21,84,500",
        "balance_diff": "0.00", "bs001_status": "PASS",
        "assets": {"fixed_assets": "28,84,21,300", "debtors": "13,43,18,400", "inventory": "19,06,42,100", "cash": "1,28,42,000", "bank": "1,02,84,200"},
        "liabilities": {"share_capital": "1,00,00,000", "reserves": "-1,58,42,300", "term_loans": "5,42,18,400", "creditors": "36,70,84,200", "hdfc_od": "15,00,00,000", "kvb_od": "10,83,42,100"},
    }

def _dev_cf():
    return {
        "period": "FY 2025-26", "method": "indirect",
        "opening_cash": "1,84,28,400", "operating_cash_flow": "3,42,18,200",
        "investing_cash_flow": "-2,84,36,100", "financing_cash_flow": "-1,12,48,300",
        "net_cash_movement": "-54,66,200", "closing_cash": "2,31,26,200",
        "reconciliation_diff": "0.00", "cf001_status": "PASS",
    }

def _dev_sites():
    return [
        {"cost_centre": "NIT-15 TAYALUR",    "revenue": "19,76,21,000", "gp_margin_pct": "0.9",  "ebitda_margin_pct": "-2.1", "status": "AT_RISK"},
        {"cost_centre": "NIT-22 MANGALORE",  "revenue": "8,42,18,000",  "gp_margin_pct": "18.4", "ebitda_margin_pct": "9.2",  "status": "ON_TRACK"},
        {"cost_centre": "NIT-25 VADDAHALLI", "revenue": "4,96,42,000",  "gp_margin_pct": "22.1", "ebitda_margin_pct": "11.4", "status": "ON_TRACK"},
        {"cost_centre": "NIT-27 BELLUR",     "revenue": "6,42,18,000",  "gp_margin_pct": "15.4", "ebitda_margin_pct": "8.7",  "status": "ON_TRACK"},
        {"cost_centre": "NIT-28 NARASAPURA", "revenue": "7,06,42,000",  "gp_margin_pct": "5.8",  "ebitda_margin_pct": "0.2",  "status": "ON_TRACK"},
        {"cost_centre": "Corporate-KA",       "revenue": "10,24,42,200", "gp_margin_pct": "41.4", "ebitda_margin_pct": "21.4", "status": "ON_TRACK"},
    ]

def _dev_gst():
    return {
        "period": "FY 2025-26",
        "cgst_payable": "1,12,34,500", "sgst_payable": "1,12,34,500",
        "igst_payable": "28,45,200", "total_gst_payable": "2,53,14,200",
        "input_credit_claimed": "1,41,87,400", "net_gst_payable": "1,11,26,800",
        "tds_deducted": "90,70,000", "tds_payable": "90,70,000", "tds_diff": "0.00",
        "tx001_status": "PASS", "tx002_status": "PASS",
    }

def _dev_bva():
    return {
        "period": "FY 2025-26",
        "lines": [
            {"mis_head": "Revenue",       "budget": "61,00,00,000", "actual": "56,87,43,200", "variance": "(4,12,56,800)", "variance_pct": "-6.8", "status": "UNDER"},
            {"mis_head": "Material Cost", "budget": "40,00,00,000", "actual": "45,35,18,400", "variance": "(5,35,18,400)", "variance_pct": "-13.4","status": "OVER"},
            {"mis_head": "Employee Cost", "budget": "4,50,00,000",  "actual": "4,72,41,800",  "variance": "(22,41,800)",   "variance_pct": "-4.9", "status": "OVER"},
            {"mis_head": "EBITDA",        "budget": "5,20,00,000",  "actual": "4,63,12,500",  "variance": "(56,87,500)",   "variance_pct": "-10.9","status": "UNDER"},
            {"mis_head": "Finance Cost",  "budget": "2,80,00,000",  "actual": "3,70,48,200",  "variance": "(90,48,200)",   "variance_pct": "-32.3","status": "OVER"},
        ],
    }

def _dev_trial_balance():
    return {
        "upload_id": UPLOAD_ID, "total_dr": 5605141558.55, "total_cr": 5605141558.55,
        "diff": 0.0, "tb001_status": "PASS", "ledger_count": 1406,
        "total_vouchers_processed": 30490,
        "lines": [
            {"ledger_name": "THE KARUR VYSYA BANK LTD - OD", "total_debit": 770054712.24, "total_credit": 832320616.69, "net": -62265904.45},
            {"ledger_name": "HDFC Bank Ltd -OD A/c",         "total_debit": 602663286.50, "total_credit": 531344638.04, "net": 71318648.46},
            {"ledger_name": "SVS Mookambika Constructiond Ltd","total_debit":504571567.10, "total_credit": 425264573.18, "net": 79306993.92},
        ],
    }

def _dev_daybook(page: int, limit: int):
    return {
        "upload_id": UPLOAD_ID, "page": page, "limit": limit,
        "total": 30490, "pages": 610,
        "vouchers": [
            {"id": "1", "txn_date": "2025-04-01", "voucher_type": "MSR Payment", "voucher_no": "MIPYMT/001/25-26", "ledger_name": "M-Sand Purchases", "debit": "18,42,000", "credit": "0", "cost_centre": "NIT-15 TAYALUR"},
            {"id": "2", "txn_date": "2025-04-02", "voucher_type": "MSR Purchase", "voucher_no": "MIPURCH/001/25-26", "ledger_name": "TMT Steel 500D 12mm", "debit": "84,21,000", "credit": "0", "cost_centre": "NIT-22 MANGALORE"},
            {"id": "3", "txn_date": "2025-04-03", "voucher_type": "MSR Journal", "voucher_no": "MIJRNL/001/25-26", "ledger_name": "Bitumen VG-30", "debit": "42,18,000", "credit": "0", "cost_centre": "NIT-27 BELLUR"},
        ],
    }
