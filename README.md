# Pizza Delivery App - Full-Stack Architecture

A modern, production-grade pizza delivery web application built with **FastAPI** (Python backend) and **React** (JavaScript frontend).

---

## Project Directory Structure

```text
react_experiments/
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                   # API Endpoints (v1)
│   │   │   └── v1/
│   │   │       ├── auth.py        # Authentication (Login / Signup)
│   │   │       ├── products.py    # Pizza & Menu Items
│   │   │       └── router.py      # Aggregated API router
│   │   ├── core/                  # Security & Config
│   │   │   └── config.py          # App settings & CORS configuration
│   │   ├── db/                    # Unified Database Layer
│   │   │   ├── database.py        # SQLAlchemy engine & session factory
│   │   │   └── models/ # DatabaseORMModel(UserRestaurant, Items, Order)
│   │   ├── schemas/               # Pydantic Request/Response models
│   │   └── main.py                # FastAPI Application Entry point
│   └── requirements.txt           # Python Dependencies
│
├── frontend/                      # React Frontend Application
│   ├── public/                    # Public static files
│   └── src/
│       ├── components/#ReusableUIComponents(BBScroll, PizzaCard, etc.)
│       ├── pages/#Top-LevelPageViews(HomePage, LoginPage, SignUpPage)
│       ├── services/              # API Client (Axios configuration)
│       ├── styles/                # CSS Design Tokens & Styles
│       ├── App.jsx                # App Router & Root State
│       ├── index.css              # Global Design Tokens
│       └── index.js               # React DOM Renderer
└── README.md
```

---

### 1. Backend Setup (FastAPI)
# Navigate to backend folder
cd backend
# Install dependencies
pip install -r requirements.txt
# Run backend dev server
python -m uvicorn app.main:app --reload --port 8000
### 2. Frontend Setup (React)
# Navigate to frontend folder
cd frontend
# Install dependencies
npm install
# Start React development server
npm start

