# SpendR v2 — Expense Tracker

## Description
SpendR is a full-stack single-page expense tracking web application. It allows users to register, log in, and manage their personal expenses with a clean and intuitive interface. An admin panel allows administrators to monitor all users, their activity, and expenses.

## Problem Solved
Managing personal finances is difficult without a structured tool. SpendR provides a seamless way to track spending by category, set monthly budgets, and visualise spending patterns through interactive charts.

## Tech Stack
| Layer     | Technology              |
|-----------|------------------------|
| Frontend  | React (Vite)           |
| Backend   | FastAPI (Python)       |
| Database  | PostgreSQL (Supabase)  |
| Auth      | JWT + bcrypt           |
| Charts    | Recharts               |
| HTTP      | Axios                  |

## How to Run

### Prerequisites
- Node.js (v18+)
- Python 3.9+

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the `backend` folder: