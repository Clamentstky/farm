from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from pydantic import BaseModel

from app.db.session import get_db
from app.core.deps import get_current_admin
from app.models.customer import Customer
from app.models.order import Order

router = APIRouter(prefix="/api/admin/customers", tags=["Admin Customers"])

class CustomerStatusUpdate(BaseModel):
    is_active: bool

@router.get("")
def get_all_customers(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    customers = db.query(Customer).all()
    result = []
    
    for c in customers:
        total_orders = db.query(Order).filter(Order.customer_id == c.id).count()
        total_spent = db.query(func.sum(Order.total_amount)).filter(
            Order.customer_id == c.id, 
            Order.order_status != "Cancelled"
        ).scalar() or 0
        
        c_dict = {
            "customer_id": c.customer_id,
            "full_name": c.full_name,
            "mobile_number": c.mobile_number,
            "email": c.email,
            "village": c.village,
            "is_active": getattr(c, 'is_active', True),  # If column doesn't exist yet, default True
            "created_at": c.created_at,
            "total_orders": total_orders,
            "total_spending": float(total_spent)
        }
        result.append(c_dict)
    return result

@router.put("/{customer_id}/status")
def update_customer_status(customer_id: str, status_update: CustomerStatusUpdate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Needs is_active column in Customer model if not present.
    # Assuming we add it or just ignore if it's missing for now.
    if hasattr(customer, 'is_active'):
        customer.is_active = status_update.is_active
        db.commit()
        return {"message": "Customer status updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Customer model missing is_active column")
