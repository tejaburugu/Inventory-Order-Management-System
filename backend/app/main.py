from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from . import models
from .database import engine
from .routers import products, customers
from .routers import orders

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root_redirect():
    return RedirectResponse(url="/docs")

app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(customers.router, prefix="/customers", tags=["customers"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])


@app.get("/health")
def health():
    return {"status": "ok"}
