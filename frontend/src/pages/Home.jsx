import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CinematicHero from '../components/CinematicHero'
import { categories } from '../data/products'
import { iconFor } from '../components/icons'

export default function Home() {
  useEffect(() => {
    document.title = 'INDUSTRIA — L’excellence du forage'
  }, [])

  return (
    <main>
      <CinematicHero />
      <section className="blueprint" aria-labelledby="gammes">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <h2 id="gammes" className="display scene-title text-white">De la foreuse à la pompe.</h2>
          <p className="mt-4 max-w-2xl text-lg text-steel-300">Sept gammes pour équiper un forage d’eau de bout en bout.</p>
          <ul className="mt-12 grid gap-px bg-steel-700/30 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const Icon = iconFor(c.icon)
              return (
                <li key={c.slug} className="bg-abyss">
                  <Link to={`/catalogue?categorie=${c.slug}`} className="group flex h-full flex-col p-7 transition-colors hover:bg-navy-800">
                    <Icon className="text-volt-400" size={36} strokeWidth={1.25} aria-hidden="true" />
                    <h3 className="display mt-6 text-3xl font-bold text-white">{c.name}</h3>
                    <p className="mt-2 flex-1 text-steel-500">{c.blurb}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-medium text-volt-400 group-hover:text-white">
                      Voir les produits <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              )
            })}
            <li className="bg-volt-600">
              <Link to="/contact?sujet=devis" className="group flex h-full flex-col justify-between p-7 hover:bg-volt-500">
                <h3 className="display text-3xl font-bold text-white">Un projet de forage ?</h3>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
                  Demander un devis <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
