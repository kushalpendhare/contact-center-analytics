from pydantic import BaseModel
from datetime import datetime


class OrganizationCreate(BaseModel):
    name: str
    plan: str = "FREE"


class UserCreate(BaseModel):
    organization_id: int
    full_name: str
    email: str
    password: str
    role: str = "USER"


class SubscriptionCreate(BaseModel):
    organization_id: int
    plan_name: str
    max_users: int = 10


class UserRegister(BaseModel):
    organization_name: str
    full_name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    organization_id: int
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True