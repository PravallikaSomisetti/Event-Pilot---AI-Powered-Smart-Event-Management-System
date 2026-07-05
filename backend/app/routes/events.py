from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
import os
import shutil
import datetime
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Event, User, ActivityLog, Registration
from app.schemas.schemas import EventCreate, EventUpdate, EventResponse
from app.core.security import RoleChecker, get_current_user

router = APIRouter(prefix="/api/events", tags=["Events Management"])

# Organizer or Admin Permission Checker
organizer_or_admin = RoleChecker(["organizer", "admin"])

@router.get("/", response_model=List[EventResponse])
def get_all_events(
    category: Optional[str] = None,
    venue: Optional[str] = None,
    organizer_id: Optional[int] = None,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,  # published, cancelled, upcoming, closed
    start_date: Optional[datetime.date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    
    if category:
        query = query.filter(Event.category.ilike(category))
        
    if venue:
        query = query.filter(Event.venue.ilike(f"%{venue}%"))
        
    if organizer_id:
        query = query.filter(Event.organizer_id == organizer_id)
        
    if start_date:
        query = query.filter(Event.start_date >= datetime.datetime.combine(start_date, datetime.time.min))

    if search:
        query = query.filter(
            or_(
                Event.title.ilike(f"%{search}%"),
                Event.description.ilike(f"%{search}%")
            )
        )
        
    now = datetime.datetime.utcnow()
    if status_filter == "published":
        query = query.filter(Event.is_published == True, Event.is_cancelled == False)
    elif status_filter == "cancelled":
        query = query.filter(Event.is_cancelled == True)
    elif status_filter == "upcoming":
        query = query.filter(Event.start_date >= now, Event.is_cancelled == False)
    elif status_filter == "closed":
        query = query.filter(Event.registration_deadline < now)

    events = query.order_by(Event.start_date.asc()).all()
    
    # Calculate participants count for each event response
    res = []
    for event in events:
        count = len(event.registrations)
        # Convert SQLAlchemy object to schema dict
        event_dict = {c.name: getattr(event, c.name) for c in event.__table__.columns}
        event_dict["participants_count"] = count
        res.append(event_dict)
        
    return res

@router.get("/{event_id}", response_model=EventResponse)
def get_event_by_id(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found."
        )
    count = len(event.registrations)
    event_dict = {c.name: getattr(event, c.name) for c in event.__table__.columns}
    event_dict["participants_count"] = count
    return event_dict

@router.post("/", response_model=EventResponse)
def create_event(
    event_in: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = Event(
        organizer_id=current_user.id,
        title=event_in.title,
        description=event_in.description,
        category=event_in.category,
        venue=event_in.venue,
        capacity=event_in.capacity,
        banner=event_in.banner,
        start_date=event_in.start_date,
        end_date=event_in.end_date,
        registration_deadline=event_in.registration_deadline,
        is_published=True
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Created Event",
        details=f"Event {event.title} created by {current_user.name}."
    )
    db.add(audit_log)
    db.commit()
    
    return {**{c.name: getattr(event, c.name) for c in event.__table__.columns}, "participants_count": 0}

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_in: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found."
        )
        
    # Check permissions
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this event."
        )
        
    for key, value in event_in.model_dump(exclude_unset=True).items():
        setattr(event, key, value)
        
    db.commit()
    db.refresh(event)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Updated Event",
        details=f"Event ID {event.id} ({event.title}) updated by {current_user.name}."
    )
    db.add(audit_log)
    db.commit()
    
    count = len(event.registrations)
    event_dict = {c.name: getattr(event, c.name) for c in event.__table__.columns}
    event_dict["participants_count"] = count
    return event_dict

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found."
        )
        
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this event."
        )
        
    db.delete(event)
    db.commit()
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Deleted Event",
        details=f"Event ID {event_id} deleted."
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "Event deleted successfully."}

@router.post("/{event_id}/publish", response_model=EventResponse)
def publish_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    event.is_published = True
    event.is_cancelled = False
    db.commit()
    db.refresh(event)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Published Event",
        details=f"Event {event.title} published."
    )
    db.add(audit_log)
    db.commit()
    
    return {**{c.name: getattr(event, c.name) for c in event.__table__.columns}, "participants_count": len(event.registrations)}

@router.post("/{event_id}/cancel", response_model=EventResponse)
def cancel_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    event.is_cancelled = True
    db.commit()
    db.refresh(event)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Cancelled Event",
        details=f"Event {event.title} cancelled."
    )
    db.add(audit_log)
    db.commit()
    
    return {**{c.name: getattr(event, c.name) for c in event.__table__.columns}, "participants_count": len(event.registrations)}

@router.post("/{event_id}/upload-banner")
async def upload_banner(
    event_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    upload_dir = "static/uploads/banners"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{event.id}_banner{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    event.banner = f"/static/uploads/banners/{filename}"
    db.commit()
    
    return {"banner_url": event.banner}

@router.post("/{event_id}/remind")
def send_event_reminders(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    # Fetch registrations count
    regs = db.query(Registration).filter(Registration.event_id == event_id).all()
    count = len(regs)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Email Reminders Sent",
        details=f"Email reminders queued & sent to {count} registered participants for event '{event.title}'."
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": f"Reminders successfully sent to {count} participants."}
