# 🌾 FreshNest - Village Farm Delivery Platform

A modern, full-stack e-commerce platform connecting village farms to customers. Built with React, FastAPI, and MySQL to deliver fresh farm products directly to your doorstep.

**Version:** 2.0.0 | **Status:** Active Development

---

## 📋 Project Overview

FreshNest is a comprehensive farm-to-table delivery platform that enables customers to browse, search, and purchase fresh products directly from village farms. The platform features:

- **Customer Authentication**: Registration, password login, OTP verification, and forgot password functionality
- **Product Catalog**: Browse 10+ product categories with 16+ fresh farm products
- **Smart Search**: Full-text search across products and categories
- **Shopping Cart**: Persistent cart management with quantity controls
- **Product Details**: Enhanced modal with detailed product information, availability, and purchase options
- **Responsive Design**: Mobile-first, fully responsive UI using Tailwind CSS
- **Secure API**: FastAPI backend with JWT authentication and CORS support

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite 5.3.1
- **Styling**: Tailwind CSS 3.4.4
- **Routing**: React Router DOM 6.24.0
- **HTTP Client**: Axios 1.7.2
- **Build Tool**: Vite
- **CSS Processing**: PostCSS, Autoprefixer

### Backend
- **Framework**: FastAPI 0.116.0
- **Server**: Uvicorn 0.35.0
- **Database ORM**: SQLAlchemy 2.0.43
- **Database Driver**: PyMySQL 1.1.1
- **Authentication**: python-jose with cryptography
- **Password Hashing**: passlib with bcrypt
- **Configuration**: python-dotenv, Pydantic Settings

### Database
- **DBMS**: MySQL 8.0+
- **Character Set**: UTF-8 MB4 (Unicode support)
- **Tables**: 4 main tables (customers, otps, categories, products)

---

## ✨ Completed Features

### Authentication & Security
- ✅ Customer registration with email and mobile validation
- ✅ Password-based login with encrypted password storage
- ✅ OTP-based authentication (5-minute expiry)
- ✅ Forgot password & password reset functionality
- ✅ JWT Bearer token authentication
- ✅ Protected routes with role-based access
- ✅ Customer profile management and logout

### Product Catalog
- ✅ 10 product categories with seed data
- ✅ 16 farm products with images, descriptions, pricing
- ✅ Product availability and stock management
- ✅ Category-based product filtering
- ✅ Full-text search by product name and category
- ✅ Featured products highlighting
- ✅ Product units and pricing display

### Shopping Features
- ✅ Shopping cart with add/remove functionality
- ✅ Quantity selector with +/- controls
- ✅ Persistent cart state management
- ✅ Stock availability validation
- ✅ Cart total calculations
- ✅ Add to Cart and Buy Now options
- ✅ Related products suggestions

### User Interface
- ✅ Home page with hero banner and product showcase
- ✅ Category navigation with product counts
- ✅ Product listing page with filtering
- ✅ Enhanced product details modal with:
  - Larger product images
  - Stock availability indicator
  - "Freshest Guaranteed" badge
  - "Delivery Available within 24 hours" badge
  - Quantity selector
  - Dual action buttons (Add to Cart & Buy Now)
- ✅ Cart page with order summary
- ✅ Loading states with spinners
- ✅ Error states with helpful messages
- ✅ Responsive mobile/tablet/desktop layouts
- ✅ Brand-consistent color scheme (Leaf Green, Soil Brown, Sky Blue)

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Customer registration
- `POST /login/password` - Password-based login
- `POST /login/otp` - OTP verification login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with OTP
- `GET /profile` - Get customer profile (protected)
- `POST /logout` - Logout (protected)

#### Catalog (`/api`)
- `GET /categories` - Fetch all categories with product counts
- `GET /products` - Fetch products with optional search and pagination
  - Query params: `search` (string), `limit` (1-100, default 40)
  - Supports search by product name or category name

---

## 📊 Database Schema

