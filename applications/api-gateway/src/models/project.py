# src/models/project.py

from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from src.models.base import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(100))

    platform: Mapped[str] = mapped_column(String(50))

    customer: Mapped[str] = mapped_column(String(100))

    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)

    tenant = relationship("Tenant", back_populates="projects")
    recordings = relationship("Recording", back_populates="project", cascade="all, delete-orphan")
