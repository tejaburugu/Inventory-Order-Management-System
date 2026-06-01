# Inventory & Order Management System

A comprehensive, production-ready full-stack inventory and order management system demonstrating modern web application architecture, containerization, and enterprise-grade development practices.

## Project Overview

This monorepo implements a complete order management platform with:
- **Scalable Python Backend**: RESTful API built with FastAPI, featuring transactional order processing and CRUD operations
- **Interactive Frontend**: Modern React application with real-time validation and responsive UI
- **Persistent Database**: PostgreSQL with schema versioning and automated migrations
- **Container Orchestration**: Docker Compose for seamless multi-service deployment

**Key Technologies**: Python 3.11, FastAPI, SQLAlchemy, PostgreSQL 15, React 18, Vite, Docker

## Quick Start

### Prerequisites

- Docker and Docker Compose (v3.8+)
- Git

### Deployment Options

Looking to deploy? See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- ✅ **Free Render.com deployment** (recommended)
- Docker-based VPS deployment
- AWS, Azure, and other cloud options

### Setup Instructions

#### 1. Environment Configuration

Clone the environment template:

```bash
cp .env.example .env
```

Configure the following environment variables (defaults are provided for local development):

```env
POSTGRES_USER=inventory_user
POSTGRES_PASSWORD=inventory_pass
POSTGRES_DB=inventory_db
DATABASE_URL=postgresql+psycopg2://inventory_user:inventory_pass@db:5432/inventory_db
SECRET_KEY=your-secret-key-change-this-in-production-at-least-32-chars
VITE_API_URL=http://localhost:8000
```

#### 2. Build and Deployment

Start all services using Docker Compose:

```bash
docker-compose up --build
```

This command:
- Provisions a PostgreSQL 15 database container with persistent volume storage
- Builds and launches the FastAPI backend service on port 8000
- Builds and launches the Nginx-fronted React application on port 3000
- Establishes a dedicated internal Docker network for service communication
- Initializes database schema and migration history

#### 3. Application Access

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://localhost:3000` | React web application |
| Backend API | `http://localhost:8000` | RESTful API endpoint |
| API Documentation | `http://localhost:8000/docs` | Interactive Swagger documentation |
| Database | `localhost:5432` | PostgreSQL (use credentials from `.env`) |

**Note**: `0.0.0.0` is an internal bind address and cannot be accessed from a browser. Use `http://localhost:8000` or `http://127.0.0.1:8000` to access services from your local machine.

#### 4. Shutdown

Stop all services:

```bash
docker-compose down
```

To remove persistent data (database volume):

```bash
docker-compose down -v
```


## Local Development

For development without containerization, follow the setup instructions below.

### Backend Setup

Navigate to the backend directory and configure a Python virtual environment:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# or .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
export DATABASE_URL=sqlite:///./test.db  # Use SQLite for local development
uvicorn app.main:app --reload
```

The backend API will be available at `http://localhost:8000`.

### Frontend Setup

Navigate to the frontend directory and install Node.js dependencies:

```bash
cd frontend
npm install
npm run dev
```

Create a `.env.local` file with the API configuration:

```env
VITE_API_URL=http://localhost:8000
```

The frontend application will be available at `http://localhost:5173`.

## Project Architecture

