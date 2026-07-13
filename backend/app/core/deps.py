from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.customer import Customer

bearer_scheme = HTTPBearer()


def get_current_customer(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Customer:
    token = credentials.credentials
    payload = decode_access_token(token)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if payload is None:
        raise credentials_exception

    customer_id: str = payload.get("sub")
    if customer_id is None:
        raise credentials_exception

    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if customer is None:
        raise credentials_exception

    return customer
