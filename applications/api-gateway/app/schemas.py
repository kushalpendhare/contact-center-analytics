from pydantic import BaseModel

class CallCreate(BaseModel):
    filename: str

class CallResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    status: str

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    filename: str
    message: str
