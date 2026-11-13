import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, FileText, Minus, Plus, ShoppingCart } from 'lucide-react'
import Page from '../components/Page'
import ProductVisual from '../components/ProductVisual'
import ProductCard from '../components/ProductCard'
import { formatPrice } from '../data/products'
import { getStoreProduct, getStoreProducts } from '../services/storeService'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { id } = useParams()
  const { add } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [quotations, setQuotations] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError('')
    setProduct(null)
    setRelated([])
    setQuotations([])
    setQty(1)
    setAdded(false)

    // 1. جلب تفاصيل المنتج
    getStoreProduct(id)
      .then((data) => {
        if (cancelled) return

        setProduct({
          ...data,
          ref: data.reference,
          summary: data.description,
          category: data.category?.slug ?? '',
          specs: data.product_specifications ?? data.productSpecifications ?? [],
        })

        // 2. جلب المنتجات المشابهة
        getStoreProducts()
          .then((items) => {
            if (cancelled || !Array.isArray(items)) return

            setRelated(
              items
                .filter(
                  (item) =>
                    item.id !== data.id &&
                    item.category_id === data.category_id
                )
                .slice(0, 3)
                .map((item) => ({
                  ...item,
                  ref: item.reference,
                  summary: item.description,
                  category: item.category?.slug ?? '',
                }))
            )
          })
          .catch((err) => {
            console.error('Erreur chargement produits similaires :', err)
          })
      })
      .catch((err) => {
        console.error('Erreur chargement produit :', err)
        if (!cancelled) {
          setError('Impossible de charger ce produit. Vérifiez votre connexion au serveur.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // 3. جلب الديڤيسات الحقيقية الخاصة بهذا المنتج من الباك إند (Public بلا توكن)
    fetch(`http://127.0.0.1:8000/api/client/products/${id}/quotations`, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled && data.quotations) {
          setQuotations(data.quotations)
        }
      })
      .catch(() => {
        // في حالة عدم وجود ديڤيسات أو خطأ، يبقى الـ array خاوي
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <Page title="Chargement du produit">
        <p className="py-16 text-center text-steel-300">
          Chargement du produit...
        </p>
      </Page>
    )
  }

  if (error || !product) {
    return (
      <Page title="Produit introuvable">
        <h1 className="display scene-title text-white">
          {error ? 'Erreur de chargement.' : 'Produit introuvable.'}
        </h1>
        <p className="mt-4 text-steel-300">
          {error || "Cette référence n'existe pas dans le catalogue."}
        </p>
        <Link to="/catalogue" className="btn-volt mt-8">
          Retour au catalogue
        </Link>
      </Page>
    )
  }

  const category = product.category
  const categoryName = product.category?.name ?? 'Catalogue'
  const specifications = Array.isArray(product.specs)
    ? product.specs
    : Object.entries(product.specs ?? {}).map(([name, value]) => ({
        id: name,
        name,
        value,
      }))

  const onAdd = () => {
    add(product.id, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <Page title={product.name} wide>
      <Link
        to={category ? `/catalogue?categorie=${category}` : '/catalogue'}
        className="inline-flex items-center gap-2 text-steel-300 hover:text-white"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        {categoryName}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductVisual product={product} size="large" />

        <div>
          <p className="text-steel-500">Réf. {product.reference}</p>

          <h1 className="display mt-1 text-5xl font-extrabold text-white md:text-6xl">
            {product.name}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-steel-300">
            {product.description || 'Aucune description disponible.'}
          </p>

          <p className="display mt-8 text-5xl font-bold text-white">
            {formatPrice(product.price)}
          </p>

          <p className="mt-1 text-sm text-steel-500">
            {Number(product.stock_quantity) > 0
              ? `${product.stock_quantity} unité(s) en stock`
              : 'Actuellement indisponible'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div
              className="flex items-center border border-steel-700/60"
              role="group"
              aria-label="Quantité"
            >
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center hover:bg-navy-700"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
              >
                <Minus size={18} aria-hidden="true" />
              </button>

              <span className="w-12 text-center font-semibold" aria-live="polite">
                {qty}
              </span>

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center hover:bg-navy-700"
                onClick={() =>
                  setQty((q) =>
                    Math.min(Number(product.stock_quantity) || 99, q + 1)
                  )
                }
                disabled={qty >= Number(product.stock_quantity)}
                aria-label="Augmenter la quantité"
              >
                <Plus size={18} aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              className="btn-volt disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onAdd}
              disabled={Number(product.stock_quantity) < 1}
            >
              {added ? (
                <Check size={20} aria-hidden="true" />
              ) : (
                <ShoppingCart size={20} aria-hidden="true" />
              )}
              {added ? 'Ajouté au panier' : 'Ajouter au panier'}
            </button>

            {added && (
              <Link to="/panier" className="font-medium text-volt-400 hover:text-white">
                Voir le panier
              </Link>
            )}
          </div>

          {/* ========================================================= */}
          {/* لا يظهر هذا البلوك نهائياً إلا إذا وجد الـ API ديڤيسات حقيقية للمنتج */}
          {/* ========================================================= */}
          {quotations.length > 0 && (
            <div className="mt-8 border border-volt-400/30 bg-navy-800/60 p-5 rounded-xl">
              <div className="flex items-center gap-2 text-volt-400">
                <FileText size={20} aria-hidden="true" />
                <h3 className="font-semibold text-white">
                  Devis disponible(s) pour ce produit
                </h3>
              </div>

              <div className="mt-4 divide-y divide-steel-700/40">
                {quotations.map((q) => (
                  <div key={q.id} className="flex flex-wrap items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-white">{q.quotation_number ?? `Devis #${q.id}`}</p>
                      <p className="text-xs text-steel-400">Total : {formatPrice(q.total)} • Statut : {q.status}</p>
                    </div>
                    <Link
                      to={`/compte/devis/${q.id}`}
                      className="inline-flex items-center gap-2 border border-volt-400 px-4 py-2 text-sm font-semibold text-volt-400 transition hover:bg-volt-400 hover:text-navy-950"
                    >
                      <FileText size={16} />
                      Afficher le devis
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="display mt-12 text-3xl font-bold text-white">
            Caractéristiques
          </h2>

          {specifications.length > 0 ? (
            <dl className="mt-4 divide-y divide-steel-700/40 border-y border-steel-700/40">
              {specifications.map((spec, index) => (
                <div
                  key={spec.id ?? `${spec.name}-${index}`}
                  className="grid grid-cols-2 gap-4 py-3"
                >
                  <dt className="text-steel-500">{spec.name}</dt>
                  <dd className="text-white">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-steel-500">
              Aucune caractéristique disponible pour ce produit.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related">
          <h2 id="related" className="display text-4xl font-bold text-white">
            Dans la même gamme
          </h2>

          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  )
}