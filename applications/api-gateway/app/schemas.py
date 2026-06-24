from pydantic import BaseModel
from datetime import datetime

class CallCreate(BaseModel):
    filename: str

class CallResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    filename: str
    message: str 
