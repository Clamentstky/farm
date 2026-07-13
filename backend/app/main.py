from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.db.session import Base, engine
from app.routers import auth
import app.models  # noqa: F401 ensures models are registered before create_all

app = FastAPI(title="Customer Authentication API", version="1.0.0")

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


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Customer Authentication API"}
