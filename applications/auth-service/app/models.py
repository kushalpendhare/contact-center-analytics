from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from .database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, nullable=False)

    plan = Column(
        String,
        default="FREE"
    )

    status = Column(
        String,
        default="ACTIVE"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id")
    )

    plan_name = Column(
        String,
        nullable=False
    )

    max_users = Column(
        Integer,
        default=10
    )

    status = Column(
        String,
        default="ACTIVE"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id")
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        default="USER"
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )