from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal

from app.db.database import get_db
from app.db.models.product import Order, OrderItem, Items, OrderStatus
from app.schemas.product import CartAdd, OrderResponse, OrderItemResponse
from app.api.v1.auth import get_current_user
from app.db.models.user import User


router = APIRouter(prefix="/cart", tags=["Cart"])
#adding items
@router.post("/users/{user_id}/add", response_model=OrderResponse)
def add_to_cart(
    user_id: int,
    cart: CartAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this user's cart."
        )
#cartAdd -> userid ,restaurant_id and List[(item_id, quantity)]
    validated_items = []
    total = Decimal("0")

    for ci in cart.items:

        # Quantity validation
        if ci.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than 0"
            )

        # Find #product/item
        item = db.query(Items).filter(Items.item_id == ci.item_id).first()

        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"Item {ci.item_id} not found")

        item_total = Decimal(str(item.price)) * ci.quantity

        total += item_total

        # Store item so we don't query it again later
        validated_items.append(
            {
                "cart_item": ci,
                "item": item,
                "total_price": item_total
            }
        )
    #pending orders
    order = db.query(Order).filter(
        Order.user_id == user_id,
        Order.restaurant_id == cart.restaurant_id,
        Order.order_status == OrderStatus.pending
    ).first()

    try:

        if not order:

            order = Order(
                user_id=user_id,
                restaurant_id=cart.restaurant_id,
                total_price=total,
                order_status=OrderStatus.pending
            )

            db.add(order)
            db.flush()

        else:
            order.total_price = (Decimal(str(order.total_price or 0)) + total)

        for data in validated_items:

            ci = data["cart_item"]
            item = data["item"]
            order_item = db.query(OrderItem).filter(
                OrderItem.order_id == order.order_id,
                OrderItem.item_id == item.item_id
            ).first()

            if order_item:
                order_item.quantity += ci.quantity
                order_item.total_price = (Decimal(str(item.price)) * order_item.quantity)

            else:
                order_item = OrderItem(
                    order_id=order.order_id,
                    item_id=item.item_id,
                    quantity=ci.quantity,
                    total_price=data["total_price"]
                )

            db.add(order_item)
            db.commit()
        db.refresh(order)

        return order

    except Exception:
        db.rollback()
        raise

@router.get("/users/{user_id}",response_model=list[OrderResponse])
def get_user_carts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this user's cart."
        )

    orders = db.query(Order).filter(
        Order.user_id == user_id,
        Order.order_status == OrderStatus.pending
    ).all()

    return orders

@router.get("/users/{user_id}/all", response_model=list[OrderResponse])
def get_user_all_orders(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this user's orders."
        )

    orders = db.query(Order).filter(
        Order.user_id == user_id
    ).order_by(Order.created_at.desc()).all()

    return orders

@router.put(
    "/users/{user_id}/items/{order_item_id}",
    response_model=OrderItemResponse
)
def update_cart_item(
    user_id: int,
    order_item_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this user's cart."
        )

    if quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than 0"
        )

    oi = db.query(OrderItem).filter(
        OrderItem.order_item_id == order_item_id
    ).first()

    if not oi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )


    if oi.order.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this cart item"
        )

    if oi.order.order_status != OrderStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify a confirmed order"
        )

    oi.quantity = quantity

    oi.total_price = (
        Decimal(str(oi.item.price)) * quantity
    )


    order = oi.order

    order.total_price = sum(
        (
            Decimal(str(item.total_price))
            for item in order.order_items
        ),
        Decimal("0")
    )

    try:
        db.commit()
        db.refresh(oi)

        return oi

    except Exception:
        db.rollback()
        raise


@router.delete(
    "/users/{user_id}/items/{order_item_id}"
)
def remove_cart_item(
    user_id: int,
    order_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this user's cart."
        )

    oi = db.query(OrderItem).filter(
        OrderItem.order_item_id == order_item_id
    ).first()

    if not oi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    if oi.order.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this cart item"
        )

#order status check
    if oi.order.order_status != OrderStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify a confirmed order"
        )

    order = oi.order

    # delete the order item
    db.delete(oi)
    db.flush()


    remaining_items = order.order_items

    if not remaining_items:
        # No items left → remove empty pending cart
        db.delete(order)
    else:
        order.total_price = sum(
            (
                Decimal(str(item.total_price))
                for item in remaining_items
            ),
            Decimal("0")
        )

    try:
        db.commit()

        return {
            "message": "Item removed from cart"
        }

    except Exception:
        db.rollback()
        raise
    
@router.post(
    "/users/{user_id}/checkout/{order_id}"
)
def checkout(
    user_id: int,
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to checkout this order."
        )


    order = db.query(Order).filter(
        Order.order_id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    if order.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to checkout this order"
        )


    if order.order_status != OrderStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This cart has already been checked out"
        )


    if not order.order_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot checkout an empty cart"
        )

    if not order.total_price or order.total_price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart total must be greater than 0"
        )


    order.order_status = OrderStatus.confirmed

    try:
        db.commit()
        db.refresh(order)

        return {
            "message": "Order confirmed",
            "order_id": order.order_id,
            "total_price": order.total_price
        }

    except Exception:
        db.rollback()
        raise