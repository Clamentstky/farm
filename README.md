# 🌾 GrameenFresh - Authentic Village Farm Delivery

**GrameenFresh** is a full-stack, farm-to-table e-commerce web application connecting local village farms directly to customers. Built with **React 18**, **FastAPI**, **SQLAlchemy**, and **MySQL**.

---

## ✨ Features

- 🔐 **Authentication & Profile**: Customer registration, password/OTP login, password reset, and inline profile editing (name, phone, email, village).
- 🥦 **Farm Product Catalog**: 10 categories (Milk & Dairy, Eggs, Seafood, Poultry, Meat, etc.) and 30+ fresh farm products with stock tracking and beautiful product imagery.
- 🎠 **Dynamic Dashboard**:
  - Horizontal side-scrollable carousels for **Featured** and **Popular** products.
  - Sticky mobile & desktop headers with active section tracking (*Home, Categories, Featured, Popular*).
- 🏷️ **Category Feed**: Clean single-column view for exploring products by category.
- 🛒 **Advanced Shopping Cart**:
  - Item quantity controls, subtotal formatting, single-line clear cart option, promo code support, and order summary.
  - Streamlined Single-Page Checkout (Review Cart, Select Address & Payment, Place Order).
- 📍 **Address & Order Management**:
  - Saved delivery address management (Add, Edit, Set Default, Delete) integrated right into the checkout flow.
  - Minimalist, item-focused Flipkart-style Orders page with image previews, order ID generation (ORD-YYYYMMDD-XXXX), live order tracking timeline, and order cancellation.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM 6, Axios |
| **Backend** | FastAPI, Uvicorn, Python 3.10+, SQLAlchemy, PyMySQL, Pydantic |
| **Database** | MySQL 8.0+ |
| **Auth** | JWT Bearer Tokens, Passlib (Bcrypt), Python-JOSE |

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- MySQL Server

### 1. Database Setup
Create MySQL database `farm` and import schema:
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
    │   ├── components/     # UI components (ProductCard, SiteFooter, etc.)
    │   ├── context/        # Auth & Cart React Context providers
    │   ├── pages/          # Dashboard, CategoryProducts, CartPage, Checkout, Orders
    │   └── api/            # Axios API client modules
    ├── public/             # Static assets & product images
    └── package.json        # Frontend dependencies & scripts
```

---

## 📜 License
Developed for GrameenFresh - Authentic Village Farm Delivery.
