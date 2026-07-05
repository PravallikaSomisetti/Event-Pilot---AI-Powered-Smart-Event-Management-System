from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database.session import get_db
from app.models.models import Feedback, Event, User, ActivityLog, Registration
from app.schemas.schemas import FeedbackCreate, FeedbackResponse, AISentimentResponse
from app.core.security import get_current_user, RoleChecker
from app.ai.sentiment import analyze_sentiment, aggregate_event_feedbacks

router = APIRouter(prefix="/api/feedback", tags=["Feedback & Sentiment Analysis"])

organizer_or_admin = RoleChecker(["organizer", "admin"])

@router.post("/event/{event_id}", response_model=FeedbackResponse)
def submit_feedback(
    event_id: int,
    feed_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify event exists
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Check if participant is registered and checked in (optional, but good UX: only allow feedback if they checked in, or at least registered)
    reg = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.event_id == event_id
    ).first()
    
    if not reg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only submit feedback for events you registered for."
        )
        
    # Check if already submitted
    existing = db.query(Feedback).filter(
        Feedback.event_id == event_id,
        Feedback.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted feedback for this event."
        )
        
    # Analyze Sentiment
    sentiment, keywords, suggestions = analyze_sentiment(feed_in.comment)
    
    # Save Feedback
    db_feedback = Feedback(
        event_id=event_id,
        user_id=current_user.id,
        rating=feed_in.rating,
        comment=feed_in.comment,
        sentiment=sentiment,
        keywords=",".join(keywords),
        suggestions="||".join(suggestions)
    )
    db.add(db_feedback)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Submitted Feedback",
        details=f"Submitted feedback for event ID {event_id}. Sentiment: {sentiment}."
    )
    db.add(audit_log)
    db.commit()
    db.refresh(db_feedback)
    
    return {
        "id": db_feedback.id,
        "event_id": db_feedback.event_id,
        "user_id": db_feedback.user_id,
        "rating": db_feedback.rating,
        "comment": db_feedback.comment,
        "sentiment": db_feedback.sentiment,
        "keywords": db_feedback.keywords,
        "suggestions": db_feedback.suggestions,
        "created_at": db_feedback.created_at,
        "user_name": current_user.name
    }

@router.get("/event/{event_id}", response_model=List[FeedbackResponse])
def get_event_feedback(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Allow organizer, admin, or any registered user to see feedback (public transparency)
    feedbacks = db.query(Feedback).filter(Feedback.event_id == event_id).order_by(Feedback.id.desc()).all()
    
    res = []
    for f in feedbacks:
        res.append({
            "id": f.id,
            "event_id": f.event_id,
            "user_id": f.user_id,
            "rating": f.rating,
            "comment": f.comment,
            "sentiment": f.sentiment,
            "keywords": f.keywords,
            "suggestions": f.suggestions,
            "created_at": f.created_at,
            "user_name": f.user.name
        })
    return res

@router.get("/event/{event_id}/sentiment", response_model=AISentimentResponse)
def get_feedback_sentiment_summary(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Check permissions
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    feedbacks = db.query(Feedback).filter(Feedback.event_id == event_id).all()
    summary = aggregate_event_feedbacks(feedbacks)
    return summary
