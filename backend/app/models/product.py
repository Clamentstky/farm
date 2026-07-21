from sqlalchemy import Boolean, Column, DECIMAL, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    product_name = Column(String(160), nullable=False, index=True)
    description = Column(Text, nullable=False)
    product_image = Column(String(500), nullable=False)
    images = Column(Text, nullable=True)
    price = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    unit = Column(String(30), nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    status = Column(Boolean, default=True, nullable=False)

    category = relationship("Category", back_populates="products")
