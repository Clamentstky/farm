from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_customer
from app.db.session import get_db
from app.models.customer import Customer
from app.models.address import CustomerAddress
from app.schemas.address import AddressCreateIn, AddressUpdateIn, AddressOut

router = APIRouter(prefix="/api/addresses", tags=["Addresses"])


@router.get("", response_model=list[AddressOut])
def get_addresses(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    addresses = (
        db.query(CustomerAddress)
        .filter(CustomerAddress.customer_id == customer.id)
        .order_by(CustomerAddress.is_default.desc(), CustomerAddress.created_at.desc())
        .all()
    )
    return addresses


@router.post("", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def add_address(
    payload: AddressCreateIn,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    if payload.is_default:
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == customer.id,
            CustomerAddress.is_default == True,  # noqa: E712
        ).update({"is_default": False})

    address = CustomerAddress(
        customer_id=customer.id,
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        address=payload.address,
        village=payload.village,
        district=payload.district,
        state=payload.state,
        pincode=payload.pincode,
        landmark=payload.landmark,
        is_default=payload.is_default,
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.put("/{address_id}", response_model=AddressOut)
def update_address(
    address_id: int,
    payload: AddressUpdateIn,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    address = (
        db.query(CustomerAddress)
        .filter(CustomerAddress.id == address_id, CustomerAddress.customer_id == customer.id)
        .first()
    )
    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    update_data = payload.model_dump(exclude_unset=True)

    if "is_default" in update_data and update_data["is_default"]:
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == customer.id,
            CustomerAddress.is_default == True,  # noqa: E712
            CustomerAddress.id != address_id,
        ).update({"is_default": False})

    for field, value in update_data.items():
        setattr(address, field, value)

    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    address = (
        db.query(CustomerAddress)
        .filter(CustomerAddress.id == address_id, CustomerAddress.customer_id == customer.id)
        .first()
    )
    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    db.delete(address)
    db.commit()
    return None