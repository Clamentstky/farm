from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, date

from app.db.session import get_db
from app.core.deps import get_current_admin
from app.models.admin import AdminUser
from app.models.customer import Customer
from app.models.order import Order
from app.models.product import Product
from app.models.category import Category

router = APIRouter(prefix="/api/admin/dashboard", tags=["Admin Dashboard"])

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()
    
    pending_orders = db.query(Order).filter(Order.order_status == "Pending").count()
    delivered_orders = db.query(Order).filter(Order.order_status == "Delivered").count()
    
    # Calculate revenue
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.order_status != "Cancelled").scalar() or 0
    
    today = date.today()
    todays_revenue = db.query(func.sum(Order.total_amount)).filter(
        func.date(Order.created_at) == today,
        Order.order_status != "Cancelled"
    ).scalar() or 0
    
    from datetime import timedelta
    weekly_revenue = []
    for i in range(6, -1, -1):
        target_date = today - timedelta(days=i)
        day_revenue = db.query(func.sum(Order.total_amount)).filter(
            func.date(Order.created_at) == target_date,
            Order.order_status != "Cancelled"
        ).scalar() or 0
        
        day_name = target_date.strftime("%a")
        weekly_revenue.append({
            "name": day_name,
            "revenue": float(day_revenue)
        })

    from app.models.order import OrderItem
    
    top_items_query = db.query(
        OrderItem.product_id,
        Product.product_name,
        Product.product_image,
        Product.images,
        func.sum(OrderItem.quantity).label("units_sold"),
        func.sum(OrderItem.quantity * OrderItem.price).label("revenue")
    ).join(
        Product, OrderItem.product_id == Product.id
    ).join(
        Order, OrderItem.order_id == Order.id
    ).filter(
        Order.order_status != "Cancelled"
    ).group_by(
        OrderItem.product_id, Product.product_name, Product.product_image, Product.images
    ).order_by(
        desc("revenue")
    ).limit(4).all()

    top_performing_items = []
    import json
    for item in top_items_query:
        img_url = item.product_image
        if not img_url and item.images:
            try:
                images_list = json.loads(item.images)
                if images_list:
                    img_url = images_list[0]
            except:
                pass

        top_performing_items.append({
            "product_id": item.product_id,
            "name": item.product_name,
            "image": img_url,
            "units_sold": int(item.units_sold or 0),
            "revenue": float(item.revenue or 0)
        })

    return {
        "total_categories": total_categories,
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "todays_revenue": float(todays_revenue),
        "total_revenue": float(total_revenue),
        "weekly_revenue": weekly_revenue,
        "top_performing_items": top_performing_items
    }
