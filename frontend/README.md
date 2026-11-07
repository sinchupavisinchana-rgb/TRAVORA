# ✈️ TRAVORA — Smart Travel Planning Platform

**Plan smarter. Travel farther. Explore without limits.**

TRAVORA is a modern full-stack travel planning platform designed to make travel organization easier and more enjoyable. It brings trip management, expense tracking, travel assistance, and community interaction together in one dashboard.

## 🌍 Project Overview

TRAVORA helps travelers organize their journeys, manage budgets, track expenses, and connect with a travel community through a clean and responsive interface.

The platform combines a React frontend, a Python FastAPI backend, and a PostgreSQL database to provide a structured travel management experience.

## ✨ Features

- **Travel Dashboard** — View travel statistics and trip information.
- **Trip Management** — Add, view, and manage your trips.
- **Budget Tracking** — Record and monitor travel expenses.
- **Travel Assistant** — Get rule-based travel suggestions.
- **Travel Community** — Create posts and interact with other travelers.
- **Responsive Interface** — Designed for desktop and mobile screens.
- **Database Integration** — Store travel-related information using PostgreSQL.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| API Communication | REST API |
| Icons | Lucide React |
| Styling | CSS |

## 📁 Project Structure

```text
TRAVORA/
│
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt
│   └── .venv/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

*The structure above represents the main project areas; individual files may vary as development continues.*

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd TRAVORA
```

### 2. Backend Setup

Open a terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Configure PostgreSQL

Install PostgreSQL and create a database:

```sql
CREATE DATABASE travora_db;
```

Configure your database connection using environment variables or the configuration method used in your backend.

**Security:** Keep database passwords and secret keys in `.env`. Never upload them to GitHub.

### 4. Start the Backend

From the backend directory, run:

```powershell
python -m uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Start the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔌 API Modules

The frontend currently communicates with these backend endpoints:

| Endpoint | Purpose |
|---|---|
| `/api/trips` | Manage trips |
| `/api/expenses` | Manage travel expenses |
| `/api/posts` | Manage community posts |
| `/api/dashboard` | Retrieve dashboard information |

## 🔒 Security

- Do not commit `.env` files.
- Do not expose database credentials or API secrets.
- Keep virtual environments and `node_modules` out of version control.
- Use environment variables for sensitive configuration.

## 🚀 Future Enhancements

- AI-powered personalized travel recommendations.
- Smart itinerary generation.
- Interactive maps and route planning.
- Weather-based travel suggestions.
- Hotel and flight integration.
- Multi-currency expense management.
- User authentication and personalized profiles.
- Advanced travel analytics.

## 🎯 Project Goal

The goal of TRAVORA is to create a unified travel platform that simplifies trip planning, improves budget management, and makes travel experiences more organized.

## 👨‍💻 Developer

**Developed as a full-stack software project.**

---

⭐ If you find TRAVORA interesting, consider starring the repository!

**TRAVORA — Your Journey, Beautifully Organized.**