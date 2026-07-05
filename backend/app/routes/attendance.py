from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import datetime
from typing import List
from app.database.session import get_db
from app.models.models import Registration, Attendance, Event, User, ActivityLog
from app.schemas.schemas import AttendanceScanRequest, AttendanceResponse
from app.core.security import get_current_user, RoleChecker

router = APIRouter(prefix="/api/attendance", tags=["Attendance Tracking"])

organizer_or_admin = RoleChecker(["organizer", "admin"])

@router.post("/check-in", response_model=AttendanceResponse)
def check_in_participant(
    scan_req: AttendanceScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(organizer_or_admin)
):
    # Find registration matching QR code
    registration = db.query(Registration).filter(Registration.qr_code == scan_req.qr_code_data).first()
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid QR Code. Ticket not registered."
        )
        
    # Check if event is owner's event (if current user is organizer)
    event = db.query(Event).filter(Event.id == registration.event_id).first()
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to record attendance for this event."
        )
        
    # Prevent duplicate check-in
    if registration.checked_in:
        # Find existing check in
        existing = db.query(Attendance).filter(Attendance.registration_id == registration.id).first()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Duplicate check-in: Participant '{registration.user.name}' was already checked in at {existing.check_in_time.strftime('%H:%M:%S') if existing else 'earlier'}."
        )
        
    # Mark registration as checked in
    registration.checked_in = True
    
    # Create attendance record
    attendance = Attendance(
        registration_id=registration.id,
        check_in_time=datetime.datetime.utcnow(),
        checked_in_by_id=current_user.id
    )
    db.add(attendance)
    
    # Add activity log for checker
    audit_log = ActivityLog(
        user_id=registration.user_id,
        action="Attendance Marked",
        details=f"Checked in to event: {event.title} (by {current_user.name})."
    )
    db.add(audit_log)
    
    db.commit()
    db.refresh(attendance)
    
    return {
        "id": attendance.id,
        "registration_id": attendance.registration_id,
        "check_in_time": attendance.check_in_time,
        "checked_in_by_id": attendance.checked_in_by_id,
        "participant_name": registration.user.name,
        "event_title": event.title
    }

@router.get("/event/{event_id}", response_model=List[AttendanceResponse])
def get_event_attendance(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Validate permissions
    if current_user.role != "admin" and event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to view attendance list")
        
    # Get attendance list
    attendance_records = db.query(Attendance).join(Registration).filter(Registration.event_id == event_id).all()
    res = []
    for att in attendance_records:
        res.append({
            "id": att.id,
            "registration_id": att.registration_id,
            "check_in_time": att.check_in_time,
            "checked_in_by_id": att.checked_in_by_id,
            "participant_name": att.registration.user.name,
            "event_title": event.title
        })
    return res

@router.get("/my-history", response_model=List[AttendanceResponse])
def get_my_attendance_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attendance_records = db.query(Attendance).join(Registration).filter(Registration.user_id == current_user.id).all()
    res = []
    for att in attendance_records:
        res.append({
            "id": att.id,
            "registration_id": att.registration_id,
            "check_in_time": att.check_in_time,
            "checked_in_by_id": att.checked_in_by_id,
            "participant_name": current_user.name,
            "event_title": att.registration.event.title
        })
    return res
