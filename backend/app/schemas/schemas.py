from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "participant"
    phone: Optional[str] = None
    organization: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    password: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- AUTH SCHEMAS ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    temp_code: str  # Simulated code
    new_password: str

# --- EVENT SCHEMAS ---
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    venue: str
    capacity: int
    banner: Optional[str] = None
    start_date: datetime
    end_date: datetime
    registration_deadline: datetime

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    venue: Optional[str] = None
    capacity: Optional[str] = None
    banner: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    is_published: Optional[bool] = None
    is_cancelled: Optional[bool] = None

class EventResponse(EventBase):
    id: int
    organizer_id: int
    is_published: bool
    is_cancelled: bool
    created_at: datetime
    participants_count: Optional[int] = 0

    class Config:
        from_attributes = True

# --- REGISTRATION SCHEMAS ---
class RegistrationCreate(BaseModel):
    event_id: int

class RegistrationResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    qr_code: str
    created_at: datetime
    checked_in: bool
    event_title: Optional[str] = None
    user_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- ATTENDANCE SCHEMAS ---
class AttendanceScanRequest(BaseModel):
    qr_code_data: str

class AttendanceResponse(BaseModel):
    id: int
    registration_id: int
    check_in_time: datetime
    checked_in_by_id: Optional[int] = None
    participant_name: Optional[str] = None
    event_title: Optional[str] = None

    class Config:
        from_attributes = True

# --- FEEDBACK SCHEMAS ---
class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    rating: int
    comment: Optional[str] = None
    sentiment: str
    keywords: Optional[str] = None
    suggestions: Optional[str] = None
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- AI INSIGHTS ---
class AIPredictionRequest(BaseModel):
    registration_count: int
    previous_attendance_rate: float  # e.g., 0.85 (85%)
    event_type: str
    day_of_week: int  # 0-6
    hour_of_day: int  # 0-23

class AIPredictionResponse(BaseModel):
    predicted_attendance_rate: float
    predicted_attendance_count: int
    confidence_score: float

class SentimentPieData(BaseModel):
    positive: int
    neutral: int
    negative: int

class AISentimentResponse(BaseModel):
    overall_sentiment: str
    sentiment_counts: SentimentPieData
    keywords: List[str]
    suggestions: List[str]

# --- ACTIVITY LOGS ---
class ActivityLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    timestamp: datetime
    details: Optional[str] = None

    class Config:
        from_attributes = True
