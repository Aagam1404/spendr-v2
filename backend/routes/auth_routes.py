# auth_routes.py - Register and Login endpoints

from fastapi import APIRouter, HTTPException
from database import supabase
from models import RegisterModel, LoginModel
from auth import hash_password, verify_password, create_token

router = APIRouter()

# ─── REGISTER ──────────────────────────────────────────────
@router.post("/register")
def register(data: RegisterModel):
    """Create a new user account"""

    # Check if email already exists
    existing = supabase.table("users").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password before storing
    hashed = hash_password(data.password)

    # Insert new user into database
    result = supabase.table("users").insert({
        "name":     data.name,
        "email":    data.email,
        "password": hashed,
        "role":     "user"
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")

    user = result.data[0]

    # Log the registration activity
    supabase.table("user_activity").insert({
        "user_id":     user["id"],
        "action":      "register",
        "description": f"{user['name']} created an account"
    }).execute()

    # Return JWT token so user is logged in immediately
    token = create_token({"user_id": user["id"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user_id":      user["id"],
        "name":         user["name"],
        "email":        user["email"],
        "role":         user["role"]
    }

# ─── LOGIN ─────────────────────────────────────────────────
@router.post("/login")
def login(data: LoginModel):
    """Login with email and password"""

    # Find user by email
    result = supabase.table("users").select("*").eq("email", data.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = result.data[0]

    # Verify password
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Log the login activity
    supabase.table("user_activity").insert({
        "user_id":     user["id"],
        "action":      "login",
        "description": f"{user['name']} logged in"
    }).execute()

    # Return JWT token
    token = create_token({"user_id": user["id"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user_id":      user["id"],
        "name":         user["name"],
        "email":        user["email"],
        "role":         user["role"]
    }