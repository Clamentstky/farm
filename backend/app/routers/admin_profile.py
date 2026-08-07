from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.admin import AdminUser
from pydantic import BaseModel, EmailStr
from typing import Optional
from passlib.context import CryptContext

router = APIRouter(prefix="/api/admin/profile", tags=["Admin Profile"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

@router.get("/me")
def get_profile(db: Session = Depends(get_db)):
    # Assuming single admin for simplicity, in production this uses JWT token dependency
    admin = db.query(AdminUser).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role}

@router.put("/me")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    if data.name:
        admin.name = data.name
    if data.email:
        # Check if email taken by someone else
        existing = db.query(AdminUser).filter(AdminUser.email == data.email, AdminUser.id != admin.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        admin.email = data.email
        
    db.commit()
    db.refresh(admin)
    return {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role}

@router.put("/password")
def update_password(data: PasswordUpdate, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    if not pwd_context.verify(data.current_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    admin.password_hash = pwd_context.hash(data.new_password)
    db.commit()
    return {"status": "Password updated successfully"}
