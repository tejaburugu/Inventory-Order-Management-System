from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    name: str = Field(..., max_length=255)
    sku: str = Field(..., max_length=64)
    price: float = Field(..., ge=0)
    quantity: int = Field(0, ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    sku: Optional[str] = Field(None, max_length=64)
    price: Optional[float] = Field(None, ge=0)
    quantity: Optional[int] = Field(None, ge=0)

    class Config:
        orm_mode = True


class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class CustomerBase(BaseModel):
    full_name: str = Field(..., max_length=255)
    email: EmailStr
    phone: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Optional[float] = Field(None, ge=0)


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product_name: Optional[str] = None

    class Config:
        orm_mode = True


class OrderBase(BaseModel):
    customer_id: int


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

    @validator('items')
    def must_have_items(cls, v):
        if not v or len(v) == 0:
            raise ValueError('order must contain at least one item')
        return v


class OrderResponse(OrderBase):
    id: int
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        orm_mode = True
