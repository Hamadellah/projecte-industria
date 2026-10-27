import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { getProduct } from '../data/products'

const STORAGE_KEY = 'industria-cinematic:cart:v1'
const CartContext = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((l) => l && getProduct(l.id) && Number.isInteger(l.qty) && l.qty > 0)
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.find((l) => l.id === action.id)
      if (found) return state.map((l) => (l.id === action.id ? { ...l, qty: Math.min(99, l.qty + (action.qty ?? 1)) } : l))
      return [...state, { id: action.id, qty: action.qty ?? 1 }]
    }
    case 'setQty':
      return state.map((l) => (l.id === action.id ? { ...l, qty: Math.max(1, Math.min(99, action.qty)) } : l))
    case 'remove':
      return state.filter((l) => l.id !== action.id)
    case 'clear':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  }, [lines])

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...l, product: getProduct(l.id) }))
    return {
      items,
      count: items.reduce((n, l) => n + l.qty, 0),
      total: items.reduce((n, l) => n + l.qty * l.product.price, 0),
      add: (id, qty = 1) => dispatch({ type: 'add', id, qty }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>')
  return ctx
}
