from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, asc
from typing import List, Tuple, Optional
from app.models.order import Order, OrderItem, OrderStatusHistory

def get_orders_paginated(
    db: Session,
    customer_id: int,
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: str = "newest"
) -> Tuple[List[Order], int]:
    
    query = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product), 
        joinedload(Order.history),
        joinedload(Order.address)
    ).filter(Order.customer_id == customer_id)

    # Search filter
    if search:
        query = query.join(Order.items).filter(
            or_(
                Order.order_id.ilike(f"%{search}%"),
                OrderItem.product_name.ilike(f"%{search}%")
            )
        )

    # Status filter
    if status and status.lower() != "all":
        query = query.filter(Order.order_status.ilike(status))

    # Sorting
    if sort_by == "oldest":
        query = query.order_by(asc(Order.created_at))
    elif sort_by == "highest":
        query = query.order_by(desc(Order.total_amount))
    elif sort_by == "lowest":
        query = query.order_by(asc(Order.total_amount))
    else: # newest
        query = query.order_by(desc(Order.created_at))

    total = query.count()
    orders = query.offset(skip).limit(limit).all()

    return orders, total

def get_order_by_id(db: Session, order_identifier: str, customer_id: int) -> Optional[Order]:
    query = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product), 
        joinedload(Order.history),
        joinedload(Order.address)
    ).filter(Order.customer_id == customer_id)
    
    if order_identifier.isdigit():
        order = query.filter((Order.id == int(order_identifier)) | (Order.order_id == order_identifier)).first()
    else:
        order = query.filter(Order.order_id == order_identifier).first()
        
    return order

def create_order_status_history(db: Session, order_id: int, status: str) -> OrderStatusHistory:
    history = OrderStatusHistory(order_id=order_id, status=status)
    db.add(history)
    db.commit()
    db.refresh(history)
    return history
