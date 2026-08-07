from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.db.session import get_db
from app.core.deps import get_current_admin
from app.models.product import Product

router = APIRouter(prefix="/api/admin/products", tags=["Admin Products"])

class ProductCreate(BaseModel):
    category_id: int
    name: str
    description: str | None = None
    price: float
    stock_quantity: int
    unit: str
    images: str | None = None
    is_active: bool = True

class ProductUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = None
    description: str | None = None
    price: float | None = None
    stock_quantity: int | None = None
    unit: str | None = None
    images: str | None = None
    is_active: bool | None = None

@router.get("")
def get_all_products(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    products = db.query(Product).all()
    result = []
    for prod in products:
        result.append({
            "id": prod.id,
            "category_id": prod.category_id,
            "name": prod.product_name,
            "description": prod.description,
            "price": float(prod.price),
            "stock_quantity": prod.stock,
            "unit": prod.unit,
            "images": prod.images,
            "product_image": prod.product_image,
            "is_active": prod.status
        })
    return result

@router.post("")
def create_product(prod_in: ProductCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    import json
    first_image = ""
    if prod_in.images:
        try:
            parsed = json.loads(prod_in.images)
            if isinstance(parsed, list) and len(parsed) > 0:
                first_image = parsed[0]
        except:
            first_image = prod_in.images

    new_prod = Product(
        category_id=prod_in.category_id,
        product_name=prod_in.name,
        description=prod_in.description or "",
        price=prod_in.price,
        stock=prod_in.stock_quantity,
        unit=prod_in.unit,
        images=prod_in.images,
        product_image=first_image,
        status=prod_in.is_active
    )
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return {
        "id": new_prod.id,
        "category_id": new_prod.category_id,
        "name": new_prod.product_name,
        "description": new_prod.description,
        "price": float(new_prod.price),
        "stock_quantity": new_prod.stock,
        "unit": new_prod.unit,
        "images": new_prod.images,
        "is_active": new_prod.status
    }

@router.put("/{product_id}")
def update_product(product_id: int, prod_in: ProductUpdate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")

    if prod_in.category_id is not None:
        db_prod.category_id = prod_in.category_id
    if prod_in.name is not None:
        db_prod.product_name = prod_in.name
    if prod_in.description is not None:
        db_prod.description = prod_in.description
    if prod_in.price is not None:
        db_prod.price = prod_in.price
    if prod_in.stock_quantity is not None:
        db_prod.stock = prod_in.stock_quantity
    if prod_in.unit is not None:
        db_prod.unit = prod_in.unit
    if prod_in.images is not None:
        db_prod.images = prod_in.images
        import json
        try:
            parsed = json.loads(prod_in.images)
            if isinstance(parsed, list) and len(parsed) > 0:
                db_prod.product_image = parsed[0]
        except:
            db_prod.product_image = prod_in.images
    if prod_in.is_active is not None:
        db_prod.status = prod_in.is_active

    db.commit()
    db.refresh(db_prod)
    return {
        "id": db_prod.id,
        "category_id": db_prod.category_id,
        "name": db_prod.product_name,
        "description": db_prod.description,
        "price": float(db_prod.price),
        "stock_quantity": db_prod.stock,
        "unit": db_prod.unit,
        "images": db_prod.images,
        "is_active": db_prod.status
    }

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_prod)
    db.commit()
    return {"message": "Product deleted successfully"}
