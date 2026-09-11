import enum
from sqlalchemy import Column, Numeric, Integer, String, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.db.models.user import User 


class RestaurantStatus(enum.Enum):
    open = "open"
    temporarily_closed = "temporarily_closed"
    closed = "closed"

class Restaurant(Base):
    __tablename__ = "restaurants"

    restaurant_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(String, nullable=True)
    location = Column(String, nullable=True)
    restaurant_status = Column(Enum(RestaurantStatus), default=RestaurantStatus.open, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    items = relationship("Items", back_populates="restaurant")
    orders = relationship("Order", back_populates="restaurant")

class Items(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.restaurant_id"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    description = Column(String, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)

    restaurant = relationship("Restaurant", back_populates="items")
    order_items = relationship("OrderItem", back_populates="item")

class OrderStatus(enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    delivered = "delivered"
    cancelled = "cancelled"

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.restaurant_id"), nullable=False, index=True)
    total_price = Column(Numeric(10, 2), nullable=False)
    order_status = Column(Enum(OrderStatus), default=OrderStatus.pending, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    restaurant = relationship("Restaurant", back_populates="orders")
    order_user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("items.item_id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="order_items")
    item = relationship("Items", back_populates="order_items")