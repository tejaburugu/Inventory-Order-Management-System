from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from .. import schemas, crud, models
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        created = crud.create_order(db, order)
        # load items with product names
        db.refresh(created)
        # attach product names to response items
        for it, resp_it in zip(created.items, created.items):
            pass
        return created
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Integrity error creating order")


@router.get("/", response_model=List[schemas.OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    orders = crud.get_orders(db)
    return orders


@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    # enrich items with product_name
    for item in order.items:
        if item.product:
            item.product_name = item.product.name
    return order


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    try:
        deleted = crud.delete_order(db, order_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return {"detail": "deleted"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Integrity error deleting order")
