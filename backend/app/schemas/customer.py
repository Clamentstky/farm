import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, ConfigDict


class CustomerRegister(BaseModel):
    full_name: str
    mobile_number: str
    email: EmailStr
    village: str
    password: str
    confirm_password: str

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        if not re.fullmatch(r"[6-9]\d{9}", v):
            raise ValueError("Mobile number must be a valid 10-digit Indian mobile number")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v.strip()

    @field_validator("village")
    @classmethod
    def validate_village(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Village/Location is required")
        return v.strip()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, v: str, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class CustomerLoginPassword(BaseModel):
    mobile_number: str
    password: str


class OTPRequest(BaseModel):
    mobile_number: str


class OTPVerify(BaseModel):
    mobile_number: str
    otp_code: str


class ForgotPasswordRequest(BaseModel):
    mobile_number: str


class ResetPasswordRequest(BaseModel):
    mobile_number: str
    otp_code: str
    new_password: str
    confirm_new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("confirm_new_password")
    @classmethod
    def validate_confirm(cls, v: str, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v


class CustomerProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    customer_id: str
    full_name: str
    mobile_number: str
    email: Optional[EmailStr] = None
    village: Optional[str] = None
    created_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer: CustomerProfile


class MessageResponse(BaseModel):
    message: str


class OTPResponse(MessageResponse):
    dev_otp: Optional[str] = None
