import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.session import Base, engine
from app.database.seed import seed_db

# Import Routers
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.events import router as events_router
from app.routes.registrations import router as registrations_router
from app.routes.attendance import router as attendance_router
from app.routes.feedback import router as feedback_router
from app.routes.analytics import router as analytics_router
from app.routes.ai import router as ai_router
from app.routes.reports import router as reports_router

app = FastAPI(
    title="EventPilot API",
    description="Secure REST APIs for EventPilot Smart Event Management System",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite development port
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static folder
os.makedirs("static/uploads/avatars", exist_ok=True)
os.makedirs("static/uploads/banners", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(events_router)
app.include_router(registrations_router)
app.include_router(attendance_router)
app.include_router(feedback_router)
app.include_router(analytics_router)
app.include_router(ai_router)
app.include_router(reports_router)

@app.on_event("startup")
def startup_populate():
    # Setup tables
    Base.metadata.create_all(bind=engine)
    # Seed db with mock data
    try:
        seed_db()
    except Exception as e:
        print(f"Error seeding database: {e}")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "EventPilot API Server",
        "docs_url": "/docs"
    }
