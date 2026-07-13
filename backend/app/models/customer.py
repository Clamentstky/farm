from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.sql import func

from app.db.session import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g. CUS001
    full_name = Column(String(150), nullable=False)
    mobile_number = Column(String(15), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    village = Column(String(150), nullable=True)
    password = Column(String(255), nullable=False)  # hashed password
    created_at = Column(DateTime(timezone=True), server_default=func.now())
