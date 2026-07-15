from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "dev-secret-key"
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: List[str] = ["xls", "xlsx", "csv", "xml"]
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://finsight-sandy.vercel.app",
        "https://*.vercel.app",
        "https://*.railway.app",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
