# src/schemas/recording.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RecordingResponse(BaseModel):
    id: int
    project_id: int
    name: str
    duration_seconds: Optional[float]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RecordingTranscriptResponse(BaseModel):
    id: int
    recording_id: int
    text: str
    source: str
    created_at: datetime

    class Config:
        from_attributes = True


class ComplianceFlagsResponse(BaseModel):
    pii_detected: bool
    regulatory_issues: list[str]


class AnalysisMetadataResponse(BaseModel):
    model: str
    tokens: int
    cost: float
    timestamp: str


class RecordingAnalysisResponse(BaseModel):
    id: int
    recording_id: int
    summary: str
    sentiment: str
    agent_score: float
    compliance_flags: ComplianceFlagsResponse
    keywords: list[str]
    analysis_metadata: AnalysisMetadataResponse
    created_at: datetime

    class Config:
        from_attributes = True


class RecordingDetailResponse(BaseModel):
    recording: RecordingResponse
    transcript: Optional[RecordingTranscriptResponse]
    analysis: Optional[RecordingAnalysisResponse]

    class Config:
        from_attributes = True


class RecordingStatsResponse(BaseModel):
    total_recordings: int
    analyzed_recordings: int
    average_agent_score: float
