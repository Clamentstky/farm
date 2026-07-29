from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AddressCreateIn(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150)
    mobile_number: str = Field(..., min_length=10, max_length=15)
    address: str = Field(..., min_length=1, max_length=500)
    village: str = Field(..., min_length=1, max_length=150)
    district: str = Field(..., min_length=1, max_length=150)
    state: str = Field(..., min_length=1, max_length=150)
    pincode: str = Field(..., min_length=6, max_length=10)
    landmark: Optional[str] = Field(None, max_length=255)
    is_default: bool = False


class AddressUpdateIn(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=150)
    mobile_number: Optional[str] = Field(None, min_length=10, max_length=15)
    address: Optional[str] = Field(None, min_length=1, max_length=500)
    village: Optional[str] = Field(None, min_length=1, max_length=150)
    district: Optional[str] = Field(None, min_length=1, max_length=150)
    state: Optional[str] = Field(None, min_length=1, max_length=150)
    pincode: Optional[str] = Field(None, min_length=6, max_length=10)
    landmark: Optional[str] = Field(None, max_length=255)
    is_default: Optional[bool] = None


class AddressOut(BaseModel):
    id: int
    customer_id: int
    full_name: str
    mobile_number: str
    address: str
    village: str
    district: str
    state: str
    pincode: str
    landmark: Optional[str] = None
    is_default: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True