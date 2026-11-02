
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Page from '../components/Page'
import { iconFor } from '../components/icons'
import { getStoreCategories, getStoreProducts } from '../services/storeService'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([getStoreCategories(), getStoreProducts()])
      .then(([categoryData, productData]) => {
        if (cancelled) return

        setCategories(Array.isArray(categoryData) ? categoryData : [])
        setProducts(Array.isArray(productData) ? productData : [])
      })
      .catch((err) => {
        console.error('Erreur de chargement des catégories :', err)
        if (!cancelled) {
          setError('Impossible de charger les catégories. Vérifiez que le serveur fonctionne.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Page title="Catégories" wide>
      <h1 className="display scene-title text-white">Catégories</h1>

      <p className="mt-4 max-w-2xl text-lg text-steel-300">
        Chaque gamme correspond à une étape du forage, du creusement à la distribution de l’eau.
      </p>

      {loading && (
        <p className="mt-8 text-steel-300">Chargement des catégories...</p>
      )}

      {!loading && error && (
        <p role="alert" className="mt-8 text-red-400">{error}</p>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="mt-8 text-steel-300">Aucune catégorie disponible.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = iconFor(category.icon)
            const count = products.filter((product) => {
              const productCategoryId = product.category_id ?? product.category?.id
              return String(productCategoryId) === String(category.id)
            }).length

            return (
              <li key={category.id}>
                <Link
                  to={`/catalogue?categorie=${category.slug}`}
                  className="group flex h-full gap-6 border border-steel-700/40 bg-navy-900/60 p-6 transition-colors hover:border-volt-500/70"
                >
                  <div className="blueprint flex h-24 w-24 shrink-0 items-center justify-center">
                    <Icon
                      className="text-volt-400"
                      size={44}
                      strokeWidth={1.25}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h2 className="display text-3xl font-bold text-white">
                      {category.name}
                    </h2>

                    <p className="mt-1 flex-1 text-steel-500">
                      {category.description ?? category.blurb ?? ''}
                    </p>

                    <p className="mt-4 inline-flex items-center gap-2 font-medium text-volt-400 group-hover:text-white">
                      {count} produit{count > 1 ? 's' : ''}
                      <ArrowRight size={18} aria-hidden="true" />
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Page>
  )
}
