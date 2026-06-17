# src/models/transcript.py

from datetime import datetime
from sqlalchemy import Integer, ForeignKey, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base


class RecordingTranscript(Base):
    __tablename__ = "recording_transcripts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    recording_id: Mapped[int] = mapped_column(ForeignKey("recordings.id"), index=True)
    
    text: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(50))  # "aws-transcribe", "genesys-api", "manual"
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    recording = relationship("Recording", back_populates="transcripts")
