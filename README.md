# Village Fresh Farm Delivery Platform

React JS, FastAPI, and MySQL platform for village-based fresh farm product delivery.

This Day 2 milestone completes the customer shopping home page, category navigation, product listing page, search, backend catalog APIs, MySQL schema, and responsive UI.

## Tech Stack

- Frontend: React JS with Vite
- Styling: Tailwind CSS
- Backend: Python FastAPI
- Database: MySQL
- ORM: SQLAlchemy
- API Client: Axios
- Authentication: JWT Bearer token

## Completed Features

- Customer home page with header, navigation bar, search bar, hero banner, category cards, featured products, popular products, and footer
- Category module with image cards, category name, and product count
- Category navigation to `/category/:id`
- Product listing page by category
- Product cards with image, name, description, price, unit, stock, Add to Cart, and View Details
- Search by product name and category name
- Loading states and error states
- Reusable React components
- FastAPI catalog endpoints
- MySQL tables for `categories` and `products`
- Seed data for required farm categories and products
- Existing customer auth, OTP login, protected routes, profile validation, and logout remain available

## Required Categories

- Milk & Dairy
- Goat Farm
- Chicken Farm
- Eggs
- Fresh Water Fish
- Sea Fish
- Fresh Water Prawn
- Sea Prawn
- Crab
- Meat

## Folder Structure

```text
Task1/
|-- backend/
|   |-- app/
|   |   |-- core/          # Config, JWT, password hashing, dependencies
|   |   |-- db/            # SQLAlchemy database session
|   |   |-- models/        # Customer, OTP, Category, Product models
|   |   |-- routers/       # Auth and catalog API routes
|   |   |-- schemas/       # Pydantic schemas
|   |   |-- main.py        # FastAPI app entry point
|   |-- schema.sql         # MySQL database, tables, and seed data
|   |-- requirements.txt
|
|-- frontend/
|   |-- public/
|   |   |-- favicon.svg
|   |   |-- product-images/
|   |-- src/
|   |   |-- api/            # Axios client, auth API, catalog API
|   |   |-- components/     # Shared UI components
|   |   |-- context/        # Auth context
|   |   |-- pages/          # Auth, home, category listing, not found
|   |   |-- routes/         # ProtectedRoute
|   |   |-- App.jsx
|   |   |-- main.jsx
```

## Backend Setup

```bash
cd backend
python -m venv ../.venv
../.venv/Scripts/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/farm
JWT_SECRET_KEY=change-this-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173
```

Create database, tables, and seed catalog data:

```bash
mysql -u root -p < schema.sql
```

Run backend:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Run frontend:

```bash
npm run dev
```

Frontend app:

```text
http://127.0.0.1:5173/login
```

Build frontend:

```bash
npm run build
```

## Frontend Routes

| Path | Access | Description |
| --- | --- | --- |
| `/login` | Public | Password login and OTP login |
| `/register` | Public | Customer registration |
| `/forgot-password` | Public | OTP password reset |
| `/customer/dashboard` | Protected | Customer shopping home page |
| `/category/:id` | Protected | Category-wise product listing |

## Backend API Endpoints

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | Get active categories with product counts | No |
| `GET` | `/api/products` | Get products, optional `?search=` by product/category | No |
| `GET` | `/api/categories/{category_id}/products` | Get products by category | No |
| `GET` | `/api/products/featured` | Get featured products | No |
| `GET` | `/api/products/popular` | Get popular products | No |
| `POST` | `/api/auth/register` | Register customer and return JWT | No |
| `POST` | `/api/auth/login/password` | Login using mobile number and password | No |
| `POST` | `/api/auth/otp/request` | Generate OTP for mobile login | No |
| `POST` | `/api/auth/otp/verify` | Verify OTP and return JWT | No |
| `POST` | `/api/auth/forgot-password` | Generate OTP for password reset | No |
| `POST` | `/api/auth/reset-password` | Reset password using OTP | No |
| `GET` | `/api/auth/profile` | Get logged-in customer profile | Yes |
| `POST` | `/api/auth/logout` | Stateless logout response | Yes |

## Database Tables

### `categories`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | INT | Primary key |
| `category_name` | VARCHAR(120) | Unique category name |
| `category_image` | VARCHAR(500) | Image URL/path |
| `status` | BOOLEAN | Active/inactive |

### `products`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | INT | Primary key |
| `category_id` | INT | Foreign key to categories |
| `product_name` | VARCHAR(160) | Product name |
| `description` | TEXT | Short description |
| `product_image` | VARCHAR(500) | Image URL/path |
| `price` | DECIMAL(10,2) | Product price |
| `stock` | INT | Available stock |
| `unit` | VARCHAR(30) | Kg, Litre, or Piece |
| `is_featured` | BOOLEAN | Featured products flag |
| `status` | BOOLEAN | Active/inactive |

Existing auth tables:

- `customers`
- `otps`

## Milestone Status

- [x] Customer Home Page
- [x] Category Module
- [x] Product Listing Page
- [x] Search Functionality
- [x] Backend APIs
- [x] MySQL Database Integration
- [x] Responsive Design

## Notes

- `schema.sql` seeds the ten required categories and sample products.
- Add to Cart currently stores items in page state for the first milestone. A persistent cart table/API can be added in the next milestone.
- Popular products are returned from active products ordered by available stock because the requested `products` table does not include an `is_popular` column.
