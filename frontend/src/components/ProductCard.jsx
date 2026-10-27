import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductVisual from './ProductVisual'

export default function ProductCard({ product }) {
  const { add } = useCart()
  return (
    <article className="group flex flex-col border border-steel-700/40 bg-navy-900/60 transition-colors hover:border-volt-500/70">
      <Link to={`/produit/${product.id}`} aria-label={`Voir ${product.name}`}>
        <ProductVisual product={product} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="display text-2xl font-bold leading-tight text-white">
          <Link to={`/produit/${product.id}`} className="hover:text-volt-400">{product.name}</Link>
        </h3>
        <p className="mt-2 flex-1 text-steel-500">{product.summary}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="display text-2xl font-bold text-white">{formatPrice(product.price)}</p>
          <button type="button" onClick={() => add(product.id)} className="btn-volt !px-4 !py-2.5 text-sm" aria-label={`Ajouter ${product.name} au panier`}>
            <Plus size={18} aria-hidden="true" /> Ajouter
          </button>
        </div>
      </div>
    </article>
  )
}
