from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.schemas.auth import UserRegister
from src.services.auth_service import register_user

router = APIRouter(
    prefix="/dev",
    tags=["Dev"]
)


@router.post("/seed")
def seed(db: Session = Depends(get_db)):
    """Create a demo tenant and user and return an auth response.

    This endpoint is for local testing only.
    """
    registration = UserRegister(
        email="demo@example.com",
        password="password",
        full_name="Demo User",
        tenant_name="Demo Tenant"
    )

    try:
        return register_user(db, registration)
    except Exception as exc:
        return {"error": str(exc)}
