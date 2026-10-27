import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Page from '../components/Page'
import { categories, products } from '../data/products'
import { iconFor } from '../components/icons'

export default function Categories() {
  return (
    <Page title="Catégories" wide>
      <h1 className="display scene-title text-white">Catégories</h1>
      <p className="mt-4 max-w-2xl text-lg text-steel-300">Chaque gamme correspond à une étape du forage, du creusement à la distribution de l’eau.</p>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {categories.map((c) => {
          const Icon = iconFor(c.icon)
          const n = products.filter((p) => p.category === c.slug).length
          return (
            <li key={c.slug}>
              <Link to={`/catalogue?categorie=${c.slug}`} className="group flex h-full gap-6 border border-steel-700/40 bg-navy-900/60 p-6 transition-colors hover:border-volt-500/70">
                <div className="blueprint flex h-24 w-24 shrink-0 items-center justify-center">
                  <Icon className="text-volt-400" size={44} strokeWidth={1.25} aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col">
                  <h2 className="display text-3xl font-bold text-white">{c.name}</h2>
                  <p className="mt-1 flex-1 text-steel-500">{c.blurb}</p>
                  <p className="mt-4 inline-flex items-center gap-2 font-medium text-volt-400 group-hover:text-white">
                    {n} produit{n > 1 ? 's' : ''} <ArrowRight size={18} aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}
