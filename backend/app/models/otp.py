from sqlalchemy import Column, String, DateTime, Integer, Boolean
from sqlalchemy.sql import func

from app.db.session import Base


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    mobile_number = Column(String(15), index=True, nullable=False)
    otp_code = Column(String(6), nullable=False)
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
