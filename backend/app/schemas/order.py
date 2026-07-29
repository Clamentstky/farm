from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    price: float
    unit: Optional[str] = None

    class Config:
        from_attributes = True


class PlaceOrderIn(BaseModel):
    address_id: int = Field(..., gt=0)
    payment_method: str = Field(..., min_length=1, max_length=50)
    delivery_charge: float = 0.0
    discount: float = 0.0


class OrderOut(BaseModel):
    id: int
    order_id: str
    customer_id: int
    address_id: Optional[int] = None
    total_amount: float
    delivery_charge: float
    discount: float
    payment_method: str
    order_status: str
    created_at: Optional[datetime] = None
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True