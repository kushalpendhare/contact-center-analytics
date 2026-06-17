# src/models/recording.py

from datetime import datetime
from sqlalchemy import Integer, String, ForeignKey, DateTime, Float, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from src.models.base import Base


class RecordingStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Recording(Base):
    __tablename__ = "recordings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), index=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)
    
    name: Mapped[str] = mapped_column(String(255))
    duration_seconds: Mapped[float] = mapped_column(Float, nullable=True)
    
    file_path: Mapped[str] = mapped_column(String(512))  # local: /uploads/tenant_id/project_id/file.mp3
    genesys_call_id: Mapped[str] = mapped_column(String(255), nullable=True, unique=True, index=True)
    
    uploaded_by: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    status: Mapped[RecordingStatus] = mapped_column(Enum(RecordingStatus), default=RecordingStatus.UPLOADED)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="recordings")
    tenant = relationship("Tenant")
    user = relationship("User")
    transcripts = relationship("RecordingTranscript", back_populates="recording", cascade="all, delete-orphan")
    analysis = relationship("RecordingAnalysis", back_populates="recording", uselist=False, cascade="all, delete-orphan")
