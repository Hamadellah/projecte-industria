
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductVisual from './ProductVisual'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleAdd() {
    setAdding(true)
    setMessage('')
    setSuccess(false)

    try {
      await add(product.id, 1)
      setMessage('Produit ajouté au panier.')
      setSuccess(true)
    } catch (error) {
      setMessage(
        error.message || "Impossible d'ajouter ce produit au panier."
      )
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="group flex flex-col border border-steel-700/40 bg-navy-900/60 transition-colors hover:border-volt-500/70">
      <Link
        to={`/produit/${product.id}`}
        aria-label={`Voir ${product.name}`}
      >
        <ProductVisual product={product} />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="display text-2xl font-bold leading-tight text-white">
          <Link
            to={`/produit/${product.id}`}
            className="hover:text-volt-400"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-steel-500">
          {product.summary}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="display text-2xl font-bold text-white">
            {formatPrice(product.price)}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="btn-volt !px-4 !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus size={18} aria-hidden="true" />
            {adding ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-3 text-sm ${
              success ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </article>
  )
}
