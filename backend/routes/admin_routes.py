# admin_routes.py - Admin only endpoints

from fastapi import APIRouter, Depends
from database import supabase
from auth import require_admin

router = APIRouter()

# ─── GET ALL USERS ─────────────────────────────────────────
@router.get("/users")
def get_all_users(current_user: dict = Depends(require_admin)):
    """Get all registered users — admin only"""
    result = supabase.table("users")\
        .select("id, name, email, role, created_at")\
        .order("created_at", desc=True)\
        .execute()
    return result.data

# ─── GET ALL ACTIVITY LOGS ─────────────────────────────────
@router.get("/activity")
def get_all_activity(current_user: dict = Depends(require_admin)):
    """Get all user activity logs — admin only"""
    result = supabase.table("user_activity")\
        .select("*, users(name, email)")\
        .order("created_at", desc=True)\
        .execute()
    return result.data

# ─── GET ALL EXPENSES ──────────────────────────────────────
@router.get("/expenses")
def get_all_expenses(current_user: dict = Depends(require_admin)):
    """Get all expenses from all users — admin only"""
    result = supabase.table("expenses")\
        .select("*, users(name, email)")\
        .order("created_at", desc=True)\
        .execute()
    return result.data