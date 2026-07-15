from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from core.auth import get_current_user, CurrentUser

router = APIRouter()

@router.get("/excel")
async def export_excel(
    upload_id: str = Query(...),
    report_type: str = Query("pl"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return JSONResponse({"message": f"Excel export for {report_type} — implement with openpyxl", "upload_id": upload_id})

@router.get("/pdf")
async def export_pdf(
    upload_id: str = Query(...),
    report_type: str = Query("pl"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return JSONResponse({"message": f"PDF export for {report_type} — implement with reportlab", "upload_id": upload_id})
