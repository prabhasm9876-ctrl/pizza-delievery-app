#  Pizza Point - Full-Stack Pizza Delivery App

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://python.org)


A modern, full-stack web application for ordering delicious pizzas online. **Pizza Point** features an interactive UI built with React, paired with a robust REST API powered by Python & FastAPI.

---

## Features

-  **Interactive Menu**: Browse top-rated pizzas, beverages, and sides with rich imagery and descriptions.
- **Dynamic Shopping Cart**: Real-time cart updates, quantity management, item removal, and subtotal calculation.
-  **Authentication & Authorization**: User registration, secure login with JWT token persistence, and auto-login support.
-  **Order Tracking**: Place orders and view comprehensive order history with status tracking.
-  **Responsive & Modern UI**: Smooth interactive elements (horizontal dish sliders, dynamic banners, and glassmorphism styling).

---

##  Tech Stack

### **Frontend**
- **Framework**: React 18
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS (Custom Design System, Flexbox/Grid, Dark & Warm themes)

### **Backend**
- **Framework**: FastAPI (Python)
- **ASGI Server**: Uvicorn
- **ORM & Database**: SQLAlchemy & SQLite / PostgreSQL ready
- **Data Validation**: Pydantic v2
- **Authentication**: Passlib & PyJWT

---

##  Project Structure

```text
react_experiments/
├── backend/                       # Python FastAPI Backend Application
│   └── app/
│       ├── api/                   # API Routes (v1)
│       │   └── v1/
│       │       ├── auth.py        # Authentication (Login & Signup endpoints)
│       │       ├── products.py    # Pizza & Menu Items CRUD
│       │       └── router.py      # Aggregated API router
│       ├── core/                  # Security, JWT & Application Config
│       ├── db/                    # Database connection & SQLAlchemy Models
│       ├── schemas/               # Pydantic Request & Response validation schemas
│       └── main.py                # FastAPI Application Entry Point
│
├── frontend/                      # React Frontend Application
│   ├── public/                    # Static Assets & HTML Template
│   └── src/
│       ├── components/            # Reusable UI Components (BBScroll, PizzaCard, etc.)
│       ├── pages/                 # Full Page Views (HomePage, MenuPage, CartPage, OrdersPage)
│       ├── services/              # Axios API service layer
│       ├── styles/                # CSS Tokens & Module Styles
│       ├── App.jsx                # Core App Router & Authentication State Manager
│       └── index.js               # React DOM Rendering Entry point
│
├── .gitignore                     # Configured Git Ignore Rules
└── README.md                      # Project Documentation
```

---

##  Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v16.x or higher) & `npm`
- **Python** (v3.9 or higher) & `pip`

---

### 1. Backend Setup (FastAPI)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment** *(recommended)*:
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic passlib python-jose
   ```

4. **Start the FastAPI server**:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   >  The API will be available at **`http://localhost:8000`**  
   >  Interactive API Docs (Swagger UI) at **`http://localhost:8000/docs`**

---

### 2. Frontend Setup (React)

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   >  The web application will launch at **`http://localhost:3000`**

---

##  API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Register a new user account |
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/v1/auth/me` | Fetch current logged-in user details |
| `GET` | `/api/v1/products` | Retrieve list of all available menu items |
| `GET` | `/api/v1/products/{id}` | Get specific product details |
| `GET` | `/api/v1/cart/{user_id}` | Fetch active shopping cart for user |
| `POST` | `/api/v1/cart/add` | Add item to shopping cart |
| `POST` | `/api/v1/orders` | Place order for items in cart |

---

##  Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/prabhasm9876-ctrl/pizza-delievery-app/issues).

