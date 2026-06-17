from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from src.core.auth import get_current_user
from src.core.database import get_db
from src.models.user import User
from src.schemas.auth import AuthResponse
from src.schemas.auth import UserLogin
from src.schemas.auth import UserRegister
from src.schemas.auth import UserResponse
from src.services.auth_service import login_user
from src.services.auth_service import register_user


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register", response_model=AuthResponse)
def register(
    registration: UserRegister,
    db: Session = Depends(get_db)
):
    return register_user(db, registration)


@router.post("/login", response_model=AuthResponse)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    return login_user(db, credentials)


@router.get("/me", response_model=UserResponse)
def me(
    current_user: User = Depends(get_current_user)
):
    return current_user