```
📦 Inventory & Order Management System/
│
├─ 🐍 backend/                          Python FastAPI backend service
│  ├─ app/
│  │  ├─ 📄 main.py                     FastAPI entry point with CORS middleware
│  │  ├─ 🗄️  database.py                Database connection & session management
│  │  ├─ 📊 models.py                   SQLAlchemy ORM (Product, Customer, Order, OrderItem)
│  │  ├─ ✅ schemas.py                   Pydantic request/response models
│  │  ├─ ⚙️  crud.py                     CRUD operations with transactions
│  │  ├─ 🔌 deps.py                     Dependency injection utilities
│  │  └─ 🛣️  routers/
│  │     ├─ 📦 products.py              Product management endpoints
│  │     ├─ 👥 customers.py             Customer management endpoints
│  │     └─ 📋 orders.py                Order processing & stock management
│  ├─ 🗂️  alembic/                      Database migration framework
│  │  ├─ ⚙️  env.py                     Alembic configuration
│  │  └─ 📜 versions/
│  │     └─ 🔖 0001_initial.py          Initial schema creation
│  ├─ 🐳 Dockerfile                    Multi-stage Docker image (Python 3.11-slim)
│  ├─ 📋 requirements.txt                Python dependencies and versions
│  └─ 🚫 .dockerignore                  Docker build exclusions
│
├─ ⚛️  frontend/                        React + Vite web application
│  ├─ src/
│  │  ├─ 📄 main.jsx                   React application entry point
│  │  ├─ 🎨 App.jsx                     Root component with routing
│  │  ├─ 🎭 index.css                   Global styles
│  │  ├─ 🌐 api/
│  │  │  └─ 📡 axios.js                Axios HTTP client with baseURL
│  │  ├─ 🧩 components/                 Reusable React components
│  │  │  ├─ 🧭 Navbar.jsx              Navigation bar with route links
│  │  │  ├─ 🪟 Modal.jsx                Modal dialog component
│  │  │  ├─ 🔔 Toast.jsx                Toast notification system
│  │  │  ├─ ⚠️  ConfirmDialog.jsx       Confirmation dialog
│  │  │  ├─ 📋 ProductForm.jsx          Product create/edit form
│  │  │  ├─ 👥 CustomerForm.jsx        Customer create/edit form
│  │  │  ├─ 🛒 OrderForm.jsx            Order creation form
│  │  │  └─ 🎨 CSS files                Component-scoped styling
│  │  ├─ 📄 pages/                     Page-level components
│  │  │  ├─ 📊 Dashboard.jsx            Summary dashboard with metrics
│  │  │  ├─ 📦 Products.jsx             Product management interface
│  │  │  ├─ 👥 Customers.jsx            Customer management interface
│  │  │  ├─ 📋 Orders.jsx               Order management interface
│  │  │  └─ 🎨 CSS files                Page-scoped styling
│  │  └─ 🪝 hooks/
│  │     └─ 🎣 useFetch.js             Custom hook for API fetching
│  ├─ 🐳 Dockerfile                    Multi-stage build (Node → Nginx Alpine)
│  ├─ 🌐 nginx.conf                     Nginx config with SPA routing fallback
│  ├─ ⚡ vite.config.js                 Vite build tool configuration
│  ├─ 📦 package.json                   Node.js dependencies and scripts
│  └─ 🚫 .dockerignore                  Docker build exclusions
│
├─ 🐳 docker-compose.yml                Multi-service orchestration config
├─ 🔐 .env.example                      Environment variables template
├─ 🚫 .gitignore                        Git exclusions for sensitive files
└─ 📖 README.md                         This documentation

Legend: 📦=Backend  ⚛️=Frontend  🔧=Config  📊=Data  🌐=Web  🔐=Security
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Backend** | Python | 3.11 | 🐍 Core language |
| | FastAPI | 0.104+ | ⚡ Web framework with async |
| | SQLAlchemy | 2.0+ | 🗄️ ORM for database abstraction |
| | Alembic | 1.12+ | 📜 Database migrations & versioning |
| | Uvicorn | 0.24+ | 🚀 ASGI application server |
| **Frontend** | React | 18.2 | ⚛️ UI library |
| | Vite | 4.4+ | ⚡ Build tool & dev server |
| | React Router | 6.14 | 🧭 Client-side routing |
| | Axios | 1.4+ | 📡 HTTP client |
| **Database** | PostgreSQL | 15 | 🗄️ Relational database |
| **Deployment** | Docker | Latest | 🐳 Container runtime |
| | Docker Compose | 3.8+ | 🎼 Multi-container orchestration |
| | Nginx | Alpine | 🔄 Reverse proxy & static server |


## API Specification

The backend provides a comprehensive RESTful API for inventory and order management. Full interactive documentation is available at `http://localhost:8000/docs` (Swagger UI).

### Products Module

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|-----------------|
| POST | `/products` | Create a new product with SKU validation | None |
| GET | `/products` | Retrieve all products with current inventory levels | None |
| GET | `/products/{id}` | Retrieve a specific product by ID | None |
| PUT | `/products/{id}` | Update product details (name, price, quantity) | None |
| DELETE | `/products/{id}` | Delete a product and its inventory record | None |

**Key Validations**: SKU uniqueness, positive quantity, non-negative pricing

### Customers Module

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|-----------------|
| POST | `/customers` | Create a new customer with email validation | None |
| GET | `/customers` | Retrieve all registered customers | None |
| GET | `/customers/{id}` | Retrieve a specific customer profile | None |
| DELETE | `/customers/{id}` | Deactivate/remove a customer record | None |

**Key Validations**: Email format and uniqueness, required name field

### Orders Module

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|-----------------|
| POST | `/orders` | Create order with transactional stock management | None |
| GET | `/orders` | Retrieve all orders with status and details | None |
| GET | `/orders/{id}` | Retrieve order details with line items | None |
| DELETE | `/orders/{id}` | Cancel order and restore product inventory | None |

**Key Validations**: Stock availability per item, minimum order quantity, customer existence

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Application health and readiness status |

## Core Features

### Product Management
- **CRUD Operations**: Full create, read, update, and delete functionality
- **SKU Management**: Enforced uniqueness to prevent duplicate product entries
- **Inventory Tracking**: Real-time stock level monitoring with low-stock alerts
- **Price Management**: Track and update product pricing information

### Customer Management
- **CRUD Operations**: Complete customer lifecycle management
- **Email Validation**: RFC-compliant email format validation with uniqueness enforcement
- **Customer Profiles**: Persistent customer data with order history correlation

### Order Processing
- **Multi-Item Orders**: Support for orders containing multiple product items
- **Stock Validation**: Automatic inventory availability checks before order confirmation
- **Transactional Processing**: Atomic order creation with stock deduction
- **Order Cancellation**: Automatic stock restoration when orders are cancelled
- **Order Tracking**: Comprehensive order history with status and timeline

