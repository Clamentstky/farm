from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.db.session import get_db
from app.core.deps import get_current_admin
from app.models.category import Category

router = APIRouter(prefix="/api/admin/categories", tags=["Admin Categories"])

class CategoryCreate(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    is_active: bool = True

class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image_url: str | None = None
    is_active: bool | None = None

@router.get("")
def get_all_categories(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        result.append({
            "id": cat.id,
            "name": cat.category_name,
            "image_url": cat.category_image,
            "is_active": cat.status,
            "description": "", # Model has no description
            "total_products": len(cat.products)
        })
    return result

@router.post("")
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_cat = db.query(Category).filter(Category.category_name == category_in.name).first()
    if db_cat:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    new_cat = Category(
        category_name=category_in.name,
        category_image=category_in.image_url or "",
        status=category_in.is_active
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return {
        "id": new_cat.id,
        "name": new_cat.category_name,
        "image_url": new_cat.category_image,
        "is_active": new_cat.status,
        "description": "",
        "total_products": 0
    }

@router.put("/{category_id}")
def update_category(category_id: int, category_in: CategoryUpdate, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_cat = db.query(Category).filter(Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")

    if category_in.name is not None:
        db_cat.category_name = category_in.name
    if category_in.image_url is not None:
        db_cat.category_image = category_in.image_url
    if category_in.is_active is not None:
        db_cat.status = category_in.is_active

    db.commit()
    db.refresh(db_cat)
    return {
        "id": db_cat.id,
        "name": db_cat.category_name,
        "image_url": db_cat.category_image,
        "is_active": db_cat.status,
        "description": "",
        "total_products": len(db_cat.products)
    }

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    db_cat = db.query(Category).filter(Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Normally check if products are attached before deletion
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted successfully"}
