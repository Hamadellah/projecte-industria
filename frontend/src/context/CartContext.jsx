
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { apiRequest } from '../services/api'

const CartContext = createContext(null)
const GUEST_CART_KEY = 'industria_guest_cart'

function getGuestCart() {
  try {
    const data = JSON.parse(
      localStorage.getItem(GUEST_CART_KEY) || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function calculateTotal(items) {
  return items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  )
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAuthenticated = () =>
    Boolean(localStorage.getItem('token'))

  // Charger le panier
  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      const guestItems = getGuestCart()

      setItems(guestItems)
      setTotal(calculateTotal(guestItems))
      return
    }

    setLoading(true)

    try {
      const data = await apiRequest('/cart')

      const cartItems = Array.isArray(data.items)
        ? data.items
        : []

      setItems(cartItems)
      setTotal(Number(data.total || 0))
      setError('')
    } catch (err) {
      setError(err.message || 'Impossible de charger le panier.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart().catch(console.error)
  }, [refreshCart])

  // Ajouter un produit
  const add = useCallback(async (productId, quantity = 1, product = null) => {
    if (!isAuthenticated()) {
      const guestItems = getGuestCart()

      const existing = guestItems.find(
        item => Number(item.product_id) === Number(productId)
      )

      if (existing) {
        existing.quantity += quantity
      } else {
        guestItems.push({
          id: `guest-${productId}`,
          product_id: productId,
          name: product?.name || 'Produit',
          reference: product?.reference || '',
          price: Number(product?.price || 0),
          image: product?.image || null,
          quantity,
        })
      }

      localStorage.setItem(
        GUEST_CART_KEY,
        JSON.stringify(guestItems)
      )

      await refreshCart()
      return
    }

    await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    })

    await refreshCart()
  }, [refreshCart])

  // نقل المنتجات إلى حساب المستخدم بعد Login
  const migrateGuestCart = useCallback(async () => {
    const guestItems = getGuestCart()

    if (!guestItems.length) {
      await refreshCart()
      return
    }

    if (!isAuthenticated()) {
      throw new Error('Vous devez vous connecter.')
    }

    // طلب واحد Transaction من Laravel
    await apiRequest('/cart/sync', {
      method: 'POST',
      body: JSON.stringify({
        items: guestItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      }),
    })

    // نمسحو Guest Cart غير إلا نجحت المزامنة
    localStorage.removeItem(GUEST_CART_KEY)

    await refreshCart()
  }, [refreshCart])

  // تغيير الكمية
  const setQty = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return

    if (String(itemId).startsWith('guest-')) {
      const guestItems = getGuestCart().map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )

      localStorage.setItem(
        GUEST_CART_KEY,
        JSON.stringify(guestItems)
      )

      await refreshCart()
      return
    }

    await apiRequest(`/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })

    await refreshCart()
  }, [refreshCart])

  // حذف منتج
  const remove = useCallback(async (itemId) => {
    if (String(itemId).startsWith('guest-')) {
      const guestItems = getGuestCart().filter(
        item => item.id !== itemId
      )

      localStorage.setItem(
        GUEST_CART_KEY,
        JSON.stringify(guestItems)
      )

      await refreshCart()
      return
    }

    await apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    })

    await refreshCart()
  }, [refreshCart])

  // إفراغ السلة
  const clear = useCallback(async () => {
    if (!isAuthenticated()) {
      localStorage.removeItem(GUEST_CART_KEY)
      await refreshCart()
      return
    }

    await apiRequest('/cart/clear', {
      method: 'DELETE',
    })

    await refreshCart()
  }, [refreshCart])

  const count = useMemo(
    () => items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    ),
    [items]
  )

  const value = useMemo(() => ({
    items,
    total,
    count,
    loading,
    error,
    add,
    setQty,
    remove,
    clear,
    refreshCart,
    migrateGuestCart,
  }), [
    items,
    total,
    count,
    loading,
    error,
    add,
    setQty,
    remove,
    clear,
    refreshCart,
    migrateGuestCart,
  ])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart doit être utilisé dans <CartProvider>'
    )
  }

  return context
}
