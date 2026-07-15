from dataclasses import dataclass
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings

security = HTTPBearer(auto_error=False)

@dataclass
class CurrentUser:
    user_id: str
    org_id: str
    role: str
    email: str = ""

    def require(self, permission: str) -> None:
        pass  # Implement Clerk JWT validation in production

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> CurrentUser:
    if settings.ENVIRONMENT == "development":
        return CurrentUser(
            user_id="dev-user-001",
            org_id="mudduluru-ka",
            role="CFO",
            email="dev@siyantechglobal.com",
        )
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    # Production: validate Clerk JWT here
    return CurrentUser(user_id="prod-user", org_id="prod-org", role="CFO")
