from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from app.core.deps import get_current_customer
from app.db.session import get_db
from app.models.customer import Customer
from app.models.address import CustomerAddress
from app.models.cart import Cart
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.routers.catalog import sale_price, sale_stock, sale_unit
from app.schemas.customer import MessageResponse
from app.schemas.order import PlaceOrderIn, OrderOut

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
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order.id)
        .first()
    )
    return order


@router.get("", response_model=list[OrderOut])
def get_orders(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.customer_id == customer.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    query = db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product)).filter(Order.customer_id == customer.id)
    if order_id.isdigit():
        order = query.filter((Order.id == int(order_id)) | (Order.order_id == order_id)).first()
    else:
        order = query.filter(Order.order_id == order_id).first()

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
    return MessageResponse(message="Order deleted successfully")