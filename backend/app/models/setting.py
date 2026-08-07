from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class StoreSetting(Base):
    __tablename__ = "store_settings"

    id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String(255), default="Village Fresh Farm")
    support_email = Column(String(255), default="support@farmnest.com")
    store_address = Column(String(500), default="123 Green Valley Road, Harvest District")
    contact_number = Column(String(50), default="+91 98765 43210")
    is_dark_mode = Column(Boolean, default=False)
    compact_mode = Column(Boolean, default=False)
    
    # Delivery
    max_delivery_radius = Column(Integer, default=15)
    base_delivery_charge = Column(Integer, default=40)
    free_delivery_limit = Column(Integer, default=500)
    slot_morning_active = Column(Boolean, default=True)
    slot_afternoon_active = Column(Boolean, default=True)
    slot_evening_active = Column(Boolean, default=False)
    
    # Payment
    payment_cod_active = Column(Boolean, default=True)
    payment_upi_active = Column(Boolean, default=True)
    payment_razorpay_active = Column(Boolean, default=False)
    payment_stripe_active = Column(Boolean, default=False)
    
    # Notifications
    notif_new_order = Column(Boolean, default=True)
    notif_low_stock = Column(Boolean, default=True)
    notif_new_customer = Column(Boolean, default=False)
    notif_negative_review = Column(Boolean, default=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
