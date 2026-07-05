from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import datetime
from app.database.session import get_db
from app.models.models import Event, Registration, User
from app.schemas.schemas import AIPredictionResponse
from app.core.security import get_current_user, RoleChecker
from app.ai.predictor import predictor

router = APIRouter(prefix="/api/ai", tags=["AI ML Operations"])

organizer_or_admin = RoleChecker(["organizer", "admin"])

@router.get("/predict/{event_id}", response_model=AIPredictionResponse)
def predict_event_attendance(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Get current registrations count
    reg_count = db.query(Registration).filter(Registration.event_id == event_id).count()
    if reg_count == 0:
        # Default empty state
        return {
            "predicted_attendance_rate": 0.0,
            "predicted_attendance_count": 0,
            "confidence_score": 1.0
        }
        
    # Calculate previous attendance rate for the organizer
    organizer_events = db.query(Event).filter(
        Event.organizer_id == event.organizer_id,
        Event.start_date < datetime.datetime.utcnow()
    ).all()
    
    total_reg = 0
    total_att = 0
    for e in organizer_events:
        e_regs = db.query(Registration).filter(Registration.event_id == e.id).count()
        e_atts = db.query(Registration).filter(Registration.event_id == e.id, Registration.checked_in == True).count()
        total_reg += e_regs
        total_att += e_atts
        
    prev_rate = total_att / total_reg if total_reg > 0 else 0.85
    
    # Run prediction
    rate, confidence = predictor.predict(
        registration_count=reg_count,
        previous_attendance_rate=prev_rate,
        category=event.category,
        start_date=event.start_date
    )
    
    predicted_count = int(round(rate * reg_count))
    # Cap predicted count at registrations count
    predicted_count = min(reg_count, predicted_count)
    
    return {
        "predicted_attendance_rate": rate,
        "predicted_attendance_count": predicted_count,
        "confidence_score": confidence
    }
