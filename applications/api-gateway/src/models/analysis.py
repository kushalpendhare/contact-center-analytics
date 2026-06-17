# src/models/analysis.py

from datetime import datetime
from sqlalchemy import Integer, ForeignKey, DateTime, String, Text, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base


class RecordingAnalysis(Base):
    __tablename__ = "recording_analysis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    recording_id: Mapped[int] = mapped_column(ForeignKey("recordings.id"), index=True, unique=True)
    
    summary: Mapped[str] = mapped_column(Text)
    sentiment: Mapped[str] = mapped_column(String(20))  # "positive", "neutral", "negative"
    agent_score: Mapped[float] = mapped_column(Float)  # 0-100
    
    compliance_flags: Mapped[dict] = mapped_column(JSON)  # {"pii_detected": bool, "regulatory_issues": [...]}
    keywords: Mapped[list] = mapped_column(JSON)  # ["keyword1", "keyword2", ...]
    
    analysis_metadata: Mapped[dict] = mapped_column(JSON)  # {"model": "claude-3-sonnet", "tokens": 1024, "cost": 0.05}
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    recording = relationship("Recording", back_populates="analysis")
