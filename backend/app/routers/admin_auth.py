from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.admin import AdminUser
from app.core.security import verify_password, hash_password, create_access_token
from app.core.config import settings
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/admin/auth", tags=["Admin Auth"])

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "admin"

@router.post("/login")
def login_admin(credentials: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.email == credentials.email).first()
    if not admin or not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account disabled",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Using 'sub' as admin_id and adding a 'type' claim to distinguish from customers
    access_token = create_access_token(
        data={"sub": str(admin.id), "type": "admin", "role": admin.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "admin": {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role}}

@router.post("/setup")
def setup_first_admin(admin_data: AdminCreate, db: Session = Depends(get_db)):
    # Only allow creation if no admins exist
    if db.query(AdminUser).count() > 0:
        raise HTTPException(status_code=400, detail="Admin already exists. Use the dashboard to create new admins.")
    
    hashed_password = hash_password(admin_data.password)
    new_admin = AdminUser(
        name=admin_data.name,
        email=admin_data.email,
        password_hash=hashed_password,
        role=admin_data.role
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "First admin created successfully", "admin_id": new_admin.id}
