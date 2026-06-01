from sqlalchemy.orm import Session
from . import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(name=product.name, description=product.description, price=product.price, quantity=product.quantity)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_product_by_sku(db: Session, sku: str):
    return db.query(models.Product).filter(models.Product.sku == sku).first()


def update_product(db: Session, product_id: int, product_update: dict):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    for key, value in product_update.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product


def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()


def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()


def get_customer_by_email(db: Session, email: str):
    return db.query(models.Customer).filter(models.Customer.email == email).first()


def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(full_name=customer.full_name, email=customer.email, phone=customer.phone)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


def delete_customer(db: Session, customer_id: int):
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        return None
    db.delete(db_customer)
    db.commit()
    return db_customer


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()


def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def create_order(db: Session, order_in: schemas.OrderCreate):
    # Create an order within a transaction, validate stock, deduct quantities
    with db.begin():
        total = 0.0
        items_to_create = []
        # fetch products and check stock
        for item in order_in.items:
            product = db.query(models.Product).filter(models.Product.id == item.product_id).with_for_update().first()
            if not product:
                raise ValueError(f"Product {item.product_id} not found")
            if product.quantity < item.quantity:
                raise ValueError(f"Insufficient stock for product {product.id}")
            unit_price = float(product.price)
            total += unit_price * item.quantity
            product.quantity = product.quantity - item.quantity
            items_to_create.append((product, item.quantity, unit_price))

        # create order
        db_order = models.Order(customer_id=order_in.customer_id, total_amount=total)
        db.add(db_order)
        db.flush()  # assign id

        # create order items
        for product, qty, unit_price in items_to_create:
            oi = models.OrderItem(order_id=db_order.id, product_id=product.id, quantity=qty, unit_price=unit_price)
            db.add(oi)

        db.refresh(db_order)
        return db_order


def delete_order(db: Session, order_id: int):
    # cancel order: restore stock and delete order within transaction
    with db.begin():
        order = db.query(models.Order).filter(models.Order.id == order_id).first()
        if not order:
            return None
        # restore stock
        for item in order.items:
            product = db.query(models.Product).filter(models.Product.id == item.product_id).with_for_update().first()
            if product:
                product.quantity = product.quantity + item.quantity
        # delete order (cascade will remove items)
        db.delete(order)
        return order
