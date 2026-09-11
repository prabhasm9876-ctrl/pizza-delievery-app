from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    surname: Optional[str] = None
    middlename: Optional[str] = None
    phone: Optional[str] = None
    email: EmailStr
    role: Optional[str] = "user"


class UserCreate(UserBase):
    name: str
    surname: Optional[str] = None
    middlename: Optional[str] = None
    phone: Optional[str] = None
    email: EmailStr
    role: Optional[str] = "user"
    password: str  

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    user_id: int

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    middlename: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
