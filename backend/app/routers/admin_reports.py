from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.db.session import get_db
from app.models.order import Order
from app.models.customer import Customer

router = APIRouter(prefix="/api/admin/reports", tags=["Admin Reports"])

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    # Total Revenue
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.order_status != "Cancelled").scalar() or 0
    
    # Today's Revenue
    today = date.today()
    todays_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= today,
        Order.order_status != "Cancelled"
    ).scalar() or 0
    
    # Total Orders
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    
    # Avg Order Value
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    # Total Customers
    from app.models.category import Category
    from app.models.product import Product
    from app.models.order import OrderItem
    
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    
    # Mock data for revenue chart
    revenue_data = [40, 60, 45, 80, 55, 90, 75, 110, 85, 120, 100, 140]
    
    # Real data for category distribution
    cat_revenues = db.query(
        Category.category_name, 
        func.sum(OrderItem.price * OrderItem.quantity)
    ).select_from(OrderItem).join(Product, OrderItem.product_id == Product.id).join(
        Category, Product.category_id == Category.id
    ).group_by(Category.category_name).all()
    
    total_cat_revenue = sum(rev for name, rev in cat_revenues if rev)
    
    colors = ['bg-green-500', 'bg-orange-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500']
    category_data = []
    
    if total_cat_revenue > 0:
        sorted_cats = sorted(cat_revenues, key=lambda x: x[1] or 0, reverse=True)
        for idx, (name, rev) in enumerate(sorted_cats[:4]):
            val = rev or 0
            percentage = round((val / total_cat_revenue) * 100)
            category_data.append({
                "name": name,
                "value": percentage,
                "color": colors[idx % len(colors)]
            })
        
        # If there are more than 4, add an "Others" category
        if len(sorted_cats) > 4:
            others_rev = sum(rev for name, rev in sorted_cats[4:] if rev)
            others_perc = round((others_rev / total_cat_revenue) * 100)
            category_data.append({
                "name": "Others",
                "value": others_perc,
                "color": "bg-gray-500"
            })
    else:
        category_data = [{"name": "No Data", "value": 100, "color": "bg-gray-300"}]
    
    # Get all orders ordered by created_at desc
    orders = db.query(Order, Customer).outerjoin(
        Customer, Order.customer_id == Customer.id
    ).order_by(Order.created_at.desc()).all()
    
    table_data = []
    recent_activities = []
    village_counts = {}
    
    for idx, (order, customer) in enumerate(orders):
        cust_name = customer.full_name if customer else "Unknown"
        village = customer.village if customer and customer.village else "Unknown"
        
        # Populate table data
        if idx < 50:
            table_data.append({
                "id": order.order_id,
                "customer": cust_name,
                "village": village,
                "revenue": order.total_amount,
                "method": order.payment_method,
                "status": order.order_status,
                "date": order.created_at.strftime("%b %d, %Y")
            })
            
        # Populate recent activities (limit 5)
        if idx < 5:
            recent_activities.append({
                "id": order.id,
                "type": "order",
                "icon": "FaBoxOpen",
                "color": "blue",
                "text": f"New order {order.order_id} placed by {cust_name}",
                "time": order.created_at.strftime("%b %d, %Y")
            })
            
        # Village aggregation
        if village in village_counts:
            village_counts[village] += 1
        else:
            village_counts[village] = 1

    colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500']
    village_data = []
    for idx, (village, count) in enumerate(sorted(village_counts.items(), key=lambda item: item[1], reverse=True)[:5]):
        village_data.append({
            "name": village,
            "orders": count,
            "color": colors[idx % len(colors)]
        })
        
    if not village_data:
        village_data = [{"name": "No Data", "orders": 0, "color": "bg-gray-500"}]
        
    # Pending / Delivered stats
    pending_orders = sum(1 for o, c in orders if o.order_status == "Pending")
    delivered_orders = sum(1 for o, c in orders if o.order_status == "Delivered")
    
    return {
        "kpis": {
            "todays_revenue": float(todays_revenue),
            "total_revenue": float(total_revenue),
            "total_orders": total_orders,
            "avg_order_value": float(avg_order_value),
            "total_customers": total_customers,
            "pending_orders": pending_orders,
            "delivered_orders": delivered_orders
        },
        "revenue_data": revenue_data,
        "category_data": category_data,
        "table_data": table_data,
        "recent_activities": recent_activities,
        "village_data": village_data
    }
