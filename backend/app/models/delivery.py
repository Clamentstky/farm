from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class DeliveryPartner(Base):
    __tablename__ = "delivery_partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    village_coverage = Column(Text, nullable=True) # Comma-separated villages
    status = Column(String(50), default="Active") # Active, Inactive, On Leave
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OrderDelivery(Base):
    __tablename__ = "order_delivery"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id"), unique=True, nullable=False)
    partner_id = Column(Integer, ForeignKey("delivery_partners.id"), nullable=False)
    status = Column(String(50), default="Assigned") # Assigned, Picked Up, Delivered
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    order = relationship("Order", backref="delivery_assignment")
    partner = relationship("DeliveryPartner", backref="assignments")
