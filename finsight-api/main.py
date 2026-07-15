"""
FinSight MIS Platform — FastAPI Application
SiyanTech Global Innovations Pvt. Ltd.
Production-grade multi-tenant MIS reporting API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"FinSight API starting — env={settings.ENVIRONMENT}")
    yield
    print("FinSight API shutting down")

app = FastAPI(
    title="FinSight MIS API",
    description="Tally XLS → Automated MIS Reports. SiyanTech Global Innovations.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import upload, parse, validate, reports, nlq, mapping, companies, export

app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(upload.router,    prefix="/api/upload",    tags=["upload"])
app.include_router(parse.router,     prefix="/api/parse",     tags=["parse"])
app.include_router(mapping.router,   prefix="/api/mapping",   tags=["mapping"])
app.include_router(validate.router,  prefix="/api/validate",  tags=["validate"])
app.include_router(reports.router,   prefix="/api/reports",   tags=["reports"])
app.include_router(export.router,    prefix="/api/export",    tags=["export"])
app.include_router(nlq.router,       prefix="/api/nlq",       tags=["nlq"])

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "finsight-api",
        "version": "2.0.0",
        "database": "supabase",
        "environment": settings.ENVIRONMENT,
        "ai": "claude-haiku-4-5 + claude-sonnet-4-6",
    }

@app.get("/")
async def root():
    return {"message": "FinSight MIS API v2.0. Docs at /docs"}