### Customers Table
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- customer_id (VARCHAR, UNIQUE)
- full_name (VARCHAR)
- mobile_number (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- village (VARCHAR)
- password (VARCHAR, hashed)
- created_at (DATETIME)
```

### OTPs Table
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- mobile_number (VARCHAR)
- otp_code (VARCHAR)
- is_used (BOOLEAN)
- expires_at (DATETIME)
- created_at (DATETIME)
```

### Categories Table
```sql
- id (INT, PRIMARY KEY)
- category_name (VARCHAR, UNIQUE)
- category_image (VARCHAR)
- status (BOOLEAN)
```

### Products Table
```sql
- id (INT, PRIMARY KEY)
- category_id (INT, FOREIGN KEY)
- product_name (VARCHAR)
- description (TEXT)
- product_image (VARCHAR)
- price (DECIMAL)
- stock (INT)
- unit (VARCHAR)
- is_featured (BOOLEAN)
- status (BOOLEAN)
```

---

## 📂 Project Structure

```text
Task1/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app setup, middleware, routes
│   │   ├── core/
│   │   │   ├── config.py          # Settings, CORS, JWT configuration
│   │   │   ├── deps.py            # Dependency injection (get_db, get_current_customer)
│   │   │   ├── security.py        # JWT, password hashing, token creation
│   │   │   └── utils.py           # Utility functions (customer_id, OTP generation)
│   │   ├── db/
│   │   │   └── session.py         # Database connection, Base class, get_db
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── customer.py        # Customer ORM model
│   │   │   ├── otp.py            # OTP ORM model
│   │   │   ├── category.py       # Category ORM model
│   │   │   └── product.py        # Product ORM model
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # Authentication endpoints
│   │   │   └── catalog.py        # Product & category endpoints
│   │   └── schemas/
│   │       ├── __init__.py
│   │       ├── customer.py       # Pydantic schemas for auth
│   │       └── catalog.py        # Pydantic schemas for products
│   ├── requirements.txt           # Python dependencies
│   └── schema.sql                 # Database schema with seed data
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app with routes
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Global styles
│   │   ├── api/
│   │   │   ├── auth.js           # Auth API calls
│   │   │   ├── catalog.js        # Catalog API calls
│   │   │   └── client.js         # Axios instance configuration
│   │   ├── components/           # Reusable components
│   │   │   ├── AlertBanner.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── BrandIcon.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── CustomerProfilePanel.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── FormInput.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetailsModal.jsx  # Enhanced with quantity selector
│   │   │   ├── SiteFooter.jsx
│   │   │   └── CartDrawer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state management
│   │   │   └── CartContext.jsx   # Shopping cart state management
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx     # Home page with featured & popular products
│   │   │   ├── CategoryProducts.jsx
│   │   │   ├── CartPage.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── data/
│   │   │   └── brand.js          # Brand config, hero slides, product images
│   │   └── public/
│   │       └── product-images/   # Local product images
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ (for frontend)
- **Python** 3.9+ (for backend)
- **MySQL** 8.0+ (database)
- **npm** or **yarn** (package manager)

### Backend Setup

#### 1. Create Python Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Configure Environment
Create `.env` file in the backend root:
```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/farm
SECRET_KEY=your_secret_key_here_min_32_chars_long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 4. Initialize Database
```bash
# Run MySQL schema
mysql -u root -p < schema.sql

# Or use a MySQL client to execute schema.sql
```

#### 5. Run Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs` (Swagger UI)

---

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Configure Environment
Create `.env.local` file in frontend root:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

#### 3. Run Development Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

#### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📱 Pages & Routes

### Public Routes
- `/login` - Customer login page
- `/register` - Customer registration page
- `/forgot-password` - Password recovery page
- `/` - Redirects to login

### Protected Routes (Requires Authentication)
- `/customer/dashboard` - Home page with categories, featured products, popular products
- `/category/:id` - Products filtered by category
- `/cart` - Shopping cart with order summary
- `*` - Not found page

---

## 🎨 Color Scheme & Branding

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | `#16A34A` (Leaf Green) | Buttons, links, CTAs |
| **Secondary** | `#78350F` (Soil Brown) | Text, backgrounds |
| **Accent** | `#0284C7` (Sky Blue) | Highlights, badges |
| **Neutral** | `#F8FAFC` (Sky Light) | Backgrounds |

**Brand Name**: FreshNest  
**Tagline**: Farm Market  
**Full Name**: FreshNest Farm Market

---

## 🔐 Authentication Flow

1. **Registration**: Customer enters details → Password hashed with bcrypt → User created
2. **Login (Password)**: Mobile + Password → Validation → JWT token issued
3. **Login (OTP)**: Mobile → OTP generated (5 min expiry) → OTP sent → Verification → JWT token
4. **Protected Access**: Token validated on each request → User info extracted from JWT

---

## 🛒 Shopping Flow

1. **Browse**: Customer views categories and products
2. **Search**: Full-text search across catalog
3. **View Details**: Modal with full product info, availability, delivery info
4. **Select Quantity**: Use +/- buttons to adjust quantity
5. **Add to Cart**: Product added to cart context
6. **Checkout**: Cart page shows all items, total, and payment options

---

## 📦 Product Categories

| Category | Unit | Sample Products |
|----------|------|-----------------|
| Milk & Dairy | Litre / Piece | A2 Cow Milk, Buffalo Curd |
| Goat Farm | Litre / Kg | Goat Milk, Goat Meat |
| Chicken Farm | Kg | Country Chicken, Broiler |
| Eggs | Piece | Country Eggs, White Eggs |
| Fresh Water Fish | Kg | Rohu, Catla |
| Sea Fish | Kg | Seer Fish, Sardine |
| Fresh Water Prawn | Kg | Fresh Water Prawn |
| Sea Prawn | Kg | Sea Tiger Prawn |
| Crab | Kg | Live Mud Crab |
| Meat | Kg | Mutton Curry Cut |

---

## 🔄 Recent Updates (v2.0.0)

### Product Details Modal Enhancement
- ✨ Larger product images with gradient background
- ✨ Stock availability badge showing exact quantity
- ✨ "Freshest Guaranteed" quality badge
- ✨ "Delivery Available within 24 hours" delivery badge
- ✨ Quantity selector with +/- buttons
- ✨ Dual action buttons (Add to Cart & Buy Now)
- ✨ Better visual hierarchy and spacing
- ✨ Back button for improved navigation
- ✨ White milk product image updates

### Image Updates
- Added fresh white milk bottle images for Cow Milk products
- High-quality product photography from Unsplash
- Optimized image loading with responsive sizing

---

## 🧪 API Testing

### Using cURL

#### Get Categories
```bash
curl -X GET "http://localhost:8000/api/categories"
```

#### Search Products
```bash
curl -X GET "http://localhost:8000/api/products?search=milk&limit=20"
```

#### Register Customer
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "mobile_number": "9876543210",
    "email": "john@example.com",
    "village": "Village Name",
    "password": "SecurePass123"
  }'
