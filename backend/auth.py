# auth.py - JWT token creation and verification

import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM  = os.getenv("JWT_ALGORITHM")
EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a plain password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """Check if a plain password matches the hashed version"""
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    """Create a JWT token with an expiry time"""
    payload = data.copy()
    expire  = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decode JWT token and return the current user's data"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        role:    str = payload.get("role")
        if user_id is None:
            raise credentials_exception
        return {"user_id": user_id, "role": role}
    except JWTError:
        raise credentials_exception

def require_admin(current_user: dict = Depends(get_current_user)):
    """Only allow admin users through"""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user