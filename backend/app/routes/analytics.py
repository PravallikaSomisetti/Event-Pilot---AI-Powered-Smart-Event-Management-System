from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.models import Event, Registration, Attendance, User, Feedback, ActivityLog
from app.core.security import get_current_user, RoleChecker

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Insights"])

organizer_or_admin = RoleChecker(["organizer", "admin"])

@router.get("/summary", response_model=Dict[str, Any])
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    # Filter stats by organizer if current user is an organizer (and not admin)
    is_admin = current_user.role == "admin"
    org_id = current_user.id if not is_admin else None

    # Total Events
    events_q = db.query(Event)
    if org_id:
        events_q = events_q.filter(Event.organizer_id == org_id)
    total_events = events_q.count()

    # Total Participants registered (unique users registered for the organizer's events)
    regs_q = db.query(Registration)
    if org_id:
        regs_q = regs_q.join(Event).filter(Event.organizer_id == org_id)
    total_registrations = regs_q.count()

    # Total Checked in
    checked_in_q = regs_q.filter(Registration.checked_in == True)
    total_checked_in = checked_in_q.count()

    # Attendance Rate %
    attendance_rate = 0.0
    if total_registrations > 0:
        attendance_rate = float(round((total_checked_in / total_registrations) * 100, 1))

    # Total Organizers (Platform-wide count)
    total_organizers = db.query(User).filter(User.role == "organizer").count()
    # Total Participants (Platform-wide count)
    total_participants = db.query(User).filter(User.role == "participant").count()

    # Upcoming Events
    now = datetime.datetime.utcnow()
    upcoming_q = db.query(Event).filter(Event.start_date > now, Event.is_cancelled == False)
    if org_id:
        upcoming_q = upcoming_q.filter(Event.organizer_id == org_id)
    upcoming_events_count = upcoming_q.count()

    # Recent Registrations list (limit 5)
    recent_regs_q = db.query(Registration)
    if org_id:
        recent_regs_q = recent_regs_q.join(Event).filter(Event.organizer_id == org_id)
    recent_regs = recent_regs_q.order_by(Registration.id.desc()).limit(5).all()
    
    recent_regs_list = []
    for r in recent_regs:
        recent_regs_list.append({
            "registration_id": r.id,
            "participant_name": r.user.name,
            "event_title": r.event.title,
            "created_at": r.created_at
        })

    # Average Feedback Score
    feedback_q = db.query(Feedback)
    if org_id:
        feedback_q = feedback_q.join(Event).filter(Event.organizer_id == org_id)
    avg_rating = feedback_q.with_entities(func.avg(Feedback.rating)).scalar()
    avg_rating = float(round(avg_rating or 0.0, 1))

    # Feedbacks Count
    total_feedbacks = feedback_q.count()

    return {
        "total_events": total_events,
        "total_registrations": total_registrations,
        "total_checked_in": total_checked_in,
        "attendance_rate_pct": attendance_rate,
        "total_organizers": total_organizers,
        "total_participants": total_participants,
        "upcoming_events_count": upcoming_events_count,
        "recent_registrations": recent_regs_list,
        "average_feedback_rating": avg_rating,
        "total_feedbacks": total_feedbacks
    }

@router.get("/charts", response_model=Dict[str, Any])
def get_charts_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    is_admin = current_user.role == "admin"
    org_id = current_user.id if not is_admin else None

    # Chart 1: Event Popularity (Top 5 events by registrations)
    popularity_q = db.query(
        Event.title,
        func.count(Registration.id).label("registrations_count")
    ).outerjoin(Registration).group_by(Event.id)
    
    if org_id:
        popularity_q = popularity_q.filter(Event.organizer_id == org_id)
        
    popularity = popularity_q.order_by(func.count(Registration.id).desc()).limit(5).all()
    event_popularity = [{"name": p.title, "registrations": p.registrations_count} for p in popularity]

    # Chart 2: Category Distribution
    category_q = db.query(
        Event.category,
        func.count(Event.id).label("count")
    ).group_by(Event.category)
    if org_id:
        category_q = category_q.filter(Event.organizer_id == org_id)
    category_dist = [{"name": c.category, "value": c.count} for c in category_q.all()]

    # Chart 3: Monthly Registrations Trend (last 6 months)
    # Using python to filter for simplicity across sqlite/postgres differences
    regs_q = db.query(Registration)
    if org_id:
        regs_q = regs_q.join(Event).filter(Event.organizer_id == org_id)
    all_regs = regs_q.all()
    
    monthly_counts = {}
    for i in range(5, -1, -1):
        dt = datetime.datetime.utcnow() - datetime.timedelta(days=i*30)
        key = dt.strftime("%b %Y")
        monthly_counts[key] = 0

    for r in all_regs:
        m_key = r.created_at.strftime("%b %Y")
        if m_key in monthly_counts:
            monthly_counts[m_key] += 1
            
    monthly_registrations = [{"name": k, "registrations": v} for k, v in monthly_counts.items()]

    # Chart 4: Feedback Sentiment Distribution
    feedback_q = db.query(Feedback)
    if org_id:
        feedback_q = feedback_q.join(Event).filter(Event.organizer_id == org_id)
    feedbacks = feedback_q.all()
    
    pos = sum(1 for f in feedbacks if f.sentiment == "Positive")
    neu = sum(1 for f in feedbacks if f.sentiment == "Neutral")
    neg = sum(1 for f in feedbacks if f.sentiment == "Negative")
    feedback_sentiment = [
        {"name": "Positive", "value": pos},
        {"name": "Neutral", "value": neu},
        {"name": "Negative", "value": neg}
    ]

    # Chart 5: Attendance Trend (Attendance rates of the last 5 completed events)
    now = datetime.datetime.utcnow()
    completed_q = db.query(Event).filter(Event.start_date < now)
    if org_id:
        completed_q = completed_q.filter(Event.organizer_id == org_id)
    completed_events = completed_q.order_by(Event.start_date.desc()).limit(5).all()
    
    attendance_trend = []
    for e in reversed(completed_events):
        total = db.query(Registration).filter(Registration.event_id == e.id).count()
        present = db.query(Registration).filter(Registration.event_id == e.id, Registration.checked_in == True).count()
        rate = int(round((present / total) * 100)) if total > 0 else 0
        attendance_trend.append({"name": e.title, "attendance_rate": rate})

    return {
        "event_popularity": event_popularity,
        "category_distribution": category_dist,
        "monthly_registrations": monthly_registrations,
        "feedback_sentiment": feedback_sentiment,
        "attendance_trend": attendance_trend
    }

@router.get("/activity-logs", response_model=List[Dict[str, Any]])
def get_activity_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(30).all()
    else:
        logs = db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).order_by(ActivityLog.timestamp.desc()).limit(30).all()
        
    return [{
        "id": l.id,
        "user_name": l.user.name,
        "action": l.action,
        "timestamp": l.timestamp,
        "details": l.details
    } for l in logs]
