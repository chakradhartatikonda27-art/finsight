from fastapi import APIRouter, Depends
from models.schemas import NLQRequest
from core.auth import get_current_user, CurrentUser
from core.config import settings

router = APIRouter()

SMART_QUERIES = {
    "lowest margin site": "NIT-15 TAYALUR has the lowest GP margin at 0.9% (portfolio average 20.3%). Revenue ₹12.84 Cr. Flagged AT RISK. Action: review sub-contractor billing and material costs.",
    "od utilisation": "Combined OD utilisation is 79.2%.\n• HDFC Bank OD: ₹15.00 Cr / ₹20.00 Cr = 75.0%\n• KVB Bank OD: ₹10.83 Cr / ₹12.60 Cr = 86.0% ⚠\nKVB approaching limit. Recommend releasing debtors (₹13.43 Cr outstanding).",
    "ebitda margin": "EBITDA margin is 8.1% (₹4.63 Cr on ₹56.87 Cr revenue). Budget was 10.0%. Gap of 1.9pp driven by material cost overrun ₹3.35 Cr vs budget (+7.9%).",
    "top vendors": "Top 5 vendors by outstanding:\n1. SVP Enterprises — ₹3.42 Cr (62 days)\n2. Bharat Asphalt — ₹2.18 Cr (48 days)\n3. Orange Scaffoldings — ₹1.84 Cr (55 days)\n4. Rajeshwari Steel — ₹1.42 Cr (38 days)\n5. Karnataka Aggregates — ₹1.18 Cr (72 days) ⚠",
    "gst payable": "Net GST payable FY 2025-26: ₹1,11,26,800\n• Output GST: ₹2,53,14,200\n• Input Credit: ₹1,41,87,400\nNext due: 20 July 2026. TX001 TX002 PASS.",
}

def _match(question: str):
    q = question.lower()
    if any(w in q for w in ["lowest margin", "worst site", "site margin", "nit-15"]):
        return SMART_QUERIES["lowest margin site"]
    if any(w in q for w in ["od", "overdraft", "bank limit", "utilisation"]):
        return SMART_QUERIES["od utilisation"]
    if any(w in q for w in ["ebitda", "operating margin"]):
        return SMART_QUERIES["ebitda margin"]
    if any(w in q for w in ["vendor", "supplier", "payable", "outstanding"]):
        return SMART_QUERIES["top vendors"]
    if any(w in q for w in ["gst", "tax payable"]):
        return SMART_QUERIES["gst payable"]
    return None

@router.post("")
async def ask_nlq(
    request: NLQRequest,
    current_user: CurrentUser = Depends(get_current_user),
):
    if settings.ANTHROPIC_API_KEY:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            system = """You are FinSight AI — senior financial analyst for Mudduluru Infratech Pvt. Ltd.
FY 2025-26 data:
Revenue: ₹56.87 Cr | GP: ₹11.52 Cr (20.3%) | EBITDA: ₹4.63 Cr (8.1%) | PAT: (₹87.91 L)
Cash: ₹2.31 Cr | Debtors: ₹13.43 Cr | Creditors: ₹36.70 Cr | Inventory: ₹19.06 Cr
HDFC OD: 75% | KVB OD: 86% | Combined: 79.2%
Sites: NIT-15 Tayalur 0.9% AT RISK, NIT-22 18.4%, NIT-25 22.1%, NIT-27 15.4%, NIT-28 5.8%, Corporate 41.4%
30/30 accounting checks passed.
Answer concisely with specific ₹ figures. Use Indian number format."""
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=500,
                system=system,
                messages=[{"role": "user", "content": request.question}],
            )
            return {
                "question": request.question,
                "answer": response.content[0].text,
                "source": "claude_sonnet",
            }
        except Exception:
            pass

    smart = _match(request.question)
    if smart:
        return {"question": request.question, "answer": smart, "source": "smart_query"}

    return {
        "question": request.question,
        "answer": "Try asking: OD utilisation, site margins, EBITDA, top vendors, GST payable, budget variance. Set ANTHROPIC_API_KEY for full AI answers.",
        "source": "fallback",
    }
