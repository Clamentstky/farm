# 🌾 FarmNest - Authentic Village Farm Delivery

**FarmNest** is a full-stack, premium farm-to-table e-commerce web application connecting local village farms directly to customers. Built with **React 18**, **Framer Motion**, **FastAPI**, **SQLAlchemy**, and **MySQL**, providing an ultra-premium, dynamic, and responsive shopping experience.

---

## ✨ Key Features

### 🔐 Authentication & Profile
- Customer registration, secure login, password reset.
- Inline profile editing (name, phone, email, village) integrated into a sleek side-panel.

### 🥦 Farm Product Catalog & Dashboard
- **Dynamic Dashboard**: 
  - Horizontal side-scrollable carousels showcasing **all products**, providing a seamless browsing experience without leaving the page.
  - Sticky mobile & desktop headers with active section tracking.
- **Premium UI / Micro-interactions**: 
  - An animated, glassmorphism-style footer powered by **Framer Motion** featuring staggered entrances, hover glow effects, and scale transitions.
  - Consistent branding with large, clean typography and lush green aesthetics.
- 10 structured categories (Milk & Dairy, Eggs, Seafood, Poultry, Meat, etc.) and 30+ fresh farm products with stock tracking and high-quality imagery.

### 🛒 Advanced Shopping Cart & Checkout
- **Cart**: Item quantity controls, subtotal formatting, single-line clear cart option, promo code support, and dynamic order summary.
- **Single-Page Checkout**: 
  - Streamlined UI (Review Cart, Select Address & Payment, Place Order).
  - Saved delivery address management (Add, Edit, Set Default, Delete) integrated directly into the checkout flow.
  - Immediate Cash on Delivery and Online Payment options.

### 📦 Comprehensive Order Management
- **Dashboard & Search**: Minimalist, item-focused Orders page with real-time **Search Box Auto-complete** for filtering by Order ID or Product Name.
- **Order Details**: 
  - **Invoice Preview Modal**: A fully responsive, A4-styled on-screen invoice preview mimicking physical receipts.
  - **PDF Generation**: Direct secure downloads for PDF Invoices streaming directly from the FastAPI backend.
  - **Cancellation Flow**: Interactive cancel module requiring a cancellation reason (e.g., *Found a better price*, *Others*) before processing.
  - **Reorder**: Single-click "Reorder" to immediately push previously bought items back into the cart.
  - **Live Tracking**: Visual order tracking timeline from Pending to Delivered.
  - **Sticky Action Panels**: Mobile-optimized action bars ensuring tracking, invoice viewing, and support options are always reachable.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router DOM 6, React Icons, Axios |
| **Backend** | FastAPI, Uvicorn, Python 3.10+, SQLAlchemy, PyMySQL, Pydantic |
| **Database** | MySQL 8.0+ |
| **Auth** | JWT Bearer Tokens, Passlib (Bcrypt), Python-JOSE |
| **Documents**| PDF generation and streaming |

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- MySQL Server

### 1. Database Setup
Create a MySQL database `farm` and import the schema:
```bash
mysql -u root -p farm < backend/schema.sql
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Activate virtual environment
# Windows:
..\.venv\Scripts\activate
# Linux/macOS:
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m app.main
```
Backend server runs at: `http://localhost:8000` (API Docs at `/docs`).

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend application runs at: `http://localhost:5173`.

---

## 📁 Repository Structure

```
Task1/
├── backend/
│   ├── app/
│   │   ├── routers/        # Auth, Catalog, Cart, Order, Address endpoints
│   │   ├── models/         # SQLAlchemy ORM database models
│   │   ├── schemas/        # Pydantic validation schemas
│   │   └── main.py         # FastAPI application entry point
│   ├── schema.sql          # Database schema & initial seed data
│   └── requirements.txt    # Python backend dependencies
└── frontend/
    ├── src/
    │   ├── components/     # UI components (Orders, Cart, Layouts, etc.)
    │   ├── context/        # Auth, Cart, and Toast Context providers
    │   ├── pages/          # Dashboard, CategoryProducts, CartPage, Checkout, MyOrders
    │   └── services/       # Axios API client modules
    ├── public/             # Static assets & product images
    └── package.json        # Frontend dependencies & scripts
```

---

## 📜 License
Developed for FarmNest - Authentic Village Farm Delivery.
