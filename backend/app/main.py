from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import inspect, text

from app.core.config import settings
from app.db.session import Base, engine
from app.routers import auth, cart, catalog, address, order
import app.models  # noqa: F401 ensures models are registered before create_all

app = FastAPI(title="FarmNest Delivery API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Creates tables if they don't exist. For production, prefer Alembic migrations.
    Base.metadata.create_all(bind=engine)
    ensure_schema_updates()


def ensure_schema_updates():
    inspector = inspect(engine)
    if "products" in inspector.get_table_names():
        product_columns = {column["name"] for column in inspector.get_columns("products")}
        if "images" not in product_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE products ADD COLUMN images TEXT NULL"))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = err.get("loc", [])[-1]
        message = err.get("msg", "Invalid input")
        errors.append({"field": field, "message": message})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation failed", "errors": errors},
    )


app.include_router(auth.router)
app.include_router(catalog.router)
app.include_router(cart.router)
app.include_router(address.router)
app.include_router(order.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "FarmNest Delivery API"}
