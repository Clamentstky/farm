from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(120), nullable=False, unique=True, index=True)
    category_image = Column(String(500), nullable=False)
    status = Column(Boolean, default=True, nullable=False)

    products = relationship("Product", back_populates="category")
