import { Link } from 'react-router-dom'
import { categories } from '../data/products'

export default function Footer() {
  return (
    <footer className="border-t border-steel-700/30 bg-abyss">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="display text-3xl font-extrabold text-white">INDUSTR<span className="text-volt-500">I</span>A</div>
          <p className="mt-3 max-w-xs text-steel-500">Équipements de forage de puits d’eau : de la machine à la pompe immergée.</p>
        </div>
        <nav aria-label="Catégories">
          <h2 className="display text-xl font-bold text-white">Équipements</h2>
          <ul className="mt-3 space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link className="text-steel-300 hover:text-white" to={`/catalogue?categorie=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Informations">
          <h2 className="display text-xl font-bold text-white">Contact</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="text-steel-300 hover:text-white" to="/contact">Demander un devis</Link></li>
            <li><Link className="text-steel-300 hover:text-white" to="/panier">Votre panier</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-steel-700/30 px-5 py-5 text-center text-sm text-steel-500">
        Site de démonstration : produits, prix, stocks et commandes sont fictifs et ne sont reliés à aucun système commercial.
      </div>
    </footer>
  )
}
