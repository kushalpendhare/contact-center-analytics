from pydantic import BaseModel
from pydantic import EmailStr


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    tenant_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TenantResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    tenant: TenantResponse

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
