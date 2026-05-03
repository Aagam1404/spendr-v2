# models.py - Pydantic models for request/response validation

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

# ─── AUTH MODELS ───────────────────────────────────────────
class RegisterModel(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

# ─── EXPENSE MODELS ────────────────────────────────────────
class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[date] = None

# ─── RESPONSE MODELS ───────────────────────────────────────
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    name: str
    email: str
    role: str