
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Wrench } from 'lucide-react'
import CinematicHero from '../components/CinematicHero'
import { getStoreCategories } from '../services/storeService'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    document.title = 'INDUSTRIA — L’excellence du forage'

    getStoreCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Erreur chargement catégories :', err)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main>
      <CinematicHero />

      <section className="blueprint" aria-labelledby="gammes">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <h2
            id="gammes"
            className="display scene-title text-white"
          >
            De la foreuse à la pompe.
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-steel-300">
            Des équipements professionnels pour vos projets de forage.
          </p>

          <ul className="mt-12 grid gap-px bg-steel-700/30 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <li className="bg-abyss p-7 text-white">
                Chargement des catégories...
              </li>
            )}

            {error && (
              <li className="bg-abyss p-7 text-white">
                Impossible de charger les catégories.
                Vérifiez que Laravel est démarré.
              </li>
            )}

            {!loading && !error && categories.length === 0 && (
              <li className="bg-abyss p-7 text-white">
                Aucune catégorie disponible pour le moment.
              </li>
            )}

            {!loading && !error && categories.map((category) => (
              <li key={category.id} className="bg-abyss">
                <Link
                  to={`/catalogue?categorie=${category.slug}`}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-navy-800"
                >
                  <Wrench
                    className="text-volt-400"
                    size={36}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />

                  <h3 className="display mt-6 text-3xl font-bold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-2 flex-1 text-steel-500">
                    {category.description ||
                      'Découvrez notre gamme de produits professionnels.'}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 font-medium text-volt-400 group-hover:text-white">
                    Voir les produits
                    <ArrowRight size={18} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}

            <li className="bg-volt-600">
              <Link
                to="/contact?sujet=devis"
                className="group flex h-full flex-col justify-between p-7 hover:bg-volt-500"
              >
                <h3 className="display text-3xl font-bold text-white">
                  Un projet de forage ?
                </h3>

                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
                  Demander un devis
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
