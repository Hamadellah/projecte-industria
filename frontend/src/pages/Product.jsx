import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react'
import Page from '../components/Page'
import ProductVisual from '../components/ProductVisual'
import ProductCard from '../components/ProductCard'
import { formatPrice, getCategory, getProduct, products } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { id } = useParams()
  const product = getProduct(id)
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <Page title="Produit introuvable">
        <h1 className="display scene-title text-white">Produit introuvable.</h1>
        <p className="mt-4 text-steel-300">Cette référence n’existe pas dans le catalogue.</p>
        <Link to="/catalogue" className="btn-volt mt-8">Retour au catalogue</Link>
      </Page>
    )
  }

  const cat = getCategory(product.category)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  const onAdd = () => {
    add(product.id, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <Page title={product.name} wide>
      <Link to={`/catalogue?categorie=${cat.slug}`} className="inline-flex items-center gap-2 text-steel-300 hover:text-white">
        <ArrowLeft size={18} aria-hidden="true" /> {cat.name}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductVisual product={product} size="large" />
        <div>
          <p className="text-steel-500">Réf. {product.ref}</p>
          <h1 className="display mt-1 text-5xl font-extrabold text-white md:text-6xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-steel-300">{product.description}</p>
          <p className="display mt-8 text-5xl font-bold text-white">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-steel-500">Prix hors taxes indicatif de démonstration. Stock non géré.</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-steel-700/60" role="group" aria-label="Quantité">
              <button type="button" className="flex h-12 w-12 items-center justify-center hover:bg-navy-700" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité"><Minus size={18} aria-hidden="true" /></button>
              <span className="w-12 text-center font-semibold" aria-live="polite">{qty}</span>
              <button type="button" className="flex h-12 w-12 items-center justify-center hover:bg-navy-700" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Augmenter la quantité"><Plus size={18} aria-hidden="true" /></button>
            </div>
            <button type="button" className="btn-volt" onClick={onAdd}>
              {added ? <Check size={20} aria-hidden="true" /> : <ShoppingCart size={20} aria-hidden="true" />}
              {added ? 'Ajouté au panier' : 'Ajouter au panier'}
            </button>
            {added && <Link to="/panier" className="font-medium text-volt-400 hover:text-white">Voir le panier</Link>}
          </div>

          <h2 className="display mt-12 text-3xl font-bold text-white">Caractéristiques</h2>
          <dl className="mt-4 divide-y divide-steel-700/40 border-y border-steel-700/40">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 gap-4 py-3">
                <dt className="text-steel-500">{k}</dt>
                <dd className="text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related">
          <h2 id="related" className="display text-4xl font-bold text-white">Dans la même gamme</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
          </ul>
        </section>
      )}
    </Page>
  )
}
