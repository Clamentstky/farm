from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.db.session import get_db
from app.core.deps import get_current_admin
from app.models.delivery import DeliveryPartner, OrderDelivery

router = APIRouter(prefix="/api/admin/delivery", tags=["Admin Delivery"])

class DeliveryPartnerCreate(BaseModel):
    name: str
    mobile: str
    village_coverage: str | None = None
    status: str = "Active"

class DeliveryPartnerUpdate(BaseModel):
    name: str | None = None
    mobile: str | None = None
    village_coverage: str | None = None
    status: str | None = None

@router.get("/partners")
def get_all_partners(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    partners = db.query(DeliveryPartner).all()
    result = []
    for p in partners:
        assigned_orders = db.query(OrderDelivery).filter(OrderDelivery.partner_id == p.id, OrderDelivery.status == "Assigned").count()
        delivered_orders = db.query(OrderDelivery).filter(OrderDelivery.partner_id == p.id, OrderDelivery.status == "Delivered").count()
        p_dict = {
            "id": p.id,
            "name": p.name,
            "mobile": p.mobile,
            "village_coverage": p.village_coverage,
            "status": p.status,
            "assigned_orders": assigned_orders,
            "delivered_orders": delivered_orders,
            "created_at": p.created_at
        }
        result.append(p_dict)
    return result

@router.post("/partners")
def create_partner(partner_in: DeliveryPartnerCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_partner = db.query(DeliveryPartner).filter(DeliveryPartner.mobile == partner_in.mobile).first()
    if db_partner:
        raise HTTPException(status_code=400, detail="Delivery partner with this mobile already exists")
    
    new_partner = DeliveryPartner(
        name=partner_in.name,
        mobile=partner_in.mobile,
        village_coverage=partner_in.village_coverage,
        status=partner_in.status
    )
    db.add(new_partner)
    db.commit()
    db.refresh(new_partner)
    return new_partner

@router.put("/partners/{partner_id}")
def update_partner(partner_id: int, partner_in: DeliveryPartnerUpdate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_partner = db.query(DeliveryPartner).filter(DeliveryPartner.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found")

    update_data = partner_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_partner, key, value)

    db.commit()
    db.refresh(db_partner)
    return db_partner

@router.delete("/partners/{partner_id}")
def delete_partner(partner_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_partner = db.query(DeliveryPartner).filter(DeliveryPartner.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found")
    
    db.delete(db_partner)
    db.commit()
    return {"message": "Delivery partner deleted successfully"}
