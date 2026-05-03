# main.py - FastAPI application entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.expense_routes import router as expense_router
from routes.admin_routes import router as admin_router

# ─── APP SETUP ─────────────────────────────────────────────
app = FastAPI(title="SpendR API", version="1.0.0")

# ─── CORS ──────────────────────────────────────────────────
# Allows the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTES ────────────────────────────────────────────────
app.include_router(auth_router,    prefix="/auth",     tags=["Auth"])
app.include_router(expense_router, prefix="/expenses", tags=["Expenses"])
app.include_router(admin_router,   prefix="/admin",    tags=["Admin"])

# ─── HEALTH CHECK ──────────────────────────────────────────
@app.get("/")
def root():
    """Check if the API is running"""
    return {"message": "SpendR API is running!"}