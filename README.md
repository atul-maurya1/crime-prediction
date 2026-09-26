# Crime Prediction and Analysis System (BCA Minor Project)

A complete, production-ready full-stack web application designed for analyzing historical crime records, visualizing crime statistics and geographical distributions, and generating machine-learning-based statistical category estimates from non-personal spatio-temporal features.

---

## 1. Features & Overview

- **Security & User Roles**:
  - JWT Authentication with HTTP-only cookies and bcrypt password hashing.
  - Role-based authorization (**ADMIN** and **USER/VIEWER**).
  - Rate limiting, Helmet security headers, CORS policies, and input validation with `express-validator`.

- **Crime Data Management (CRUD)**:
  - Add, edit, delete, and view crime records (Admin only for modifications).
  - Search by Crime ID, City, or Crime Type.
  - Multi-field filtering (Crime Type, City, State, Date Range, Severity, Case Status).
  - Pagination and clean modal confirmations.

- **Interactive Analytics Dashboard**:
  - Stat cards: Total Crimes, This Month, Most Common Type, Top Location, Open Cases, Closed Cases.
  - Recharts visualizations: Time-series crime trends, category distribution pie chart, city-wise bar chart, and severity donut chart.

- **Geographical Crime Mapping**:
  - Interactive Leaflet + OpenStreetMap integration.
  - Severity-color-coded map markers with popup details.
  - Crime type filtering overlays.
  - Explicit disclaimer: *"Historical Reported Crime Distribution"*.

- **Machine Learning Category Engine**:
  - Decoupled Python FastAPI microservice utilizing Scikit-learn pipelines.
  - Trained on non-personal spatio-temporal attributes (`city`, `month`, `day_of_week`, `hour`, `severity`).
  - Evaluates Random Forest, Decision Tree, and Logistic Regression models.
  - Interactive prediction UI with confidence bar, input summary, and user prediction history table.

- **Export & Reporting**:
  - Filterable summary reports table.
  - Direct CSV download export (`/api/reports/crimes.csv`).

- **Academic Documentation & Viva Preparation**:
  - Complete academic report (`docs/PROJECT.md`) with DFD Level 0/1, ER Diagram description, and Viva Q&A.
  - Detailed Database & ML documentation (`docs/DATABASE.md`, `docs/ML.md`, `docs/API.md`).

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Leaflet / React Leaflet, Axios, React Router v6.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, Cors, Helmet, Express-rate-limit.
- **Machine Learning**: Python 3.11+, FastAPI, Uvicorn, Pandas, NumPy, Scikit-Learn, Joblib, Pydantic.

---

## 3. Directory Structure

```
crime-prediction-system/
│
├── client/                 # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/     # StatCard, FilterBar, Pagination, ConfirmDialog, etc.
│   │   ├── context/        # AuthContext
│   │   ├── layouts/        # MainLayout (Sidebar + Topbar)
│   │   ├── pages/          # Dashboard, Crimes, Map, Prediction, Analytics, Reports, Users
│   │   ├── services/       # API services (auth, crime, analytics, prediction, report, user)
│   │   ├── utils/          # Constants and helpers
│   │   ├── App.jsx         # Routes & Protection
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js + Express + MongoDB Backend
│   ├── src/
│   │   ├── config/         # MongoDB DB & constants config
│   │   ├── controllers/    # Auth, Crime, Analytics, Prediction, Report, User controllers
│   │   ├── middleware/     # JWT Auth & Global Error Handler
│   │   ├── models/         # User, Crime, Prediction Mongoose Schemas
│   │   ├── routes/         # Express REST API routes
│   │   ├── services/       # mlService.js HTTP abstraction
│   │   ├── utils/          # Seed script & ErrorResponse
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── ml-service/             # Python FastAPI Machine Learning Service
│   ├── app/
│   │   ├── main.py         # FastAPI application entrypoint
│   │   ├── model.py        # CrimePredictor joblib inference wrapper
│   │   ├── preprocessing.py# Feature extraction & transformer logic
│   │   ├── prediction.py   # Prediction handler
│   │   └── schemas.py      # Pydantic request/response schemas
│   ├── models/             # Serialized joblib models & metadata
│   ├── train.py            # Model training & evaluation pipeline
│   ├── requirements.txt
│   └── README.md
│
├── dataset/                # Fictional/Synthetic Academic Crime Dataset
│   ├── crime_data.csv      # 1,200 records across 10 major cities
│   └── README.md
│
├── docs/                   # Academic Documentation & Viva Materials
│   ├── API.md              # REST API Reference
│   ├── DATABASE.md         # Database Schemas & Aggregation Pipelines
│   ├── ML.md               # Scikit-learn Pipeline & Feature Details
│   └── PROJECT.md          # Full Academic Project Report, DFDs & Viva Q&A
│
├── README.md
└── .gitignore
```

---

## 4. Quick Start & Setup Guide

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB instance running locally on `mongodb://localhost:27017`

---

### Step 1: Machine Learning Service Setup & Model Training

```bash
# Install ML dependencies from project root
pip install -r ml-service/requirements.txt

# Run the Scikit-learn training pipeline (evaluates RF, DT, Logistic Regression & saves best model)
python ml-service/train.py

# Start the FastAPI service on port 8000
uvicorn ml-service.app.main:app --host 0.0.0.0 --port 8000
```

### Step 2: Backend Setup & Seed Database

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env from template (or update MongoDB URI)
cp .env.example .env

# Seed database (Creates default Admin, Demo User, and imports 1,200 crime records)
npm run seed

# Start Node.js backend server on port 5000
npm run dev
```

### Step 3: Frontend Client Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

Open your browser at: `http://localhost:5173`

---

## 5. Local Development Credentials

| Role | Email | Password | Access Rights |
|------|-------|----------|---------------|
| **Admin** | `admin@crimeanalysis.org` | `Admin@123456` | Full CRUD, User Management, Run Predictions, View Analytics |
| **Viewer / User** | `user@crimeanalysis.org` | `User@123456` | Read-only Dashboard, Map, Analytics, Run Predictions |

---

## 6. Automated Testing Commands

```bash
# ML Unit Tests
python -m unittest discover -s ml-service -p "test_*.py"

# React Client Build Verification
cd client && npm run build
```

---

## 7. Limitations & Future Scope

### Limitations
- Predictions are statistical probabilities based on spatio-temporal trends and should not be used as definitive safety predictions.
- Dataset is synthetic for demonstration; replacing with NCRB/Kaggle data requires aligning column names as documented in `dataset/README.md`.

### Future Scope
- Integration with live GIS data feeds.
- Time-series ARIMA/LSTM forecasting for volume estimation.
- Multi-language support for regional law enforcement agencies.
