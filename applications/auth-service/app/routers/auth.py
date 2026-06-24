from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from ..database import get_db

from ..models import (
    User,
    Organization,
    Subscription
)

from ..schemas import (
    UserRegister,
    UserLogin,
    TokenResponse,
    OrganizationCreate,
    UserCreate,
    SubscriptionCreate
)

from ..security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter()


# -------------------
# AUTH
# -------------------

@router.post("/auth/register")
def register(
    request: UserRegister,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.name ==
            request.organization_name
        )
        .first()
    )

    if not organization:
        organization = Organization(
            name=request.organization_name
        )

        db.add(organization)
        db.commit()
        db.refresh(organization)

    user = User(
        organization_id=organization.id,
        email=request.email,
        full_name=request.full_name,
        password_hash=hash_password(
            request.password
        ),
        role="ORG_ADMIN"
    )

    db.add(user)
    db.commit()

    return {
        "message": "User registered"
    }


@router.post(
    "/auth/login",
    response_model=TokenResponse
)
def login(
    request: UserLogin,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(
            User.email ==
            request.email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        request.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "organization_id": user.organization_id,
            "email": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# -------------------
# ORGANIZATIONS
# -------------------

@router.get("/organizations")
def get_organizations(
    db: Session = Depends(get_db)
):
    return (
        db.query(Organization)
        .order_by(
            Organization.id.desc()
        )
        .all()
    )


@router.post("/organizations")
def create_organization(
    request: OrganizationCreate,
    db: Session = Depends(get_db)
):
    organization = Organization(
        name=request.name,
        plan=request.plan
    )

    db.add(organization)
    db.commit()
    db.refresh(organization)

    return organization


# -------------------
# USERS
# -------------------

@router.get("/users")
def get_users(
    db: Session = Depends(get_db)
):
    return (
        db.query(User)
        .order_by(
            User.id.desc()
        )
        .all()
    )


@router.post("/users")
def create_user(
    request: UserCreate,
    db: Session = Depends(get_db)
):
    user = User(
        organization_id=request.organization_id,
        email=request.email,
        full_name=request.full_name,
        role=request.role,
        password_hash=hash_password(
            request.password
        )
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# -------------------
# SUBSCRIPTIONS
# -------------------

@router.get("/subscriptions")
def get_subscriptions(
    db: Session = Depends(get_db)
):
    return (
        db.query(Subscription)
        .order_by(
            Subscription.id.desc()
        )
        .all()
    )


@router.post("/subscriptions")
def create_subscription(
    request: SubscriptionCreate,
    db: Session = Depends(get_db)
):
    subscription = Subscription(
        organization_id=request.organization_id,
        plan_name=request.plan_name,
        max_users=request.max_users
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


@router.get("/auth/me")
def me():
    return {
        "message": "authenticated"
    }