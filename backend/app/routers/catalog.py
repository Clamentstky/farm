from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.catalog import CategoryOut, ProductOut

router = APIRouter(prefix="/api", tags=["Catalog"])


def serialize_product(product: Product) -> ProductOut:
    return ProductOut(
        id=product.id,
        category_id=product.category_id,
        category_name=product.category.category_name if product.category else None,
        product_name=product.product_name,
        description=product.description,
        product_image=product.product_image,
        price=product.price,
        stock=product.stock,
        unit=product.unit,
        is_featured=product.is_featured,
        status=product.status,
    )


@router.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    product_counts = dict(
        db.query(Product.category_id, func.count(Product.id))
        .filter(Product.status == True)  # noqa: E712
        .group_by(Product.category_id)
        .all()
    )
    categories = (
        db.query(Category)
        .filter(Category.status == True)  # noqa: E712
        .order_by(Category.id.asc())
        .all()
    )

    return [
        CategoryOut(
            id=category.id,
            category_name=category.category_name,
            category_image=category.category_image,
            status=category.status,
            product_count=product_counts.get(category.id, 0),
        )
        for category in categories
    ]


@router.get("/products", response_model=list[ProductOut])
def get_products(
    search: str = Query(default="", max_length=100),
    limit: int = Query(default=40, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Product)
        .options(joinedload(Product.category))
        .join(Category)
        .filter(Product.status == True, Category.status == True)  # noqa: E712
    )

    clean_search = search.strip()
    if clean_search:
        like_term = f"%{clean_search}%"
        query = query.filter(
            or_(
                Product.product_name.ilike(like_term),
                Category.category_name.ilike(like_term),
            )
        )

    products = query.order_by(Product.id.asc()).limit(limit).all()
    return [serialize_product(product) for product in products]


@router.get("/categories/{category_id}/products", response_model=list[ProductOut])
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    category = (
        db.query(Category)
        .filter(Category.id == category_id, Category.status == True)  # noqa: E712
        .first()
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    products = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(
            Product.category_id == category_id,
            Product.status == True,  # noqa: E712
        )
        .order_by(Product.product_name.asc())
        .all()
    )
    return [serialize_product(product) for product in products]


@router.get("/products/featured", response_model=list[ProductOut])
def get_featured_products(db: Session = Depends(get_db)):
    products = (
        db.query(Product)
        .options(joinedload(Product.category))
        .join(Category)
        .filter(
            Product.status == True,  # noqa: E712
            Product.is_featured == True,  # noqa: E712
            Category.status == True,  # noqa: E712
        )
        .order_by(Product.id.asc())
        .limit(12)
        .all()
    )
    return [serialize_product(product) for product in products]


@router.get("/products/popular", response_model=list[ProductOut])
def get_popular_products(db: Session = Depends(get_db)):
    products = (
        db.query(Product)
        .options(joinedload(Product.category))
        .join(Category)
        .filter(Product.status == True, Category.status == True)  # noqa: E712
        .order_by(Product.stock.desc(), Product.id.asc())
        .limit(12)
        .all()
    )
    return [serialize_product(product) for product in products]
