from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class ProductCreate(ProductBase):
    restaurant_id: int

class ProductResponse(ProductBase):
    item_id: int
    restaurant_id: int

    class Config:
        from_attributes = True


class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantResponse(RestaurantBase):
    restaurant_id: int

    class Config:
        from_attributes = True


class CartItem(BaseModel):
    item_id: int
    quantity: int

class CartAdd(BaseModel):
    restaurant_id: int
    items: list[CartItem]

class OrderItemResponse(BaseModel):
    order_item_id: int
    order_id: int
    item_id: int
    quantity: int
    total_price: float
    item: Optional[ProductResponse] = None

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    order_id: int
    user_id: int
    restaurant_id: int
    total_price: float
    order_status: Optional[str]
    order_items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True
