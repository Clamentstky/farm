from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CartAddIn(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=999)


class CartUpdateIn(BaseModel):
    quantity: int = Field(ge=1, le=999)


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    product_id: int
    product_name: str
    category_id: int
    category_name: str | None = None
    description: str
    product_image: str
    images: list[str] = []
    price: Decimal
    stock: int
    unit: str
    quantity: int
    subtotal: Decimal
    created_at: datetime
