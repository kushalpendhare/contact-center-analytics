from fastapi import FastAPI
from contextlib import asynccontextmanager

from .database import engine
from .models import Base

from .routers.auth import router
from fastapi.middleware.cors import CORSMiddleware

from .security import hash_password
from .models import User
from .models import Organization

@asynccontextmanager
async def lifespan(app: FastAPI):

    Base.metadata.create_all(
        bind=engine
    )

    yield


app = FastAPI(
    title="CCA Auth Service",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "service": "auth-service"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.get("/bootstrap")
def bootstrap():

    from .database import SessionLocal
    from .models import User
    from .models import Organization
    from .security import hash_password

    db = SessionLocal()

    org = (
        db.query(Organization)
        .filter(
            Organization.name == "CCA"
        )
        .first()
    )

    if not org:
        org = Organization(
            name="CCA",
            plan="ENTERPRISE"
        )

        db.add(org)
        db.commit()
        db.refresh(org)

    existing_user = (
        db.query(User)
        .filter(
            User.email ==
            "superadmin@cca.com"
        )
        .first()
    )

    if existing_user:
        return {
            "message":
            "already exists"
        }

    user = User(
        organization_id=org.id,
        email="superadmin@cca.com",
        full_name="Platform Admin",
        password_hash=hash_password(
            "Admin@123"
        ),
        role="SUPER_ADMIN"
    )

    db.add(user)
    db.commit()

    return {
        "message":
        "created"
    }