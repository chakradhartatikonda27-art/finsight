from fastapi import APIRouter, Depends
from core.auth import get_current_user, CurrentUser
from core.config import settings

router = APIRouter()

DEV_COMPANIES = [
    {"id": "mudduluru-ka", "name": "Mudduluru Infratech Pvt. Ltd. (KA)", "tally_format": "KA", "fiscal_year": "2025-26", "subscription_tier": "growth"},
    {"id": "mudduluru-ap", "name": "Mudduluru Infratech Pvt. Ltd. (AP)", "tally_format": "AP", "fiscal_year": "2025-26", "subscription_tier": "growth"},
]

@router.get("")
async def list_companies(current_user: CurrentUser = Depends(get_current_user)):
    if settings.ENVIRONMENT == "development":
        return {"companies": DEV_COMPANIES}
    try:
        from core.database import get_supabase
        result = get_supabase().table("companies").select("*").execute()
        return {"companies": result.data}
    except Exception:
        return {"companies": DEV_COMPANIES}

@router.post("")
async def create_company(company: dict, current_user: CurrentUser = Depends(get_current_user)):
    from core.database import get_supabase
    result = get_supabase().table("companies").insert(company).execute()
    return result.data[0]
