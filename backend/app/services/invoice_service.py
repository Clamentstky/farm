import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.barcode import createBarcodeDrawing

from app.models.order import Order

# --- Color Palette ---
COLOR_PRIMARY = colors.HexColor("#166534")      # FarmNest Green (Tailwind leaf-800)
COLOR_PRIMARY_LIGHT = colors.HexColor("#dcfce7")# leaf-100
COLOR_TEXT_MAIN = colors.HexColor("#27272a")    # zinc-800
COLOR_TEXT_MUTED = colors.HexColor("#52525b")   # zinc-600
COLOR_TEXT_LIGHT = colors.HexColor("#a1a1aa")   # zinc-400
COLOR_BORDER = colors.HexColor("#e4e4e7")       # zinc-200
COLOR_BG_LIGHT = colors.HexColor("#f4f4f5")     # zinc-100
COLOR_WHITE = colors.white

# --- Styles ---
styles = getSampleStyleSheet()

style_title = ParagraphStyle('Title', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=24, textColor=COLOR_PRIMARY, spaceAfter=2)
style_subtitle = ParagraphStyle('Subtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=9, textColor=COLOR_TEXT_MUTED)
style_company_info = ParagraphStyle('CompanyInfo', parent=styles['Normal'], fontName='Helvetica', fontSize=8, textColor=COLOR_TEXT_MUTED, leading=10)

style_section_title = ParagraphStyle('SectionTitle', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12, textColor=COLOR_PRIMARY, spaceAfter=8, spaceBefore=15)
style_normal_bold = ParagraphStyle('NormalBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, textColor=COLOR_TEXT_MAIN)
style_normal = ParagraphStyle('Normal', parent=styles['Normal'], fontName='Helvetica', fontSize=9, textColor=COLOR_TEXT_MUTED, leading=12)
style_small = ParagraphStyle('Small', parent=styles['Normal'], fontName='Helvetica', fontSize=8, textColor=COLOR_TEXT_MUTED)
style_small_bold = ParagraphStyle('SmallBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=COLOR_TEXT_MAIN)

style_footer = ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica', fontSize=8, textColor=COLOR_TEXT_LIGHT, alignment=TA_CENTER)


# --- Custom Drawing Elements ---
def create_badge(text, bg_color, text_color):
    """Draws a rounded pill badge"""
    d = Drawing(80, 20)
    d.add(Rect(0, 0, 80, 20, rx=10, ry=10, fillColor=bg_color, strokeColor=bg_color))
    d.add(String(40, 6, text, fontName='Helvetica-Bold', fontSize=9, fillColor=text_color, textAnchor='middle'))
    return d

def get_status_badge(status):
    if status == 'Pending':
        return create_badge('Pending', colors.HexColor("#fef3c7"), colors.HexColor("#b45309")) # amber
    elif status == 'Confirmed':
        return create_badge('Confirmed', colors.HexColor("#e0e7ff"), colors.HexColor("#4338ca")) # indigo
    elif status == 'Preparing':
        return create_badge('Preparing', colors.HexColor("#fce7f3"), colors.HexColor("#be185d")) # pink
    elif status == 'Out for Delivery':
        return create_badge('Out for Delivery', colors.HexColor("#ffedd5"), colors.HexColor("#c2410c")) # orange
    elif status == 'Delivered':
        return create_badge('Delivered', colors.HexColor("#dcfce7"), colors.HexColor("#15803d")) # green
    elif status == 'Cancelled':
        return create_badge('Cancelled', colors.HexColor("#fee2e2"), colors.HexColor("#b91c1c")) # red
    return create_badge(status, COLOR_BG_LIGHT, COLOR_TEXT_MAIN)


class InvoiceDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kw):
        super().__init__(filename, **kw)
        frame = Frame(self.leftMargin, self.bottomMargin + 40, self.width, self.height - 40, id='normal')
        template = PageTemplate(id='InvoiceTemplate', frames=frame, onPage=self.on_page)
        self.addPageTemplates([template])

    def on_page(self, canvas, doc):
        canvas.saveState()
        
        # --- FOOTER ---
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(COLOR_TEXT_LIGHT)
        
        # Legal & System note
        canvas.drawString(doc.leftMargin, doc.bottomMargin + 25, "This is a computer-generated invoice. No signature required.")
        canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, doc.bottomMargin + 25, f"Page {doc.page}")
        
        # Bottom Support Strip
        canvas.setStrokeColor(COLOR_BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(doc.leftMargin, doc.bottomMargin + 15, doc.pagesize[0] - doc.rightMargin, doc.bottomMargin + 15)
        
        canvas.drawCentredString(doc.pagesize[0]/2.0, doc.bottomMargin, 
            "Thank you for choosing FarmNest. Freshness Delivered Every Day. | Support: support@farmnest.com | www.farmnest.com")
            
        canvas.restoreState()


def generate_invoice_pdf(order: Order) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = InvoiceDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    elements = []
    
    avail_w = A4[0] - 80 # Available width (A4 width minus 40pt left/right margins)
    
    # -------------------------------------------------------------------------
    # 1. HEADER ROW (Left: Brand/Company, Right: Invoice Info & QR)
    # -------------------------------------------------------------------------
    company_info = [
        Paragraph("<b>FarmNest</b>", style_title),
        Paragraph("Farm-to-Door Fresh Produce Delivery", style_subtitle),
        Spacer(1, 4),
        Paragraph("<b>GSTIN:</b> 29ABCDE1234F1Z5", style_company_info),
        Paragraph("<b>FSSAI:</b> 11223344556677", style_company_info),
        Paragraph("123 Farmville Road, Agri District, State 560001", style_company_info),
        Paragraph("support@farmnest.com  |  +91 98765 43210", style_company_info),
    ]

    date_str = order.created_at.strftime("%B %d, %Y") if order.created_at else "N/A"
    time_str = order.created_at.strftime("%I:%M %p") if order.created_at else "N/A"
    
    invoice_details_data = [
        [Paragraph("<b>INVOICE</b>", ParagraphStyle('I1', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=28, textColor=COLOR_BORDER, alignment=TA_RIGHT))],
        [Paragraph(f"<b>INV-{order.order_id}</b>", ParagraphStyle('I2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, textColor=COLOR_TEXT_MAIN, alignment=TA_RIGHT))],
        [Paragraph(f"Date: {date_str}", ParagraphStyle('I3', parent=styles['Normal'], fontName='Helvetica', fontSize=9, textColor=COLOR_TEXT_MUTED, alignment=TA_RIGHT))],
    ]
    
    qr = createBarcodeDrawing('QR', value=f"https://farmnest.com/orders/{order.order_id}", width=60, height=60)
    
    right_info_table = Table([
        [Table(invoice_details_data, colWidths=[avail_w * 0.4 - 70], style=[('ALIGN', (0,0), (-1,-1), 'RIGHT'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0)]), qr]
    ], colWidths=[avail_w * 0.4 - 70, 70])
    right_info_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    
    header_table = Table([[company_info, right_info_table]], colWidths=[avail_w * 0.6, avail_w * 0.4])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 20))
    
    
    # -------------------------------------------------------------------------
    # 2. STATUS & BARCODE ROW
    # -------------------------------------------------------------------------
    barcode = createBarcodeDrawing('Code128', value=f"ORD-{order.order_id}", width=150, height=30, humanReadable=True)
    
    status_row_data = [
        [
            Paragraph("<b>Order Status:</b>", style_normal_bold), 
            get_status_badge(order.order_status),
            Paragraph("<b>Payment Status:</b>", style_normal_bold),
            get_status_badge("Paid" if order.payment_method != "Cash on Delivery" else "Pending"),
            barcode
        ]
    ]
    status_table = Table(status_row_data, colWidths=[avail_w * 0.15, avail_w * 0.20, avail_w * 0.17, avail_w * 0.18, avail_w * 0.30])
    status_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (-1,0), (-1,-1), 'RIGHT'),
        ('LEFTPADDING', (0,0), (0,-1), 0),
    ]))
    elements.append(status_table)
    elements.append(Spacer(1, 20))


    # -------------------------------------------------------------------------
    # 3. CUSTOMER & BILLING CARDS (Side by Side)
    # -------------------------------------------------------------------------
    def build_address_card(title, address_obj, email, phone):
        card_data = []
        card_data.append([Paragraph(title, ParagraphStyle('card_t', parent=style_normal_bold, textColor=COLOR_PRIMARY))])
        
        if address_obj:
            addr_str = f"{address_obj.address}<br/>{address_obj.village}, {address_obj.district}<br/>{address_obj.state} - {address_obj.pincode}"
            name = address_obj.full_name
        else:
            addr_str = "N/A"
            name = "N/A"
            
        card_data.append([Paragraph(f"<b>{name}</b>", style_normal)])
        card_data.append([Paragraph(addr_str, style_normal)])
        card_data.append([Paragraph(f"Email: {email or 'N/A'}", style_normal)])
        card_data.append([Paragraph(f"Phone: {phone or 'N/A'}", style_normal)])
        
        t = Table(card_data, colWidths=[(avail_w / 2.0) - 10])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_LIGHT),
            ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        return t
        
    email = order.address.email if hasattr(order.address, 'email') else "customer@example.com"
    phone = order.address.mobile_number if order.address else ""
    
    billing_card = build_address_card("Billing Details", order.address, email, phone)
    shipping_card = build_address_card("Shipping Details", order.address, email, phone)
    
    cards_table = Table([[billing_card, shipping_card]], colWidths=[avail_w / 2.0, avail_w / 2.0])
    cards_table.setStyle(TableStyle([
        ('LEFTPADDING', (0,0), (0,0), 0),
        ('RIGHTPADDING', (1,0), (1,0), 0),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(cards_table)
    elements.append(Spacer(1, 20))


    # -------------------------------------------------------------------------
    # 4. ADVANCED PRODUCT TABLE
    # -------------------------------------------------------------------------
    elements.append(Paragraph("Product Summary", style_section_title))
    
    # Table Header: # | Item Description | Category | Unit Price | Qty | Tax (5%) | Subtotal
    table_headers = [
        Paragraph("<b>#</b>", style_small_bold),
        Paragraph("<b>Item Description</b>", style_small_bold),
        Paragraph("<b>Unit Price</b>", style_small_bold),
        Paragraph("<b>Qty</b>", style_small_bold),
        Paragraph("<b>Tax (5%)</b>", style_small_bold),
        Paragraph("<b>Subtotal</b>", style_small_bold)
    ]
    
    table_data = [table_headers]
    
    for idx, item in enumerate(order.items, 1):
        price = float(item.price)
        qty = item.quantity
        subtotal = price * qty
        tax = subtotal * 0.05  # Simulate 5% tax for enterprise look
        
        row = [
            Paragraph(str(idx), style_small),
            Paragraph(f"<b>{item.product_name}</b><br/><font color='#52525b'>Premium Farm Fresh Quality</font>", style_small),
            Paragraph(f"Rs {price:.2f}", style_small),
            Paragraph(str(qty), style_small),
            Paragraph(f"Rs {tax:.2f}", style_small),
            Paragraph(f"Rs {subtotal:.2f}", style_small_bold),
        ]
        table_data.append(row)
        
    t_products = Table(table_data, colWidths=[avail_w * 0.05, avail_w * 0.40, avail_w * 0.15, avail_w * 0.10, avail_w * 0.15, avail_w * 0.15], repeatRows=1)
    
    # Alternating row colors
    product_table_style = [
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY_LIGHT),
        ('TEXTCOLOR', (0,0), (-1,0), COLOR_PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ALIGN', (2,0), (-1,-1), 'RIGHT'), # Price right
        ('ALIGN', (3,0), (3,-1), 'CENTER'), # Qty center
        ('ALIGN', (4,0), (-1,-1), 'RIGHT'), # Tax & Subtotal right
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, COLOR_BORDER),
    ]
    for i in range(1, len(table_data)):
        if i % 2 == 0:
            product_table_style.append(('BACKGROUND', (0,i), (-1,i), COLOR_BG_LIGHT))
            
    t_products.setStyle(TableStyle(product_table_style))
    elements.append(t_products)
    elements.append(Spacer(1, 15))


    # -------------------------------------------------------------------------
    # 5. ORDER CALCULATION (Bottom Right) & TIMELINE (Bottom Left)
    # -------------------------------------------------------------------------
    # Timeline
    timeline_data = []
    timeline_data.append([Paragraph("<b>Order Timeline</b>", style_section_title)])
    
    # We will safely render history if available, else standard fallback
    if hasattr(order, 'history') and order.history:
        for hist in order.history:
            dt = hist.created_at.strftime("%b %d, %H:%M")
            timeline_data.append([Paragraph(f"<font color='{COLOR_PRIMARY.hexval()}'>✓</font> <b>{hist.status}</b> ({dt})", style_small)])
    else:
        timeline_data.append([Paragraph(f"<font color='{COLOR_PRIMARY.hexval()}'>✓</font> <b>{order.order_status}</b>", style_small)])
        
    timeline_data.append([Spacer(1, 15)])
    timeline_data.append([Paragraph("<b>Delivery Information</b>", style_normal_bold)])
    timeline_data.append([Paragraph("<b>Partner:</b> FarmNest Logistics", style_small)])
    timeline_data.append([Paragraph(f"<b>Time:</b> {time_str}", style_small)])

    t_timeline = Table(timeline_data, colWidths=[avail_w * 0.45])
    t_timeline.setStyle(TableStyle([('LEFTPADDING', (0,0), (-1,-1), 0), ('VALIGN', (0,0), (-1,-1), 'TOP')]))

    # Calculations
    raw_subtotal = float(order.total_amount) - float(order.delivery_charge) + float(order.discount or 0)
    simulated_tax = raw_subtotal * 0.05
    base_subtotal = raw_subtotal - simulated_tax
    platform_fee = 2.00
    
    calc_data = [
        [Paragraph("Subtotal (excl. Tax)", style_normal), Paragraph(f"Rs {base_subtotal:.2f}", style_normal)],
        [Paragraph("Tax (IGST/SGST/CGST)", style_normal), Paragraph(f"Rs {simulated_tax:.2f}", style_normal)],
        [Paragraph("Delivery Charge", style_normal), Paragraph(f"Rs {float(order.delivery_charge):.2f}", style_normal)],
        [Paragraph("Platform Fee", style_normal), Paragraph(f"Rs {platform_fee:.2f}", style_normal)],
    ]
    
    if order.discount and float(order.discount) > 0:
        calc_data.append([Paragraph("Coupon Discount", style_normal), Paragraph(f"-Rs {float(order.discount):.2f}", style_normal)])
        
    grand_total = float(order.total_amount) + platform_fee
        
    calc_data.append([Paragraph("<b>Grand Total</b>", style_normal_bold), Paragraph(f"<b>Rs {grand_total:.2f}</b>", style_normal_bold)])
    
    paid_amount = grand_total if order.payment_method != "Cash on Delivery" else 0.0
    balance = grand_total - paid_amount
    
    calc_data.append([Paragraph("Paid Amount", style_small), Paragraph(f"Rs {paid_amount:.2f}", style_small)])
    calc_data.append([Paragraph("<b>Balance Due</b>", style_normal_bold), Paragraph(f"<b>Rs {balance:.2f}</b>", style_normal_bold)])
    
    t_calc = Table(calc_data, colWidths=[avail_w * 0.55 * 0.6, avail_w * 0.55 * 0.4])
    t_calc.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('LINEABOVE', (0,-3), (-1,-3), 1, COLOR_BORDER),  # Above Grand Total
        ('LINEBELOW', (0,-3), (-1,-3), 1, COLOR_BORDER),  # Below Grand Total
        ('BACKGROUND', (0,-1), (-1,-1), COLOR_PRIMARY_LIGHT), # Balance due highlight
        ('TEXTCOLOR', (0,-1), (-1,-1), COLOR_PRIMARY),
    ]))
    
    bottom_table = Table([[t_timeline, t_calc]], colWidths=[avail_w * 0.45, avail_w * 0.55])
    bottom_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    
    elements.append(KeepTogether(bottom_table))
    elements.append(Spacer(1, 30))
    
    # -------------------------------------------------------------------------
    # 6. LEGAL SECTION
    # -------------------------------------------------------------------------
    legal_text = """
    <b>Terms & Conditions:</b><br/>
    1. Returns are accepted within 24 hours of delivery for fresh produce, subject to verification.<br/>
    2. Refunds for cancelled orders will be processed within 5-7 business days.<br/>
    3. Prices are inclusive of all taxes unless specified otherwise.<br/>
    4. FarmNest is a registered trademark of FarmNest Private Limited.<br/>
    5. Subject to local jurisdiction only.
    """
    elements.append(KeepTogether([
        Paragraph("<b>Important Notes</b>", style_normal_bold),
        Paragraph(legal_text, style_small)
    ]))

    doc.build(elements)
    buffer.seek(0)
    return buffer
