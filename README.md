# Inventory & Order Management System

Monorepo containing a Python FastAPI backend and a React frontend (Vite).

Services:
- backend: FastAPI + SQLAlchemy + Alembic
- frontend: Vite + React
- db: PostgreSQL

## Quick Start with Docker

### 1. Set up environment variables

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` to customize credentials (optional—defaults are suitable for local development):

```
POSTGRES_USER=inventory_user
POSTGRES_PASSWORD=inventory_pass
POSTGRES_DB=inventory_db
DATABASE_URL=postgresql+psycopg2://inventory_user:inventory_pass@db:5432/inventory_db
SECRET_KEY=your-secret-key-change-this-in-production-at-least-32-chars
VITE_API_URL=http://localhost:8000
```

### 2. Build and start all services

```bash
docker-compose up --build
```

This will:
- Create a PostgreSQL database container (named `db`)
- Build and run the FastAPI backend (port 8000)
- Build and run the Nginx frontend (port 3000)
- Create a shared network and volume for persistence

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432 (use credentials from `.env`)

> Note: `0.0.0.0` is a bind address, not a valid browser host. Use `http://localhost:8000` or `http://127.0.0.1:8000` from your host machine.

### 4. Stop all services

```bash
docker-compose down
```

To also remove the database volume:
```bash
docker-compose down -v
```

## Local Development (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# or .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
export DATABASE_URL=sqlite:///./test.db
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env.local`:
```
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── models.py     # SQLAlchemy models
│   │   ├── schemas.py    # Pydantic schemas
│   │   ├── crud.py       # CRUD helpers
│   │   ├── main.py       # FastAPI app & routes
│   │   ├── database.py   # Database config
│   │   └── routers/      # API route modules
│   ├── alembic/          # Database migrations
│   ├── Dockerfile        # Backend container image
│   └── requirements.txt   # Python dependencies
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── api/          # Axios API setup
│   │   └── hooks/        # Custom hooks
│   ├── Dockerfile        # Frontend container image (multi-stage)
│   ├── nginx.conf        # Nginx config (React Router fallback)
│   └── package.json      # Node dependencies
├── docker-compose.yml    # Multi-service orchestration
├── .env.example          # Example environment variables
└── README.md             # This file
```

## API Endpoints

### Products
- `GET /products` — list all products
- `POST /products` — create product
- `GET /products/{id}` — get product by ID
- `PUT /products/{id}` — update product
- `DELETE /products/{id}` — delete product

### Customers
- `GET /customers` — list all customers
- `POST /customers` — create customer (unique email)
- `GET /customers/{id}` — get customer by ID
- `DELETE /customers/{id}` — delete customer

### Orders
- `GET /orders` — list all orders
- `POST /orders` — create order (with items, stock validation)
- `GET /orders/{id}` — get order details
- `DELETE /orders/{id}` — cancel order (restores stock)

## Features

- **Product Management**: CRUD with SKU uniqueness, stock tracking
- **Customer Management**: CRUD with email validation
- **Order Management**: Create orders with multiple items, automatic stock deduction, order cancellation
- **Dashboard**: Summary cards, low-stock product alerts
- **Real-time Validation**: Frontend and backend validation
- **Error Handling**: User-friendly error messages and toasts

## Technology Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, PostgreSQL, Alembic
- **Frontend**: React 18, Vite, React Router v6, Axios
- **DevOps**: Docker, Docker Compose, Nginx
- **Database**: PostgreSQL 15

## Notes

- Ensure Docker and Docker Compose are installed.
- The frontend build uses a multi-stage Dockerfile for optimized image size.
- All services communicate over an internal Docker network (`app-network`).
- Database data is persisted using a named volume (`db_data`).

Backend:
- API: http://localhost:8000
Frontend:
- App: http://localhost:3000
