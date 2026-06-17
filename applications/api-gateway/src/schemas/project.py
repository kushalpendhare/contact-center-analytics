# src/schemas/project.py
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    platform: str
    customer: str

class ProjectResponse(BaseModel):
    id: int
    name: str
    platform: str
    customer: str

    class Config:
        from_attributes = True