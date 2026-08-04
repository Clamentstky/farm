from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.crud_order import get_order_by_id, create_order_status_history
from app.models.cart import Cart

def cancel_order_service(db: Session, order_identifier: str, customer_id: int):
    order = get_order_by_id(db, order_identifier, customer_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
    if order.order_status not in ["Pending"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only Pending orders can be cancelled")

    order.order_status = "Cancelled"
    create_order_status_history(db, order.id, "Cancelled")
    
    db.commit()
    return order

def reorder_service(db: Session, order_identifier: str, customer_id: int):
    order = get_order_by_id(db, order_identifier, customer_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    added_count = 0
    for item in order.items:
        cart_item = db.query(Cart).filter(Cart.customer_id == customer_id, Cart.product_id == item.product_id).first()
        if cart_item:
            cart_item.quantity += item.quantity
        else:
            cart_item = Cart(customer_id=customer_id, product_id=item.product_id, quantity=item.quantity)
            db.add(cart_item)
        added_count += 1
        
    db.commit()
    return added_count
