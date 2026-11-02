
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

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Récupérer le panier depuis Laravel
  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setItems([])
      setTotal(0)
      return
    }

    setLoading(true)

    try {
      const data = await apiRequest('/cart')

      setItems(Array.isArray(data.items) ? data.items : [])
      setTotal(Number(data.total || 0))
      setError('')
    } catch (err) {
      setError(err.message || 'Impossible de charger le panier.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger le panier au démarrage
  useEffect(() => {
    refreshCart().catch((err) => {
      console.error('Erreur de chargement du panier :', err)
    })
  }, [refreshCart])

  // Ajouter un produit dans le panier Laravel
  const add = useCallback(async (productId, quantity = 1) => {
    if (!localStorage.getItem('token')) {
      throw new Error('Connectez-vous pour ajouter un produit au panier.')
    }

    try {
      await apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      })

      await refreshCart()
    } catch (err) {
      setError(err.message || "Impossible d'ajouter ce produit.")
      throw err
    }
  }, [refreshCart])

  // Modifier la quantité
  const setQty = useCallback(async (itemId, quantity) => {
    await apiRequest(`/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })

    await refreshCart()
  }, [refreshCart])

  // Supprimer un produit
  const remove = useCallback(async (itemId) => {
    await apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    })

    await refreshCart()
  }, [refreshCart])

  // Vider le panier
  const clear = useCallback(async () => {
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
    throw new Error('useCart doit être utilisé dans <CartProvider>')
  }

  return context
}
