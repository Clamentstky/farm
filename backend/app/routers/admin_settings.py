from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import MetaData
from app.db.session import get_db, engine
from app.models.setting import StoreSetting
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/admin/settings", tags=["Admin Settings"])

class SettingsUpdate(BaseModel):
    store_name: Optional[str] = None
    support_email: Optional[str] = None
    store_address: Optional[str] = None
    contact_number: Optional[str] = None
    is_dark_mode: Optional[bool] = None
    compact_mode: Optional[bool] = None
    
    max_delivery_radius: Optional[int] = None
    base_delivery_charge: Optional[int] = None
    free_delivery_limit: Optional[int] = None
    slot_morning_active: Optional[bool] = None
    slot_afternoon_active: Optional[bool] = None
    slot_evening_active: Optional[bool] = None
    
    payment_cod_active: Optional[bool] = None
    payment_upi_active: Optional[bool] = None
    payment_razorpay_active: Optional[bool] = None
    payment_stripe_active: Optional[bool] = None
    
    notif_new_order: Optional[bool] = None
    notif_low_stock: Optional[bool] = None
    notif_new_customer: Optional[bool] = None
    notif_negative_review: Optional[bool] = None

@router.get("")
def get_settings(db: Session = Depends(get_db)):
    setting = db.query(StoreSetting).first()
    if not setting:
        setting = StoreSetting()
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting

@router.put("")
def update_settings(data: SettingsUpdate, db: Session = Depends(get_db)):
    setting = db.query(StoreSetting).first()
    if not setting:
        setting = StoreSetting()
        db.add(setting)
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(setting, key, value)
        
    db.commit()
    db.refresh(setting)
    return setting

@router.get("/backup")
def download_backup(db: Session = Depends(get_db)):
    meta = MetaData()
    meta.reflect(bind=engine)
    backup_data = {}
    
    with engine.connect() as conn:
        for table in meta.sorted_tables:
            result = conn.execute(table.select()).fetchall()
            backup_data[table.name] = [dict(row._mapping) for row in result]
            
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    return JSONResponse(
        content=jsonable_encoder(backup_data),
        headers={
            "Content-Disposition": f'attachment; filename="farmnest_backup_{timestamp}.json"'
        }
    )
