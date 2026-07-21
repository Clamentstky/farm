from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_name: str
    category_image: str
    status: bool
    product_count: int = 0


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_id: int
    category_name: Optional[str] = None
    product_name: str
    description: str
    product_image: str
    images: list[str] = []
    freshness_info: str
    delivery_availability: str
    price: Decimal
    stock: int
    unit: str
    is_featured: bool
    status: bool
