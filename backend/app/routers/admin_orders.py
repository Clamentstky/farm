from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import List, Optional

from app.db.session import get_db
from app.core.deps import get_current_admin
from app.models.order import Order, OrderItem
from app.models.delivery import OrderDelivery

router = APIRouter(prefix="/api/admin/orders", tags=["Admin Orders"])

class OrderStatusUpdate(BaseModel):
    order_status: str

class DeliveryAssign(BaseModel):
    partner_id: int

@router.get("")
def get_all_orders(
    status: Optional[str] = None,
    db: Session = Depends(get_db), 
    admin = Depends(get_current_admin)
):
    query = db.query(Order).order_by(desc(Order.created_at))
    if status and status != "All":
        query = query.filter(Order.order_status == status)
    
    orders = query.all()
    # We should return dicts with basic item summary
    result = []
    for order in orders:
        o_dict = {
            "order_id": order.order_id,
            "customer_id": order.customer_id,
            "address_id": order.address_id,
            "total_amount": float(order.total_amount),
            "order_status": order.order_status,
            "payment_method": order.payment_method,
            "payment_status": "Pending",
            "created_at": order.created_at,
            "items": [{"product_name": item.product_name, "quantity": item.quantity} for item in order.items],
            "delivery_assignment": order.delivery_assignment[0].partner_id if order.delivery_assignment else None
        }
        result.append(o_dict)
    return result

@router.get("/{order_id}")
def get_order_details(order_id: str, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/status")
def update_order_status(order_id: str, status_update: OrderStatusUpdate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.order_status = status_update.order_status
    db.commit()
    return {"message": "Order status updated successfully", "new_status": order.order_status}

@router.post("/{order_id}/assign-delivery")
def assign_delivery(order_id: str, assign_data: DeliveryAssign, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    existing_assignment = db.query(OrderDelivery).filter(OrderDelivery.order_id == order_id).first()
    if existing_assignment:
        existing_assignment.partner_id = assign_data.partner_id
        existing_assignment.status = "Assigned"
    else:
        new_assignment = OrderDelivery(
            order_id=order_id,
            partner_id=assign_data.partner_id
        )
        db.add(new_assignment)

    db.commit()
    return {"message": "Delivery partner assigned successfully"}
