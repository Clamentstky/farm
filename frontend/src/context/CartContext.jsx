import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addCartItem, getCartItems, removeCartItem, updateCartItem } from '../api/cart'
import { extractErrorMessage } from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { customer } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (!customer || !token) {
      setCartItems([])
      return []
    }

    setLoading(true)
    setError('')
    try {
      const items = await getCartItems()
      setCartItems(items)
      return items
    } catch (err) {
      setError(extractErrorMessage(err))
      return []
    } finally {
      setLoading(false)
    }
  }, [customer])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = async (product, quantity = 1) => {
    if (!localStorage.getItem('access_token')) {
      throw new Error('Please log in to add items to cart.')
    }
    setError('')
    const savedItem = await addCartItem(product.id, quantity)
    setCartItems((items) => {
      const existing = items.find((item) => item.id === savedItem.id)
      if (existing) {
        return items.map((item) => (item.id === savedItem.id ? savedItem : item))
      }
      return [savedItem, ...items]
    })
    return savedItem
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(cartItemId)
    }

    setError('')
    const savedItem = await updateCartItem(cartItemId, quantity)
    setCartItems((items) => items.map((item) => (item.id === cartItemId ? savedItem : item)))
    return savedItem
  }

  const removeFromCart = async (cartItemId) => {
    setError('')
    await removeCartItem(cartItemId)
    setCartItems((items) => items.filter((item) => item.id !== cartItemId))
  }

  const clearCart = async () => {
    await Promise.all(cartItems.map((item) => removeCartItem(item.id).catch(() => {})))
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
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        error,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
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
