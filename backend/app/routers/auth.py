from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_customer
from app.core.security import hash_password, verify_password, create_access_token
from app.core.utils import generate_customer_id, generate_otp
from app.db.session import get_db
from app.models.customer import Customer
from app.models.otp import OTP
from app.schemas.customer import (
    CustomerRegister,
    CustomerLoginPassword,
    OTPRequest,
    OTPVerify,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    CustomerProfile,
    TokenResponse,
    MessageResponse,
    OTPResponse,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

OTP_EXPIRY_MINUTES = 5


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_customer(payload: CustomerRegister, db: Session = Depends(get_db)):
    existing_mobile = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number
    ).first()
    if existing_mobile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered",
        )

    existing_email = db.query(Customer).filter(Customer.email == payload.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_customer_id = generate_customer_id(db)

    customer = Customer(
        customer_id=new_customer_id,
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        email=payload.email,
        village=payload.village,
        password=hash_password(payload.password),
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)

    access_token = create_access_token(data={"sub": customer.customer_id})

    return TokenResponse(
        access_token=access_token,
        customer=CustomerProfile.model_validate(customer),
    )


@router.post("/login/password", response_model=TokenResponse)
def login_with_password(payload: CustomerLoginPassword, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number
    ).first()

    if not customer or not verify_password(payload.password, customer.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number or password",
        )

    access_token = create_access_token(data={"sub": customer.customer_id})

    return TokenResponse(
        access_token=access_token,
        customer=CustomerProfile.model_validate(customer),
    )


@router.post("/otp/request", response_model=OTPResponse)
def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number
    ).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this mobile number",
        )

    otp_code = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)

    otp_entry = OTP(
        mobile_number=payload.mobile_number,
        otp_code=otp_code,
        expires_at=expires_at,
    )
    db.add(otp_entry)
    db.commit()

    # NOTE: Integrate with an SMS gateway (e.g. MSG91, Twilio) in production.
    # For now, OTP is logged server-side for development/testing purposes.
    print(f"[DEV ONLY] OTP for {payload.mobile_number}: {otp_code}")

    return OTPResponse(message="OTP generated successfully", dev_otp=otp_code)


@router.post("/otp/verify", response_model=TokenResponse)
def verify_otp_login(payload: OTPVerify, db: Session = Depends(get_db)):
    otp_entry = (
        db.query(OTP)
        .filter(
            OTP.mobile_number == payload.mobile_number,
            OTP.otp_code == payload.otp_code,
            OTP.is_used == False,  # noqa: E712
        )
        .order_by(OTP.id.desc())
        .first()
    )

    if not otp_entry:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

    expires_at = otp_entry.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")

    customer = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number
    ).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    otp_entry.is_used = True
    db.commit()

    access_token = create_access_token(data={"sub": customer.customer_id})

    return TokenResponse(
        access_token=access_token,
        customer=CustomerProfile.model_validate(customer),
    )


@router.post("/forgot-password", response_model=OTPResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number
    ).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this mobile number",
        )

    otp_code = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)

    otp_entry = OTP(
        mobile_number=payload.mobile_number,
        otp_code=otp_code,
        expires_at=expires_at,
    )
    db.add(otp_entry)
    db.commit()

    print(f"[DEV ONLY] Password reset OTP for {payload.mobile_number}: {otp_code}")

    return OTPResponse(message="Password reset OTP generated successfully", dev_otp=otp_code)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    otp_entry = (
        db.query(OTP)
        .filter(
            OTP.mobile_number == payload.mobile_number,
            OTP.otp_code == payload.otp_code,
            OTP.is_used == False,  # noqa: E712
        )
        .order_by(OTP.id.desc())
        .first()
    )

    if not otp_entry:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

    expires_at = otp_entry.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")

    customer = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number
    ).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    customer.password = hash_password(payload.new_password)
    otp_entry.is_used = True
    db.commit()

    return MessageResponse(message="Password reset successfully")


@router.get("/profile", response_model=CustomerProfile)
def get_profile(current_customer: Customer = Depends(get_current_customer)):
    return CustomerProfile.model_validate(current_customer)


@router.post("/logout", response_model=MessageResponse)
def logout():
    # JWT is stateless; logout is handled client-side by discarding the token.
    return MessageResponse(message="Logged out successfully")
