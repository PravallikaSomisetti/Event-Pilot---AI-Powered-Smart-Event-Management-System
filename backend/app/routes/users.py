from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import User, ActivityLog
from app.schemas.schemas import UserCreate, UserUpdate, UserResponse
from app.core.security import RoleChecker, get_password_hash, get_current_user

router = APIRouter(prefix="/api/users", tags=["Users Management"])

# Admin Only Dependency
admin_only = RoleChecker(["admin"])

@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    users = db.query(User).order_by(User.id.desc()).all()
    return users

@router.post("/", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    db_user = User(
        name=user_in.name,
        email=user_in.email,
        password=hashed_pwd,
        role=user_in.role,
        phone=user_in.phone,
        organization=user_in.organization
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Admin Created User",
        details=f"Admin created user {db_user.name} ({db_user.email}) with role {db_user.role}"
    )
    db.add(audit_log)
    db.commit()
    
    return db_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only Admin or user themselves can update their profile.
    # However, role changing is restricted to Admin.
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
        
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit this profile."
        )
        
    # Prevent non-admin from changing role
    if user_in.role and user_in.role != user.role:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Admins can change user roles."
            )
        user.role = user_in.role

    if user_in.name is not None:
        user.name = user_in.name
    if user_in.email is not None:
        # Check if email is taken
        existing = db.query(User).filter(User.email == user_in.email, User.id != user_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use."
            )
        user.email = user_in.email
    if user_in.phone is not None:
        user.phone = user_in.phone
    if user_in.organization is not None:
        user.organization = user_in.organization
    if user_in.avatar_url is not None:
        user.avatar_url = user_in.avatar_url
    if user_in.password is not None:
        user.password = get_password_hash(user_in.password)
        
    db.commit()
    db.refresh(user)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Updated User Profile",
        details=f"User {user.name} ({user.email}) profile updated."
    )
    db.add(audit_log)
    db.commit()
    
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
        
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admins cannot delete their own accounts."
        )
        
    db.delete(user)
    db.commit()
    
    # Audit log
    audit_log = ActivityLog(
        user_id=current_user.id,
        action="Admin Deleted User",
        details=f"Admin deleted user ID {user_id}."
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "User deleted successfully."}
