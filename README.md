# EventPilot: Smart Event Management System

**EventPilot** is a production-ready, AI-powered Smart Event Management platform designed for Admins, Event Organizers, and Participants. It incorporates secure JWT authentication, real-time check-ins using unique scanned QR codes, visual charts, automated PDF/Excel reports, drag-and-drop calendars, and intelligent machine learning models.

---

## Key Features

1. **User Authentication & Role-Based Access Controls**:
   - Secure login, signup, forgot password, and reset password.
   - Separate dashboards for **Admin**, **Event Organizer**, and **Participant**.
2. **AI Predictions & Analytics**:
   - **Attendance Predictor**: Scikit-Learn Random Forest Regressor trained on historical records forecasts attendance % based on category, time, registrations, and weekday weight.
   - **Feedback Sentiments**: Real-time NLP classifier categorizes reviews into Positive, Neutral, or Negative, extracting keywords and generating recommendations.
   - **Recharts Panels**: Dynamic charts showing platforms registration trends, attendance rates, category metrics, and satisfaction levels.
3. **QR Check-in & Gate Scanner**:
   - Unique QR ticket generated upon user event registration.
   - Built-in camera scanner scans passes, matches tickets, logs timestamps, and blocks duplicates automatically.
4. **Automated Document Exporter**:
   - Download fully formatted Excel spreadsheets (`.xlsx`) or professional PDFs listing check-in times and feedbacks.
5. **Drag-and-Drop Scheduling Calendar**:
   - Monthly grid board allowing organizers to drag-and-drop event tiles to update dates instantly.

---

## Technology Stack

* **Frontend**: React.js, Tailwind CSS (v4), React Router (v7), Axios, Recharts, Framer Motion, react-qr-code, html5-qrcode.
* **Backend**: FastAPI, PostgreSQL, SQLAlchemy, JWT Authentication, Passlib (bcrypt).
* **AI/ML**: Scikit-learn, Pandas, custom NLP keyword and suggestion miners.
* **Deployment**: Docker, Docker Compose.

---

## Folder Structure

```
event_pilot/
├── backend/
│   ├── app/
│   │   ├── ai/             # Predictor & Sentiment models
│   │   ├── core/           # Security, OAuth2, JWT configs
│   │   ├── database/       # SQLAlchemy engine & DB seeder
│   │   ├── models/         # DB table models
│   │   ├── routes/         # REST API endpoints
│   │   ├── schemas/        # Pydantic validation schemas
│   │   └── main.py         # FastAPI main script
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Layout, Sidebar, TopNavbar, Calendar
│   │   ├── pages/          # Landing page & Dashboards (Unified, Admin, Org, Part)
│   │   ├── services/       # Axios API integration hook client
│   │   ├── App.jsx         # Routes mapping
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Setup & Running Instructions

### Method 1: Using Docker Compose (Recommended)
Launch the database, FastAPI backend, and React frontend concurrently:
```bash
docker-compose up --build
```
- Frontend client: [http://localhost:80](http://localhost:80)
- Backend APIs: [http://localhost:8000](http://localhost:8000)
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Method 2: Running Locally

#### Step 1: Run Backend
1. Navigate to `backend/`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Boot backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *(Note: The database tables and seed dataset will automatically initialize in a local `eventpilot.db` SQLite file if PostgreSQL is not active!)*

#### Step 2: Run Frontend
1. Navigate to `frontend/`
2. Install packages:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```

---

## Credentials for Testing
The seeder creates three standard test accounts for instant dashboard exploration:
- **Admin**: `admin@eventpilot.com` / `admin123`
- **Organizer**: `organizer@eventpilot.com` / `organizer123`
- **Participant**: `participant@eventpilot.com` / `participant123`
