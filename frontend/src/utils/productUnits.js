const PACK_UNITS = new Set(['500ml', '1/2kg', '0.5kg'])

function formatDecimal(value) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, '')
}

export function formatStockLabel(product, unavailableLabel = 'Out of stock') {
  if (!product || product.stock <= 0) return unavailableLabel

  if (PACK_UNITS.has(String(product.unit).toLowerCase())) {
    return `${product.stock} packs available (${product.unit} each)`
  }

  return `${product.stock} ${product.unit} available`
}

export function formatQuantityLabel(product, quantity) {
  const amount = Number(quantity) || 0
  const unit = String(product?.unit || '').toLowerCase()

  if (unit === '500ml') {
    const totalMl = amount * 500
    if (totalMl >= 1000) return `${formatDecimal(totalMl / 1000)}L`
    return `${totalMl}ml`
  }

  if (unit === '1/2kg' || unit === '0.5kg') {
    const totalKg = amount / 2
    if (amount === 1) return '0.5kg'
    return `${formatDecimal(totalKg)}kg`
  }

  return `${amount} ${product?.unit || ''}`.trim()
}
