from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=True)
    middlename = Column(String(100), nullable=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    password = Column(String(255), nullable=False)#hash the password before storing it in production
    created_at = Column(DateTime, server_default=func.now())
    role = Column(String(50), nullable=False, default="user")  # Default role is "user"
    orders = relationship("Order", back_populates="order_user")

