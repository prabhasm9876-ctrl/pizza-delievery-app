from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.product import Items
from app.schemas.product import ProductResponse
import app

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Items).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Items).filter(Items.item_id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found."
        )
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: 'app.schemas.product.ProductCreate', db: Session = Depends(get_db)):
    # Lazy import to avoid circular import in type hints
    from app.schemas.product import ProductCreate
    from app.db.models.product import Restaurant

    # validate restaurant exists
    restaurant = db.query(Restaurant).filter(Restaurant.restaurant_id == product_in.restaurant_id).first()
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found."
        )
    new_item = Items(
        restaurant_id=product_in.restaurant_id,
        name=product_in.name,
        description=product_in.description,
        price=product_in.price
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.put("/{item_id}", response_model=ProductResponse)
def update_product(item_id: int, product_in: 'app.schemas.product.ProductCreate', db: Session = Depends(get_db)):
    from app.schemas.product import ProductCreate
    item = db.query(Items).filter(Items.item_id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found."
        )
    item.name = product_in.name
    item.description = product_in.description
    item.price = product_in.price
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def delete_product(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Items).filter(Items.item_id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found."
        )
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}

