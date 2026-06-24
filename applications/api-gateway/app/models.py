from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    filepath = Column(String)
    status = Column(String)

    created_at = Column(
    DateTime(timezone=True),
    server_default=func.now()
)

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True)
    call_id = Column(Integer)
    transcript = Column(String)
    sentiment = Column(String)
    summary = Column(Text)
    created_at = Column(
    DateTime(timezone=True),
    server_default=func.now()
)