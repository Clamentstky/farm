# GraminFresh - Customer Authentication Module

Village-based fresh farm products delivery platform.

Day 1 milestone focuses on customer authentication, customer dashboard navigation, profile display, mobile OTP login, and mobile-first UI.

## Tech Stack

- Frontend: React JS with Vite
- Styling: Tailwind CSS
- Backend: Python FastAPI
- Database: MySQL
- ORM: SQLAlchemy
- Authentication: JWT Bearer token
- Password security: bcrypt hashing through Passlib

## Features Completed

- Customer registration
- Auto-generated customer IDs like `CUS001`, `CUS002`
- Unique mobile number validation
- Password login
- Mobile number + OTP login
- Development OTP displayed on screen for local testing
- Forgot password with OTP reset flow
- JWT authentication
- Protected customer dashboard route
- Customer profile API
- Customer dashboard after login
- Mobile home screen with delivery location
- GPS location capture button
- Product search box
- Product image cards for farm products
- Profile tab on dashboard
- Logout
- Mobile-only responsive layout
- GraminFresh app icon and favicon

## Product Categories

The dashboard currently displays:

- Cow Milk
- Goat Milk
- Fresh Water Fish
- Sea Fish
- Fresh Water Prawn
- Sea Prawn
- Country Chicken
- Broiler Chicken
- Country Eggs
- White Eggs
- Quail Eggs
- Duck Eggs
- Goat Meat
- Other Farm Products

## Folder Structure

```text
Task1/
|-- backend/
|   |-- app/
|   |   |-- core/          # Config, JWT, password hashing, dependencies, utilities
|   |   |-- db/            # SQLAlchemy database session
|   |   |-- models/        # Customer and OTP models
|   |   |-- routers/       # Auth API routes
|   |   |-- schemas/       # Pydantic request/response schemas
|   |   |-- main.py        # FastAPI app entry point
|   |-- schema.sql         # MySQL database/table setup
|   |-- requirements.txt
|   |-- .env.example
|
|-- frontend/
|   |-- public/
|   |   |-- favicon.svg
|   |   |-- product-images/ # Local product images
|   |-- src/
|   |   |-- api/            # Axios client and auth API calls
|   |   |-- components/     # Shared UI components
|   |   |-- context/        # Auth context and session state
|   |   |-- pages/          # Login, Register, ForgotPassword, Dashboard
|   |   |-- routes/         # ProtectedRoute
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- .env.example
|   |-- vite.config.js
```

## Backend Setup

```bash
cd backend
python -m venv ../.venv
../.venv/Scripts/activate
pip install -r requirements.txt
```

Create backend environment file:

```bash
copy .env.example .env
```

Update `backend/.env` with your MySQL and JWT settings.

Example:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/farm
JWT_SECRET_KEY=change-this-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173
```

Create MySQL database and tables:

```bash
mysql -u root -p < schema.sql
```

Run backend:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend health check:

```text
http://127.0.0.1:8000/
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
```

Example `frontend/.env`:

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
| `/customer/dashboard` | Protected | Customer home, products, profile, location |

## Backend API Endpoints

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register customer and return JWT | No |
| `POST` | `/api/auth/login/password` | Login using mobile number and password | No |
| `POST` | `/api/auth/otp/request` | Generate OTP for mobile login | No |
| `POST` | `/api/auth/otp/verify` | Verify OTP and return JWT | No |
| `POST` | `/api/auth/forgot-password` | Generate OTP for password reset | No |
| `POST` | `/api/auth/reset-password` | Reset password using OTP | No |
| `GET` | `/api/auth/profile` | Get logged-in customer profile | Yes |
| `POST` | `/api/auth/logout` | Stateless logout response | Yes |

## Database Tables

### `customers`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | INT | Primary key |
| `customer_id` | VARCHAR(20) | Unique ID like `CUS001` |
| `full_name` | VARCHAR(150) | Required |
| `mobile_number` | VARCHAR(15) | Required and unique |
| `email` | VARCHAR(150) | Unique |
| `village` | VARCHAR(150) | Customer village/location |
| `password` | VARCHAR(255) | Hashed password |
| `created_at` | DATETIME | Created timestamp |

### `otps`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | INT | Primary key |
| `mobile_number` | VARCHAR(15) | Mobile number for OTP |
| `otp_code` | VARCHAR(6) | Generated OTP |
| `is_used` | BOOLEAN | Single-use OTP flag |
| `expires_at` | DATETIME | OTP expiry time |
| `created_at` | DATETIME | Created timestamp |

## Authentication Flow

1. Customer registers with full name, mobile number, email, village, password, and confirm password.
2. Backend validates input and checks unique mobile number/email.
3. Backend generates a customer ID such as `CUS001`.
4. Password is hashed before saving.
5. Backend returns JWT and customer profile.
6. Frontend stores JWT in `localStorage`.
7. Protected routes use the JWT as `Authorization: Bearer <token>`.
8. Login can happen through password or OTP.
9. OTPs expire after 5 minutes and can be used only once.
10. Logout clears local session data.

## OTP Development Note

OTP is currently for local development.

The backend returns `dev_otp` in the OTP API response, and the frontend displays it on screen.

This is useful for testing without an SMS gateway. Before production:

- Remove `dev_otp` from public API responses.
- Integrate SMS delivery with MSG91, Twilio, or another SMS provider.
- Keep OTP server-side only.

## Mobile Dashboard

The protected dashboard includes:

- GraminFresh brand icon
- Welcome header
- Customer ID card
- Delivery location section
- GPS location capture
- Search box
- Product image grid
- Product filtering by name/category
- Profile tab
- Logout button

The UI is constrained to a mobile width with a max width of `480px`.

## Important Files

| File | Purpose |
| --- | --- |
| `backend/app/routers/auth.py` | Auth API logic |
| `backend/app/schemas/customer.py` | Request/response validation |
| `backend/app/models/customer.py` | Customer table model |
| `backend/app/models/otp.py` | OTP table model |
| `backend/app/core/security.py` | JWT and password helpers |
| `frontend/src/context/AuthContext.jsx` | Frontend auth/session state |
| `frontend/src/api/auth.js` | Auth API functions |
| `frontend/src/pages/Login.jsx` | Password and OTP login screen |
| `frontend/src/pages/Register.jsx` | Registration screen |
| `frontend/src/pages/Dashboard.jsx` | Customer dashboard, products, search, profile |
| `frontend/src/components/BrandIcon.jsx` | GraminFresh icon |

## Validation and Error Handling

- Mobile number must be a valid 10-digit Indian mobile number.
- Password must be at least 6 characters.
- Confirm password must match.
- Mobile number must be unique.
- Email must be unique.
- FastAPI validation errors are formatted consistently.
- Axios interceptor attaches JWT to requests.
- Axios interceptor clears local session on `401`.

## Milestone 1 Status

- [x] Customer Registration
- [x] Customer Login
- [x] OTP Login
- [x] Forgot Password
- [x] Customer Dashboard Navigation
- [x] Backend APIs
- [x] MySQL Database Setup
- [x] JWT Authentication
- [x] Protected Routes
- [x] Mobile Responsive UI
- [x] Customer Profile
- [x] Home Location Section
- [x] Product Search
- [x] Product Image Cards
- [x] GraminFresh Icon

## Next Suggested Milestones

- Product database table
- Product listing API
- Cart module
- Order placement
- Delivery address management
- Admin product management
- SMS gateway integration
- Payment integration
