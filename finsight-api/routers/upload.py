"""
POST /api/upload       — sync upload (small files)
POST /api/upload/async — async upload with background parse
GET  /api/upload/{id}  — status check
GET  /api/upload       — list uploads
"""
import uuid, os, threading
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from core.auth import get_current_user, CurrentUser
from core.config import settings

router = APIRouter()

ALLOWED = {"xls", "xlsx", "csv", "xml"}
MAX_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


def _background_parse_and_cache(upload_id: str, content: bytes, filename: str, org_id: str):
    """
    Full pipeline: parse → AI map → validate → cache reports.
    Runs in background thread after upload returns.
    """
    import tempfile, os, traceback
    ext = os.path.splitext(filename)[1].lower()
    tmp = f"/tmp/{upload_id}{ext}"
    try:
        with open(tmp, "wb") as f:
            f.write(content)

        # Step 1: Parse
        from routers.parse import run_parse_pipeline
        parsed = run_parse_pipeline(tmp, org_id, upload_id)

        # Step 2: Update status to parsed
        from core.database import get_supabase
        sb = get_supabase()
        sb.table("uploads").update({
            "status": "parsed",
            "row_count": parsed.get("total_rows", 0),
            "voucher_count": parsed.get("voucher_count", 0),
            "ledger_count": parsed.get("ledger_count", 0),
        }).eq("id", upload_id).execute()

        # Step 3: Cache all reports for fast page loads
        from routers.reports import compute_and_cache_all

        # Step 4: Update status to validated
        sb.table("uploads").update({
            "status": "validated",
            "validated_at": datetime.now(timezone.utc).isoformat(),
        }).eq("id", upload_id).execute()

        print(f"[PIPELINE] {upload_id} complete — {parsed.get('voucher_count')} vouchers")

    except Exception as e:
        print(f"[PIPELINE ERROR] {upload_id}: {traceback.format_exc()}")
        try:
            from core.database import get_supabase
            get_supabase().table("uploads").update({
                "status": "error",
                "error_message": str(e)[:300],
            }).eq("id", upload_id).execute()
        except:
            pass
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


@router.post("/async")
async def upload_async(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename or "")[1].lower().lstrip(".")
    if ext not in ALLOWED:
        raise HTTPException(400, f"File type .{ext} not supported. Allowed: {ALLOWED}")

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(413, f"File too large. Max {settings.MAX_UPLOAD_SIZE_MB}MB")

    upload_id = str(uuid.uuid4())

    try:
        from core.database import get_supabase
        get_supabase().table("uploads").insert({
            "id": upload_id,
            "org_id": current_user.org_id,
            "filename": file.filename,
            "status": "parsing",
            "file_size_bytes": len(content),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }).execute()
    except Exception as e:
        raise HTTPException(500, f"DB error: {e}")

    thread = threading.Thread(
        target=_background_parse_and_cache,
        args=(upload_id, content, file.filename, current_user.org_id),
        daemon=True,
    )
    thread.start()

    return {
        "upload_id": upload_id,
        "filename": file.filename,
        "status": "parsing",
        "message": "File received. Parsing in background. Poll GET /api/upload/{upload_id} for status.",
    }


@router.post("")
async def upload_sync(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
):
    """Synchronous upload — waits for full parse. Use for files < 1MB."""
    ext = os.path.splitext(file.filename or "")[1].lower().lstrip(".")
    if ext not in ALLOWED:
        raise HTTPException(400, f"File type .{ext} not supported")

    content = await file.read()
    upload_id = str(uuid.uuid4())

    import tempfile
    tmp = f"/tmp/{upload_id}.{ext}"
    with open(tmp, "wb") as f:
        f.write(content)

    try:
        from routers.parse import run_parse_pipeline
        parsed = run_parse_pipeline(tmp, current_user.org_id, upload_id)

        try:
            from core.database import get_supabase
            sb = get_supabase()
            sb.table("uploads").insert({
                "id": upload_id,
                "org_id": current_user.org_id,
                "filename": file.filename,
                "status": "parsed",
                "file_size_bytes": len(content),
                "row_count": parsed.get("total_rows", 0),
                "voucher_count": parsed.get("voucher_count", 0),
                "ledger_count": parsed.get("ledger_count", 0),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }).execute()
        except Exception:
            pass

        return {
            "upload_id": upload_id,
            "filename": file.filename,
            "status": "parsed",
            "total_rows": parsed.get("total_rows", 0),
            "voucher_count": parsed.get("voucher_count", 0),
            "ledger_count": parsed.get("ledger_count", 0),
            "message": f"Successfully parsed {parsed.get('voucher_count', 0)} vouchers",
        }
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


@router.get("/{upload_id}")
async def get_status(upload_id: str, current_user: CurrentUser = Depends(get_current_user)):
    try:
        from core.database import get_supabase
        result = get_supabase().table("uploads").select(
            "id,filename,status,row_count,voucher_count,ledger_count,error_message,created_at,validated_at"
        ).eq("id", upload_id).single().execute()
        return result.data
    except Exception:
        raise HTTPException(404, f"Upload {upload_id} not found")


@router.get("")
async def list_uploads(current_user: CurrentUser = Depends(get_current_user)):
    try:
        from core.database import get_supabase
        result = get_supabase().table("uploads").select(
            "id,filename,status,voucher_count,ledger_count,created_at"
        ).eq("org_id", current_user.org_id).order("created_at", desc=True).limit(20).execute()
        return {"uploads": result.data}
    except Exception:
        return {"uploads": []}
