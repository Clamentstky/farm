from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import Optional

from app.core.deps import get_current_customer
from app.db.session import get_db
from app.models.customer import Customer
from app.models.address import CustomerAddress
from app.models.cart import Cart
from app.models.order import Order, OrderItem, OrderStatusHistory
from app.models.product import Product
from app.routers.catalog import sale_price, sale_stock, sale_unit
from app.schemas.customer import MessageResponse
from app.schemas.order import PlaceOrderIn, OrderOut, OrderPaginatedOut, OrderStatusHistoryOut
from app.crud.crud_order import get_orders_paginated, get_order_by_id
from app.services.order_service import cancel_order_service, reorder_service
from app.services.invoice_service import generate_invoice_pdf

router = APIRouter(prefix="/api/orders", tags=["Orders"])



def generate_order_id(db: Session) -> str:
    date_str = datetime.now().strftime("%Y%m%d")
    prefix = f"ORD-{date_str}-"
    
    last_order = (
        db.query(Order)
        .filter(Order.order_id.like(f"{prefix}%"))
        .order_by(Order.id.desc())
        .first()
    )
    
    if last_order:
        try:
            last_num = int(last_order.order_id.split("-")[-1])
            new_num = last_num + 1
        except ValueError:
            new_num = 1
    else:
        new_num = 1
        
    return f"{prefix}{new_num:04d}"


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(
    payload: PlaceOrderIn,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    # Validate address
    address = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == payload.address_id,
            CustomerAddress.customer_id == customer.id,
        )
        .first()
    )
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )

    # Get cart items
    cart_items = (
        db.query(Cart)
        .options(joinedload(Cart.product))
        .filter(Cart.customer_id == customer.id)
        .all()
    )
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )

    # Calculate total
    total_amount = sum(
        float(sale_price(item.product)) * item.quantity
        for item in cart_items
        if item.product and item.product.status
    )

    # Create order
    order_id = generate_order_id(db)
    order = Order(
        order_id=order_id,
        customer_id=customer.id,
        address_id=payload.address_id,
        total_amount=total_amount + payload.delivery_charge - payload.discount,
        delivery_charge=payload.delivery_charge,
        discount=payload.discount,
        payment_method=payload.payment_method,
        order_status="Pending",
    )
    db.add(order)
    db.flush()

    history = OrderStatusHistory(order_id=order.id, status="Pending")
    db.add(history)

    # Create order items
    for cart_item in cart_items:
        product = cart_item.product
        if not product or not product.status:
            continue
        price = float(sale_price(product))
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.product_name,
            quantity=cart_item.quantity,
            price=price,
            unit=sale_unit(product),
        )
        db.add(order_item)

        # Reduce stock
        product.stock -= cart_item.quantity

    # Clear cart
    db.query(Cart).filter(Cart.customer_id == customer.id).delete()

    db.commit()
    db.refresh(order)

    # Reload with items
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product), joinedload(Order.history), joinedload(Order.address))
        .filter(Order.id == order.id)
        .first()
    )
    return order


@router.get("", response_model=OrderPaginatedOut)
def get_orders(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    order_status: Optional[str] = None,
    sort: str = "newest",
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    skip = (page - 1) * limit
    orders, total = get_orders_paginated(db, customer.id, skip, limit, search, order_status, sort)
    
    import math
    pages = math.ceil(total / limit) if total > 0 else 1
    
    return {
        "items": orders,
        "total": total,
        "page": page,
        "size": limit,
        "pages": pages
    }


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    order = get_order_by_id(db, order_id, customer.id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.delete("/{order_id}", response_model=MessageResponse)
def delete_order(
    order_id: str,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    query = db.query(Order).filter(Order.customer_id == customer.id)
    if order_id.isdigit():
        order = query.filter((Order.id == int(order_id)) | (Order.order_id == order_id)).first()
    else:
        order = query.filter(Order.order_id == order_id).first()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}


@router.post("/{order_id}/cancel", response_model=MessageResponse)
def cancel_order(
    order_id: str,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    cancel_order_service(db, order_id, customer.id)
    return {"message": "Order cancelled successfully"}


@router.post("/{order_id}/reorder", response_model=MessageResponse)
def reorder(
    order_id: str,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    added_count = reorder_service(db, order_id, customer.id)
    return {"message": f"Successfully added {added_count} items to your cart"}


@router.get("/{order_id}/tracking", response_model=list[OrderStatusHistoryOut])
def get_order_tracking(
    order_id: str,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    order = get_order_by_id(db, order_id, customer.id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order.history


@router.get("/{order_id}/invoice")
def download_invoice(
    order_id: str,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    order = get_order_by_id(db, order_id, customer.id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    pdf_buffer = generate_invoice_pdf(order)

    headers = {
        'Content-Disposition': f'attachment; filename="Invoice_{order.order_id}.pdf"'
    }

    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)