# expense_routes.py - All expense CRUD endpoints

from fastapi import APIRouter, Depends, HTTPException
from database import supabase
from models import ExpenseCreate, ExpenseUpdate
from auth import get_current_user

router = APIRouter()

# ─── GET ALL EXPENSES ──────────────────────────────────────
@router.get("/")
def get_expenses(current_user: dict = Depends(get_current_user)):
    """Get all expenses for the current logged in user"""
    result = supabase.table("expenses")\
        .select("*")\
        .eq("user_id", current_user["user_id"])\
        .order("date", desc=True)\
        .execute()
    return result.data

# ─── CREATE EXPENSE ────────────────────────────────────────
@router.post("/")
def create_expense(data: ExpenseCreate, current_user: dict = Depends(get_current_user)):
    """Add a new expense for the current user"""
    result = supabase.table("expenses").insert({
        "user_id":  current_user["user_id"],
        "title":    data.title,
        "amount":   data.amount,
        "category": data.category,
        "date":     str(data.date)
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create expense")

    # Log the activity
    supabase.table("user_activity").insert({
        "user_id":     current_user["user_id"],
        "action":      "create_expense",
        "description": f"Added expense: {data.title} (${data.amount})"
    }).execute()

    return result.data[0]

# ─── UPDATE EXPENSE ────────────────────────────────────────
@router.put("/{expense_id}")
def update_expense(expense_id: int, data: ExpenseUpdate, current_user: dict = Depends(get_current_user)):
    """Update an existing expense"""

    # Make sure expense belongs to current user
    existing = supabase.table("expenses")\
        .select("*")\
        .eq("id", expense_id)\
        .eq("user_id", current_user["user_id"])\
        .execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="Expense not found")

    # Only update fields that were provided
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if "date" in update_data:
        update_data["date"] = str(update_data["date"])

    result = supabase.table("expenses")\
        .update(update_data)\
        .eq("id", expense_id)\
        .execute()

    # Log the activity
    supabase.table("user_activity").insert({
        "user_id":     current_user["user_id"],
        "action":      "update_expense",
        "description": f"Updated expense ID {expense_id}"
    }).execute()

    return result.data[0]

# ─── DELETE EXPENSE ────────────────────────────────────────
@router.delete("/{expense_id}")
def delete_expense(expense_id: int, current_user: dict = Depends(get_current_user)):
    """Delete an expense"""

    # Make sure expense belongs to current user
    existing = supabase.table("expenses")\
        .select("*")\
        .eq("id", expense_id)\
        .eq("user_id", current_user["user_id"])\
        .execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="Expense not found")

    supabase.table("expenses").delete().eq("id", expense_id).execute()

    # Log the activity
    supabase.table("user_activity").insert({
        "user_id":     current_user["user_id"],
        "action":      "delete_expense",
        "description": f"Deleted expense ID {expense_id}"
    }).execute()

    return {"message": "Expense deleted successfully"}