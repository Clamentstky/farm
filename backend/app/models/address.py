from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class CustomerAddress(Base):
    __tablename__ = "customer_addresses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    full_name = Column(String(150), nullable=False)
    mobile_number = Column(String(15), nullable=False)
    address = Column(String(500), nullable=False)
    village = Column(String(150), nullable=False)
    district = Column(String(150), nullable=False)
    state = Column(String(150), nullable=False)
    pincode = Column(String(10), nullable=False)
    landmark = Column(String(255), nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer")