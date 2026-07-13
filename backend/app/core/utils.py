import random
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.customer import Customer


def generate_customer_id(db: Session) -> str:
    """
    Generates a sequential customer ID like CUS001, CUS002, ...
    Uses count-based approach with a fallback scan in case of gaps,
    guarded by the unique constraint at the DB level.
    """
    last_customer = db.query(Customer).order_by(Customer.id.desc()).first()
    if not last_customer:
        return "CUS001"

    last_number_str = last_customer.customer_id.replace("CUS", "")
    try:
        last_number = int(last_number_str)
    except ValueError:
        last_number = db.query(func.count(Customer.id)).scalar() or 0

    next_number = last_number + 1
    return f"CUS{next_number:03d}"


def generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"
