from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_customer
from app.db.session import get_db
from app.models.cart import Cart
from app.models.customer import Customer
from app.models.product import Product
from app.routers.catalog import product_images
from app.schemas.cart import CartAddIn, CartItemOut, CartUpdateIn

router = APIRouter(prefix="/api/cart", tags=["Cart"])


def serialize_cart_item(cart_item: Cart) -> CartItemOut:
    product = cart_item.product
    return CartItemOut(
        id=cart_item.id,
        customer_id=cart_item.customer_id,
        product_id=cart_item.product_id,
        product_name=product.product_name,
        category_id=product.category_id,
        category_name=product.category.category_name if product.category else None,
        description=product.description,
        product_image=product.product_image,
        images=product_images(product),
        price=product.price,
        stock=product.stock,
        unit=product.unit,
        quantity=cart_item.quantity,
        subtotal=Decimal(product.price) * cart_item.quantity,
        created_at=cart_item.created_at,
    )


def customer_cart_query(db: Session, customer: Customer):
    return (
        db.query(Cart)
        .options(joinedload(Cart.product).joinedload(Product.category))
        .filter(Cart.customer_id == customer.id)
    )


@router.get("", response_model=list[CartItemOut])
def get_cart_items(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    items = customer_cart_query(db, customer).order_by(Cart.created_at.desc()).all()
    return [serialize_cart_item(item) for item in items if item.product and item.product.status]


@router.post("", response_model=CartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: CartAddIn,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.status == True).first()  # noqa: E712
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if product.stock <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product is out of stock")

    existing = (
        db.query(Cart)
        .filter(Cart.customer_id == customer.id, Cart.product_id == product.id)
        .first()
    )
    next_quantity = payload.quantity + (existing.quantity if existing else 0)
    if next_quantity > product.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {product.stock} {product.unit} available",
        )

    if existing:
        existing.quantity = next_quantity
        cart_item = existing
    else:
        cart_item = Cart(customer_id=customer.id, product_id=product.id, quantity=payload.quantity)
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)
    cart_item = (
        customer_cart_query(db, customer)
        .filter(Cart.id == cart_item.id)
        .first()
    )
    return serialize_cart_item(cart_item)


@router.put("/{cart_item_id}", response_model=CartItemOut)
def update_cart_item(
    cart_item_id: int,
    payload: CartUpdateIn,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    cart_item = customer_cart_query(db, customer).filter(Cart.id == cart_item_id).first()
    if not cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    if payload.quantity > cart_item.product.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {cart_item.product.stock} {cart_item.product.unit} available",
        )

    cart_item.quantity = payload.quantity
    db.commit()
    db.refresh(cart_item)
    cart_item = customer_cart_query(db, customer).filter(Cart.id == cart_item_id).first()
    return serialize_cart_item(cart_item)


@router.delete("/{cart_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    cart_item = db.query(Cart).filter(Cart.id == cart_item_id, Cart.customer_id == customer.id).first()
    if not cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return None