```

#### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login/password" \
  -H "Content-Type: application/json" \
  -d '{
    "mobile_number": "9876543210",
    "password": "SecurePass123"
  }'
```

---

## 🐛 Common Issues & Solutions

### Backend Issues

| Issue | Solution |
|-------|----------|
| **MySQL connection failed** | Verify MySQL is running, check credentials in `.env` |
| **Port 8000 already in use** | Run on different port: `--port 8001` |
| **Missing dependencies** | Run `pip install -r requirements.txt` again |
| **Database not initialized** | Execute `schema.sql` in MySQL |

### Frontend Issues

| Issue | Solution |
|-------|----------|
| **API connection failed** | Check `VITE_API_BASE_URL` in `.env.local` |
| **Port 5173 in use** | Use: `npm run dev -- --port 5174` |
| **Blank page** | Check browser console for errors, clear cache |
| **Style issues** | Ensure Tailwind CSS is compiled: `npm run dev` |

---

## 📝 Key Files Reference

| File | Purpose |
|------|---------|
| `backend/schema.sql` | Database initialization & seed data |
| `backend/app/core/config.py` | Application configuration |
| `backend/app/core/security.py` | JWT & password utilities |
| `frontend/src/context/AuthContext.jsx` | Global auth state |
| `frontend/src/context/CartContext.jsx` | Global cart state |
| `frontend/src/data/brand.js` | Brand config & product images |
| `frontend/tailwind.config.js` | Tailwind customization |

---

## 🚦 Project Status

### ✅ Completed
- Full authentication system
- Product catalog with search
- Shopping cart functionality
- Enhanced product details modal
- Responsive UI design
- MySQL database with indexes

### 🔄 In Progress
- Order management system
- Payment gateway integration
- Delivery tracking
- Customer reviews & ratings
- Admin dashboard

### 📋 Planned
- SMS/Email notifications
- Wishlist feature
- Order history
- Analytics dashboard
- Subscription service

---

## 📄 License

This project is part of the Stackly platform. All rights reserved.

---

## 👥 Team

Built with ❤️ for connecting villages to markets

---

## 📞 Support

For issues, questions, or suggestions:
1. Check the documentation above
2. Review API documentation at `/docs` (Swagger)
3. Check server logs for detailed error messages

---

**Last Updated**: July 16, 2026  
**Maintainers**: Stackly Development Team
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
