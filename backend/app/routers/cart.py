from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_customer
from app.db.session import get_db
from app.models.cart import Cart
from app.models.customer import Customer
from app.models.product import Product
from app.routers.catalog import product_images, sale_price, sale_stock, sale_unit
from app.schemas.cart import CartAddIn, CartItemOut, CartUpdateIn

router = APIRouter(prefix="/api/cart", tags=["Cart"])


def serialize_cart_item(cart_item: Cart) -> CartItemOut:
    product = cart_item.product
    price = sale_price(product)
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
        price=price,
        stock=sale_stock(product),
        unit=sale_unit(product),
        quantity=cart_item.quantity,
        subtotal=price * cart_item.quantity,
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
    available_stock = sale_stock(product)
    available_unit = sale_unit(product)
    if next_quantity > available_stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {available_stock} {available_unit} available",
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
    available_stock = sale_stock(cart_item.product)
    available_unit = sale_unit(cart_item.product)
    if payload.quantity > available_stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {available_stock} {available_unit} available",
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
