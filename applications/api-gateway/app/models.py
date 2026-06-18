from sqlalchemy import Column, Integer, String
from .database import Base

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    filepath = Column(String)
    status = Column(String)