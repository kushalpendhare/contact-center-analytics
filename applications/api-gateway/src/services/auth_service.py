from fastapi import HTTPException
from fastapi import status
from sqlalchemy.orm import Session

from src.core.security import create_access_token
from src.core.security import hash_password
from src.core.security import verify_password
from src.models.tenant import Tenant
from src.models.user import User
from src.schemas.auth import UserLogin
from src.schemas.auth import UserRegister


def register_user(db: Session, registration: UserRegister):
    existing_user = (
        db.query(User)
        .filter(User.email == registration.email.lower())
        .first()
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

    tenant = (
        db.query(Tenant)
        .filter(Tenant.name == registration.tenant_name)
        .first()
    )

    if tenant is None:
        tenant = Tenant(name=registration.tenant_name)
        db.add(tenant)
        db.flush()

    user = User(
        email=registration.email.lower(),
        full_name=registration.full_name,
        password_hash=hash_password(registration.password),
        tenant_id=tenant.id
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": create_access_token(user.id),
        "user": user
    }


def login_user(db: Session, credentials: UserLogin):
    user = (
        db.query(User)
        .filter(User.email == credentials.email.lower())
        .first()
    )

    if user is None or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return {
        "access_token": create_access_token(user.id),
        "user": user
    }
