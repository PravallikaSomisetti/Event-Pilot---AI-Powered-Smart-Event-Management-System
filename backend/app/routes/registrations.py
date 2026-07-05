import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from typing import List
from app.database.session import get_db
from app.models.models import Registration, Event, User, ActivityLog
from app.schemas.schemas import RegistrationCreate, RegistrationResponse
from app.core.security import get_current_user, RoleChecker

router = APIRouter(prefix="/api/registrations", tags=["Registrations Management"])

@router.post("/", response_model=RegistrationResponse)
def register_for_event(
    reg_in: RegistrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify event exists
    event = db.query(Event).filter(Event.id == reg_in.event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found."
        )
        
    # Check if registration is already closed
    if event.registration_deadline < datetime.datetime.utcnow() if hasattr(datetime, "datetime") else datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration deadline has passed."
        )
        
    # Check if event is cancelled
    if event.is_cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This event has been cancelled."
        )
        
    # Check if user is already registered
    existing = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.event_id == reg_in.event_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already registered for this event."
        )
        
    # Check capacity
    current_registrations_count = db.query(Registration).filter(Registration.event_id == reg_in.event_id).count()
    if current_registrations_count >= event.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This event has reached full capacity."
        )
        
    # Generate unique QR code payload
    qr_token = f"eventpilot_pass_{current_user.id}_{event.id}_{uuid.uuid4().hex[:10]}"
    
    # Save registration
    db_reg = Registration(
        user_id=current_user.id,
        event_id=reg_in.event_id,
        qr_code=qr_token,
        checked_in=False
    )
    
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Registered for Event",
        details=f"Registered for event: {event.title} (ID: {event.id})"
    )
    db.add(audit_log)
    db.commit()
    
    # Prepare response dict
    return {
        "id": db_reg.id,
        "user_id": db_reg.user_id,
        "event_id": db_reg.event_id,
        "qr_code": db_reg.qr_code,
        "created_at": db_reg.created_at,
        "checked_in": db_reg.checked_in,
        "event_title": event.title,
        "user_name": current_user.name
    }

@router.get("/my-registrations", response_model=List[RegistrationResponse])
def get_my_registrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    registrations = db.query(Registration).filter(Registration.user_id == current_user.id).all()
    res = []
    for reg in registrations:
        res.append({
            "id": reg.id,
            "user_id": reg.user_id,
            "event_id": reg.event_id,
            "qr_code": reg.qr_code,
            "created_at": reg.created_at,
            "checked_in": reg.checked_in,
            "event_title": reg.event.title,
            "user_name": current_user.name
        })
    return res

@router.get("/event/{event_id}", response_model=List[RegistrationResponse])
def get_event_registrations(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve event and verify organizer permissions
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view registrants for this event")
        
    registrations = db.query(Registration).filter(Registration.event_id == event_id).all()
    res = []
    for reg in registrations:
        res.append({
            "id": reg.id,
            "user_id": reg.user_id,
            "event_id": reg.event_id,
            "qr_code": reg.qr_code,
            "created_at": reg.created_at,
            "checked_in": reg.checked_in,
            "event_title": event.title,
            "user_name": reg.user.name
        })
    return res
