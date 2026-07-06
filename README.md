#  EventPilot
### AI-Powered Event Management System

##  Project Overview

EventPilot is a full-stack web application that simplifies event planning, management, registration, attendance tracking, analytics, and feedback collection. It integrates AI-powered insights to help organizers make data-driven decisions.

---

#  Problem Statement

Traditional event management systems often suffer from:

- Manual registration processes
- Poor attendance tracking
- Lack of centralized event management
- Limited analytics
- Inefficient feedback analysis

These challenges make organizing and monitoring events time-consuming and error-prone.

---

#  Solution

EventPilot provides an all-in-one platform where organizers can:

- Create and manage events
- Register participants
- Track attendance
- Generate reports
- Analyze participant feedback
- Predict event participation using AI

---

#  Key Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Password Reset

### Event Management
- Create Events
- Edit Events
- Delete Events
- Publish Events
- Cancel Events

### Participant Features
- Event Registration
- View Registered Events
- QR Code Attendance

### AI Features
- Attendance Prediction
- Feedback Sentiment Analysis

### Reports
- Attendance Reports
- Feedback Reports
- Analytics Reports

---

#  System Architecture

```text
React Frontend
        │
        ▼
 FastAPI Backend
        │
        ▼
SQLite Database
        │
        ▼
Machine Learning Models
```

---

#  Technology Stack

## Frontend

- React.js
- React Router
- React Hook Form
- Axios
- React Toastify

## Backend

- FastAPI
- SQLAlchemy
- JWT Authentication
- Passlib

## Database

- SQLite

## AI / ML

- Scikit-Learn
- Pandas
- NLTK

---

#  Project Structure

```
event_pilot/
│
├── frontend/
├── backend/
│   ├── app/
│   ├── database/
│   ├── models/
│   ├── routes/
│   └── schemas/
│
├── streamlit_app/
├── README.md
└── docker-compose.yml
```

---

#  Workflow

1. User registers and logs in.
2. Organizer creates an event.
3. Participants register for the event.
4. Attendance is marked.
5. Feedback is collected.
6. AI analyzes data.
7. Reports are generated.

---

#  Screenshots

## Home Page

_Add screenshot here_

---

## Login Page

_Add screenshot here_

---

## Registration Page

_Add screenshot here_

---

## Dashboard

_Add screenshot here_

---

## Event Management

_Add screenshot here_

---

## Analytics

_Add screenshot here_

---

#  Requirements

## Frontend

- Node.js
- npm

## Backend

- Python 3.11+
- pip

---

#  Installation

## Clone Repository

```bash
git clone https://github.com/your-username/event-pilot.git
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

---

#  API Documentation

After running the backend:

```
http://localhost:8000/docs
```

---

#  Future Enhancements

- Email Notifications
- Payment Gateway
- Mobile Application
- AI Chat Assistant
- Calendar Integration

---

#  License

This project was developed for academic purposes.

---

#  Author

**Pravallika**
