
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import Page from '../components/Page'
import ProductCard from '../components/ProductCard'
import { getStoreCategories, getStoreProducts } from '../services/storeService'

const norm = (s = '') =>
  String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const q = params.get('q') ?? ''
  const rawCat = params.get('categorie') ?? ''
  const sort = params.get('tri') ?? 'defaut'

  useEffect(() => {
    let cancelled = false

    Promise.all([getStoreProducts(), getStoreCategories()])
      .then(([productData, categoryData]) => {
        if (cancelled) return
        setProducts(Array.isArray(productData) ? productData : [])
        setCategories(Array.isArray(categoryData) ? categoryData : [])
      })
      .catch((err) => {
        console.error('Erreur chargement catalogue :', err)
        if (!cancelled) setError('Impossible de charger les produits. Vérifiez que Laravel est démarré.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const cat = categories.some((c) => c.slug === rawCat) ? rawCat : ''

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const needle = norm(q.trim())

    let out = products.filter((p) => {
      const categorySlug = p.category?.slug ?? ''
      const text = `${p.name ?? ''} ${p.reference ?? ''} ${p.description ?? ''}`

      return (!cat || categorySlug === cat) &&
        (!needle || norm(text).includes(needle))
    })

    if (sort === 'prix-asc') {
      out = [...out].sort((a, b) => Number(a.price) - Number(b.price))
    }
    if (sort === 'prix-desc') {
      out = [...out].sort((a, b) => Number(b.price) - Number(a.price))
    }
    if (sort === 'nom') {
      out = [...out].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
    }

    return out
  }, [products, q, cat, sort])

  const selectedCategory = categories.find((c) => c.slug === cat)

  const chip = (active) =>
    `px-4 py-2 text-sm font-medium border transition-colors ${
      active
        ? 'border-volt-500 bg-volt-500 text-white'
        : 'border-steel-700/60 text-steel-300 hover:border-volt-400 hover:text-white'
    }`

  return (
    <Page title={selectedCategory?.name ?? 'Catalogue'} wide>
      <h1 className="display scene-title text-white">
        {selectedCategory?.name ?? 'Catalogue des équipements'}
      </h1>

      <p className="mt-3 text-steel-500">
        Découvrez nos équipements professionnels disponibles au catalogue.
      </p>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher un produit</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            className="field !pl-11"
            placeholder="Rechercher par nom ou référence"
            value={q}
            onChange={(e) => update('q', e.target.value)}
          />
        </label>

        <label className="flex items-center gap-3 text-steel-300">
          <span>Trier par</span>
          <select
            className="field !w-auto"
            value={sort}
            onChange={(e) => update('tri', e.target.value === 'defaut' ? '' : e.target.value)}
          >
            <option value="defaut">Pertinence</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="nom">Nom (A–Z)</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
        <button
          type="button"
          className={chip(!cat)}
          aria-pressed={!cat}
          onClick={() => update('categorie', '')}
        >
          Toutes
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={chip(cat === category.slug)}
            aria-pressed={cat === category.slug}
            onClick={() => update('categorie', category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <p className="mt-8 text-steel-300" aria-live="polite">
        {loading ? 'Chargement des produits...' : `${list.length} produit${list.length > 1 ? 's' : ''}`}
      </p>

      {error ? (
        <div className="mt-6 border border-steel-700/40 p-10 text-center text-white">
          {error}
        </div>
      ) : !loading && list.length === 0 ? (
        <div className="mt-6 border border-steel-700/40 p-10 text-center">
          <p className="display text-3xl font-bold text-white">
            Aucun produit ne correspond.
          </p>
          <p className="mt-2 text-steel-500">
            Essayez un autre mot-clé ou retirez les filtres.
          </p>
          <button
            type="button"
            className="btn-ghost mt-6"
            onClick={() => setParams({}, { replace: true })}
          >
            <X size={18} aria-hidden="true" /> Réinitialiser les filtres
          </button>
        </div>
      ) : !loading ? (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={{
                  ...product,
                  ref: product.reference,
                  summary: product.description,
                  category: product.category?.slug ?? '',
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </Page>
  )
}
