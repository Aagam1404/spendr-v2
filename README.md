# SpendR v2 — Expense Tracker
🔗 [GitHub Repository](https://github.com/Aagam1404/spendr-v2)

## 📝 Description
SpendR is a full-stack single-page expense tracking web application. It allows users to register, log in, and manage their personal expenses with a clean and intuitive interface. An admin panel allows administrators to monitor all users, their activity, and expenses across the platform.

## 💡 Problem Solved
Managing personal finances is difficult without a structured tool. SpendR provides a seamless way to track spending by category, set monthly budgets, and visualise spending patterns through interactive charts — all in one place.

---

## 🛠️ Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | React (Vite)           |
| Backend    | FastAPI (Python)       |
| Database   | PostgreSQL (Supabase)  |
| Auth       | JWT + bcrypt           |
| Charts     | Recharts               |
| HTTP       | Axios                  |

---

## 🚀 How to Run the App

### Prerequisites
- Python 3.9+
- Node.js v18+
- VS Code

### Step 1 — Open the project
1. Open VS Code
2. File → Open Folder → select `spendr-v2`
3. Press **Ctrl + `** to open terminal
4. Click **+** to open a second terminal

### Step 2 — Start the Backend (Terminal 1)
```bash
cd ~/Desktop/spendr-v2/backend
source venv/bin/activate
uvicorn main:app --reload
```
- Backend runs at: http://127.0.0.1:8000
- API docs at: http://127.0.0.1:8000/docs

### Step 3 — Start the Frontend (Terminal 2)
```bash
cd ~/Desktop/spendr-v2/frontend
npm run dev
```
- App runs at: http://localhost:5173

### Step 4 — Open the app
Go to **http://localhost:5173** in your browser

### ⚠️ Important Notes
- Both terminals must be running at the same time
- Backend must start before using the app
- Database is hosted on Supabase cloud — no local database setup needed

---

## 🔐 Demo Credentials

### Admin Account (Full Access)
| Field    | Details          |
|----------|-----------------|
| Email    | aagam@gmail.com |
| Password | 26144562 |
| Role     | Admin           |

### Regular User Account
| Field    | Details           |
|----------|------------------|
| Email    | ananya@gmail.com |
| Password | ananya123        |
| Role     | User             |

---

## 📁 Folder Structure
spendr-v2/
├── frontend/                        # React frontend (Aagam)
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx           # Top navigation bar
│       │   └── Toast.jsx            # Notification component
│       ├── pages/
│       │   ├── Login.jsx            # Login page
│       │   ├── Register.jsx         # Registration page
│       │   ├── Dashboard.jsx        # Main expense dashboard
│       │   └── Admin.jsx            # Admin panel
│       ├── services/
│       │   └── api.js               # All API calls to backend
│       ├── App.jsx                  # Root component and routing
│       ├── App.css                  # All component styles
│       └── index.css                # Global styles and variables
├── backend/                         # FastAPI backend (Ananya)
│   ├── routes/
│   │   ├── auth_routes.py           # Register and login endpoints
│   │   ├── expense_routes.py        # Expense CRUD endpoints
│   │   └── admin_routes.py          # Admin only endpoints
│   ├── main.py                      # FastAPI app entry point
│   ├── auth.py                      # JWT and password hashing
│   ├── database.py                  # Supabase client setup
│   ├── models.py                    # Pydantic request models
│   └── requirements.txt             # Backend dependencies
├── database.sql                     # Database schema export
└── README.md                        # This file

---

## ✨ Features
- Register and login with JWT authentication
- Add, edit, delete expenses
- Category tagging with icons
- Monthly dashboard with summary cards
- Spending donut chart by category
- Monthly budget setting and progress tracking
- Live search and filter expenses
- Admin panel — view all users, activity logs and expenses
- Role based access control (admin vs regular user)
- Activity logging for every user action

---

## 👥 Team Members & Workload Allocation

### Aagam Doshi — Frontend Development
Responsible for all frontend files:
- `frontend/src/pages/Dashboard.jsx` — Main dashboard with charts and budget
- `frontend/src/pages/Login.jsx` — Login page
- `frontend/src/pages/Register.jsx` — Registration page
- `frontend/src/pages/Admin.jsx` — Admin panel
- `frontend/src/components/Navbar.jsx` — Navigation bar
- `frontend/src/components/Toast.jsx` — Notification component
- `frontend/src/services/api.js` — All API calls to backend
- `frontend/src/App.jsx` — Root component and routing
- `frontend/src/App.css` — All component styles
- `frontend/src/index.css` — Global styles and variables

### Ananya Narang — Backend Development
Responsible for all backend files:
- `backend/main.py` — FastAPI app entry point and CORS setup
- `backend/auth.py` — JWT token creation and password hashing
- `backend/database.py` — Supabase client setup
- `backend/models.py` — Pydantic request and response models
- `backend/routes/auth_routes.py` — Register and login endpoints
- `backend/routes/expense_routes.py` — Expense CRUD endpoints
- `backend/routes/admin_routes.py` — Admin only endpoints
- `database.sql` — Database schema design

### Note on Contributions
Both members collaboratively designed the system architecture and
database schema. Due to a technical issue with Git configuration on
Ananya's machine during the submission period, all files were committed
from Aagam's account. The workload split above accurately reflects
each member's individual contributions to the project.

---

## 🗄️ Database Schema

### users
| Column     | Type        | Description              |
|------------|-------------|--------------------------|
| id         | bigint      | Primary key              |
| name       | text        | User's full name         |
| email      | text        | Unique email address     |
| password   | text        | Bcrypt hashed password   |
| role       | text        | 'user' or 'admin'        |
| created_at | timestamptz | Account creation time    |

### expenses
| Column     | Type        | Description              |
|------------|-------------|--------------------------|
| id         | bigint      | Primary key              |
| user_id    | bigint      | Foreign key to users     |
| title      | text        | Expense description      |
| amount     | numeric     | Expense amount           |
| category   | text        | Expense category         |
| date       | date        | Date of expense          |
| created_at | timestamptz | Record creation time     |

### user_activity
| Column      | Type        | Description              |
|-------------|-------------|--------------------------|
| id          | bigint      | Primary key              |
| user_id     | bigint      | Foreign key to users     |
| action      | text        | Action performed         |
| description | text        | Action details           |
| created_at  | timestamptz | Time of action           |

---

## 🗃️ Sample Database Data

### Users Table
| ID | Name         | Email            | Role  | Created At                    |
|----|-------------|------------------|-------|-------------------------------|
| 3  | Aagam Doshi | aagam@gmail.com  | admin | 2026-05-26 10:35:31 UTC      |
| 4  | Ananya Narang | ananya@gmail.com | user | 2026-05-26 10:40:04 UTC      |

### Expenses Table
| ID | User | Title                    | Amount  | Category          | Date       |
|----|------|--------------------------|---------|-------------------|------------|
| 6  | Aagam | Grocery Run             | $100.00 | 🍔 Food           | 2026-05-19 |
| 7  | Aagam | Movie night             | $50.00  | 🎬 Entertainment  | 2026-05-22 |
| 8  | Aagam | Trip to Melbourne       | $120.00 | ✈️ Travel         | 2026-05-14 |
| 9  | Aagam | Utilities               | $120.00 | 🏠 Bills          | 2026-05-26 |
| 10 | Aagam | Gym membership          | $25.00  | 💊 Health         | 2026-05-24 |
| 11 | Ananya | Lunch with friends     | $20.00  | 🍔 Food           | 2026-05-25 |
| 12 | Ananya | Birthday shopping      | $100.00 | 🛍️ Shopping       | 2026-05-15 |
| 13 | Ananya | Electricity            | $40.00  | 🏠 Bills          | 2026-05-20 |
| 14 | Ananya | Meds for pet           | $100.00 | 💊 Health         | 2026-05-24 |
| 15 | Ananya | Trip to Snowy mountains| $200.00 | ✈️ Travel         | 2026-05-05 |

### User Activity Table
| ID | User   | Action         | Description                              | Time                    |
|----|--------|----------------|------------------------------------------|-------------------------|
| 9  | Aagam  | register       | Aagam created an account                 | 2026-05-26 10:35:32 UTC |
| 10 | Aagam  | login          | Aagam logged in                          | 2026-05-26 10:36:03 UTC |
| 11 | Aagam  | create_expense | Added expense: Grocery Run ($100.0)      | 2026-05-26 10:36:51 UTC |
| 12 | Aagam  | create_expense | Added expense: Movie night ($50.0)       | 2026-05-26 10:37:18 UTC |
| 13 | Aagam  | create_expense | Added expense: Trip to Melbourne ($120.0)| 2026-05-26 10:37:51 UTC |
| 14 | Aagam  | create_expense | Added expense: Utilities ($120.0)        | 2026-05-26 10:38:08 UTC |
| 15 | Aagam  | create_expense | Added expense: Gym membership ($25.0)    | 2026-05-26 10:38:46 UTC |
| 16 | Ananya | register       | Ananya created an account                | 2026-05-26 10:40:04 UTC |
| 17 | Ananya | create_expense | Added expense: Lunch with friends ($20.0)| 2026-05-26 10:41:06 UTC |
| 18 | Ananya | create_expense | Added expense: Birthday shopping ($100.0)| 2026-05-26 10:41:20 UTC |
| 19 | Ananya | create_expense | Added expense: Electricity ($40.0)       | 2026-05-26 10:41:32 UTC |
| 20 | Ananya | create_expense | Added expense: Meds for pet ($100.0)     | 2026-05-26 10:41:54 UTC |
| 21 | Ananya | create_expense | Added expense: Trip to Snowy ($200.0)    | 2026-05-26 10:42:11 UTC |
| 22 | Aagam  | login          | Aagam logged in                          | 2026-05-26 10:42:39 UTC |

---

## 🗃️ How to Check the Database (Supabase)

The database is hosted on Supabase (cloud PostgreSQL). To view the data:

### Step 1 — Go to Supabase
Visit **supabase.com** and log in

### Step 2 — Open the project
Click on the **spendr-v2** project

### Step 3 — View tables
Click **Table Editor** in the left sidebar and you will see:
- **users** — all registered accounts
- **expenses** — all expenses from all users
- **user_activity** — all logged actions

### Step 4 — Run SQL queries
Click **SQL Editor** in the left sidebar and run:

```sql
-- See all users
SELECT * FROM users;

-- See all expenses
SELECT * FROM expenses;

-- See all activity logs
SELECT * FROM user_activity;

-- See expenses with user names
SELECT expenses.*, users.name, users.email
FROM expenses
JOIN users ON expenses.user_id = users.id;
```

---

## 🔒 Security Features
- Passwords hashed using bcrypt before storing
- JWT tokens for stateless authentication
- Tokens expire after 60 minutes
- Users can only access their own expenses
- Admin routes protected by role verification
- Credentials stored in .env file — never committed to GitHub