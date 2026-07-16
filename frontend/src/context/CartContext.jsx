import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart_items')
    return stored ? JSON.parse(stored) : []
  })

  const saveCart = (updater) => {
    setCartItems((items) => {
      const nextItems = updater(items)
      localStorage.setItem('cart_items', JSON.stringify(nextItems))
      return nextItems
    })
  }

  const addToCart = (product) => {
    saveCart((items) => {
      const existing = items.find((item) => item.id === product.id)
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...items, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    saveCart((items) =>
      items
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId) => {
    saveCart((items) => items.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    localStorage.removeItem('cart_items')
    setCartItems([])
  }

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0),
    [cartItems]
  )

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
