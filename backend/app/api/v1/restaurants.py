from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.product import Restaurant
from app.schemas.product import RestaurantCreate, RestaurantResponse

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])


@router.post("/", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
def create_restaurant(rest_in: RestaurantCreate, db: Session = Depends(get_db)):
    new = Restaurant(
        name=rest_in.name,
        description=rest_in.description,
        location=rest_in.location
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.get("/", response_model=List[RestaurantResponse])
def list_restaurants(db: Session = Depends(get_db)):
    return db.query(Restaurant).all()


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    rest = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not rest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    return rest


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(restaurant_id: int, rest_in: RestaurantCreate, db: Session = Depends(get_db)):
    rest = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not rest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    rest.name = rest_in.name
    rest.description = rest_in.description
    rest.location = rest_in.location
    db.add(rest)
    db.commit()
    db.refresh(rest)
    return rest


@router.delete("/{restaurant_id}")
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    rest = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not rest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    db.delete(rest)
    db.commit()
    return {"message": "Restaurant deleted"}