### User Interface
- **Responsive Dashboard**: Summary metrics, inventory alerts, and quick insights
- **Low-Stock Alerts**: Visual indicators for products below threshold quantities
- **Real-Time Validation**: Frontend and backend validation for data integrity
- **Error Handling**: User-friendly error messages with actionable feedback
- **Toast Notifications**: Non-intrusive success/error notifications

### Data Integrity
- **Database Constraints**: Primary keys, foreign keys, and unique constraints
- **Transactional Order Creation**: Ensures consistency in multi-step operations
- **Schema Versioning**: Alembic migrations for safe database schema evolution
- **Input Validation**: Pydantic schemas for request/response validation

## Architecture & Design Patterns

### Backend Architecture
- **RESTful API Design**: Stateless endpoint design following HTTP conventions
- **Dependency Injection**: FastAPI dependencies for database session management
- **CORS Middleware**: Cross-origin resource sharing configuration for frontend integration
- **ORM Abstraction**: SQLAlchemy for database-agnostic data access
- **Transactional Operations**: Database transactions for order processing consistency

### Frontend Architecture
- **Component-Based**: Modular React components with single responsibility principle
- **Custom Hooks**: `useFetch` hook for abstracted API communication
- **Client-Side Routing**: React Router v6 for SPA navigation
- **Error Boundaries**: Comprehensive error handling and user feedback
- **CSS Modules**: Component-scoped styling to prevent style conflicts

### Data Models
- **Product**: SKU (unique), name, price, quantity
- **Customer**: Email (unique), name, contact information
- **Order**: Customer reference, order date, status, total amount
- **OrderItem**: Order reference, product reference, quantity, unit price

## Production Deployment Considerations

### Security Recommendations
- Replace `SECRET_KEY` in `.env` with a strong, randomly-generated key (minimum 32 characters)
- Implement authentication and authorization (JWT tokens recommended)
- Use HTTPS/TLS for all API communications
- Implement rate limiting to prevent abuse
- Add request validation for all endpoints
- Consider implementing API key authentication for service-to-service communication

### Performance Optimization
- Implement database connection pooling
- Add query result caching for frequently accessed data
- Consider implementing pagination for large datasets
- Monitor database query performance
- Implement CDN for static assets (JavaScript, CSS, images)

### Database Management
- Configure regular automated backups
- Implement database replication for high availability
- Use a dedicated database user with minimum required privileges
- Monitor database storage and growth trends
- Implement log retention policies

### Monitoring & Logging
- Configure application logging (structured logging recommended)
- Implement health check monitoring
- Set up alerts for critical errors
- Monitor API response times and throughput
- Track error rates and patterns

### Container Orchestration
- For production workloads, consider Kubernetes deployment
- Implement resource limits and requests for containers
- Use a container registry (Docker Hub, ECR, etc.) for image storage
- Implement container image scanning for vulnerabilities
- Use orchestrated secrets management (Kubernetes Secrets, HashiCorp Vault)

## Development Workflow

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker and Docker Compose
- Git

### Building from Source
```bash
# Clone repository
git clone https://github.com/tejaburugu/Inventory-Order-Management-System.git
cd "Inventory & Order Management System"

# Copy environment template
cp .env.example .env

# Build and run services
docker-compose up --build
```

### Database Migrations
For local development changes to database schema:

```bash
cd backend
python -m alembic revision --autogenerate -m "Description of changes"
python -m alembic upgrade head
```

### Code Quality
- Backend: Follow PEP 8 style guidelines
- Frontend: Use ESLint configuration provided in project
- Commit messages: Use descriptive, conventional commit format

## File Configuration

### `.env.example`
Contains all required environment variables with sensible defaults for local development. Copy to `.env` for your local environment.

### `docker-compose.yml`
Defines three services:
- **db**: PostgreSQL 15 with persistent volume
- **backend**: FastAPI application with health checks
- **frontend**: Nginx serving React SPA with React Router fallback

### Backend Files
- `requirements.txt`: Python package dependencies
- `Dockerfile`: Multi-stage build optimizing final image size
- `alembic.ini`: Database migration configuration
- `app/main.py`: FastAPI application with CORS middleware

### Frontend Files
- `package.json`: Node.js dependencies and build scripts
- `Dockerfile`: Multi-stage build (Node for compilation, Nginx for serving)
- `nginx.conf`: Nginx configuration with SPA fallback routing
- `vite.config.js`: Vite build tool configuration

## Notes

- All services communicate over an isolated Docker network (`app-network`)
- Database data persists in a named volume (`db_data`)
- Frontend build artifacts are optimized and served by Nginx
- CORS middleware is configured to accept requests from `localhost:3000`
- Database migrations are automatically applied on service startup
- The `.gitignore` file excludes sensitive data and build artifacts

## Support & Resources

- **API Documentation**: Available at `http://localhost:8000/docs` (Swagger UI)
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **React Documentation**: https://react.dev/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Docker Documentation**: https://docs.docker.com/

## License

This project is provided as-is for educational and portfolio demonstration purposes.

---

**Last Updated**: June 2026 | **Status**: Production-Ready | **Maintenance**: Active
