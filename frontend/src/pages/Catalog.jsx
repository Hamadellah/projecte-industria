import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpDown, RotateCcw, Search, X } from 'lucide-react'
import Page from '../components/Page'
import ProductCard from '../components/ProductCard'
import { getStoreCategories, getStoreProducts } from '../services/storeService'

const norm = (s = '') =>
  String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const darkFieldStyle = {
  backgroundColor: '#0b1528',
  color: '#f8fafc',
}

const darkOptionStyle = {
  backgroundColor: '#070d1a',
  color: '#f8fafc',
}

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
        if (!cancelled) {
          setError('Impossible de charger les produits. Vérifiez que le serveur API est démarré.')
        }
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

      return (
        (!cat || categorySlug === cat) &&
        (!needle || norm(text).includes(needle))
      )
    })

    if (sort === 'prix-asc') {
      out = [...out].sort((a, b) => Number(a.price) - Number(b.price))
    }
    if (sort === 'prix-desc') {
      out = [...out].sort((a, b) => Number(b.price) - Number(a.price))
    }
    if (sort === 'nom') {
      out = [...out].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'fr'))
    }

    return out
  }, [products, q, cat, sort])

  const selectedCategory = categories.find((c) => c.slug === cat)
  const hasActiveFilters = Boolean(q.trim() || cat || (sort && sort !== 'defaut'))

  const pillClass = (active) =>
    `inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide border transition-all cursor-pointer whitespace-nowrap ${
      active
        ? 'border-[#3b82f6] bg-[#1e6bff] text-white shadow-[0_0_20px_rgba(30,107,255,0.35)]'
        : 'border-white/10 bg-[#0b1528]/80 text-steel-300 hover:border-[#3b82f6]/50 hover:bg-[#11203b] hover:text-white'
    }`

  return (
    <Page title={selectedCategory?.name ?? 'Catalogue'} wide>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#70a7ff]">
            Catalogue technique
          </span>
          <h1 className="display scene-title mt-1 text-white">
            {selectedCategory?.name ?? 'Catalogue des équipements'}
          </h1>
        </div>

        <p className="text-sm text-steel-400">
          Découvrez nos équipements professionnels disponibles au catalogue.
        </p>
      </div>

      {/* شريط البحث والترتيب */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher un produit</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#70a7ff]"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            style={darkFieldStyle}
            className="w-full rounded-full border border-white/10 py-3 pl-11 pr-10 text-sm placeholder-steel-400 shadow-inner transition-colors focus:border-[#3b82f6] focus:outline-none"
            placeholder="Rechercher un équipement, une référence..."
            value={q}
            onChange={(e) => update('q', e.target.value)}
          />
          {q && (
            <button
              type="button"
              onClick={() => update('q', '')}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-steel-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-2.5">
          <label
            style={darkFieldStyle}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-steel-300 transition-colors focus-within:border-[#3b82f6]"
          >
            <ArrowUpDown size={15} className="text-[#70a7ff]" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-steel-400">
              Tri
            </span>
            <select
              style={darkFieldStyle}
              className="cursor-pointer bg-transparent pr-1 text-sm font-medium text-white focus:outline-none"
              value={sort}
              onChange={(e) => update('tri', e.target.value === 'defaut' ? '' : e.target.value)}
            >
              <option value="defaut" style={darkOptionStyle}>
                Pertinence
              </option>
              <option value="prix-asc" style={darkOptionStyle}>
                Prix croissant
              </option>
              <option value="prix-desc" style={darkOptionStyle}>
                Prix décroissant
              </option>
              <option value="nom" style={darkOptionStyle}>
                Nom (A–Z)
              </option>
            </select>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setParams({}, { replace: true })}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0b1528] px-4 py-2.5 text-xs font-semibold text-steel-200 transition-colors hover:border-red-400/50 hover:bg-red-950/30 hover:text-red-200"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* شريط التصنيفات */}
      <div
        className="mt-4 flex flex-wrap items-center gap-2 border-b border-white/10 pb-5"
        role="group"
        aria-label="Filtrer par catégorie"
      >
        <button
          type="button"
          className={pillClass(!cat)}
          aria-pressed={!cat}
          onClick={() => update('categorie', '')}
        >
          Toutes
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={pillClass(cat === category.slug)}
            aria-pressed={cat === category.slug}
            onClick={() => update('categorie', category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-steel-300" aria-live="polite">
        {loading
          ? 'Chargement des produits...'
          : `${list.length} produit${list.length > 1 ? 's' : ''}`}
      </p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1528]/70 p-10 text-center text-white">
          {error}
        </div>
      ) : !loading && list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1528]/70 p-10 text-center">
          <p className="display text-3xl font-bold text-white">
            Aucun produit ne correspond.
          </p>
          <p className="mt-2 text-steel-400">
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