from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
import os
import shutil
from typing import Optional
from app.database.session import get_db
from app.models.models import User, ActivityLog
from app.schemas.schemas import UserCreate, UserResponse, LoginRequest, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Dummy in-memory code storage for password resets
TEMP_RESET_CODES = {}

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    
    # Secure Password Hashing
    hashed_pwd = get_password_hash(user_in.password)
    
    # Create user
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
        user_id=db_user.id,
        action="User Registered",
        details=f"User {db_user.name} registered with role {db_user.role}"
    )
    db.add(audit_log)
    db.commit()
    
    return db_user

@router.post("/login", response_model=TokenResponse)
def login(login_in: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == login_in.email).first()
    if not db_user or not verify_password(login_in.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
        
    token = create_access_token(subject=db_user.id)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=db_user.id,
        action="User Login",
        details=f"User {db_user.name} logged in successfully."
    )
    db.add(audit_log)
    db.commit()
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Avoid user enumeration by returning a success message anyway
        return {"message": "If the email exists, a reset code was sent."}
    
    # Generate mock verification code
    import random
    code = str(random.randint(100000, 999999))
    TEMP_RESET_CODES[user.email] = code
    
    # Return code in response for testing/development ease
    return {
        "message": "Reset code generated. Check email.",
        "debug_code": code  # Return code for easy testing
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    saved_code = TEMP_RESET_CODES.get(req.email)
    if not saved_code or saved_code != req.temp_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset code."
        )
        
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
        
    user.password = get_password_hash(req.new_password)
    db.commit()
    
    # Clear code
    TEMP_RESET_CODES.pop(req.email, None)
    
    # Audit log
    audit_log = ActivityLog(
        user_id=user.id,
        action="Password Reset",
        details=f"User {user.name} reset their password."
    )
    db.add(audit_log)
    db.commit()
    
    return {"message": "Password reset successfully."}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload_dir = "static/uploads/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{current_user.id}_avatar{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update user avatar URL
    avatar_url = f"/static/uploads/avatars/{filename}"
    current_user.avatar_url = avatar_url
    db.commit()
    
    return {"avatar_url": avatar_url}
