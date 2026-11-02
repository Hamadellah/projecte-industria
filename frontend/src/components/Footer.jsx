
import { Link } from 'react-router-dom'
import { categories } from '../data/products'
import {
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'

const CONTACT = {
  phone: '+212600000004',
  email: 'contact@example.com',
}

export default function Footer() {
  return (
    <footer className="border-t border-steel-700/30 bg-abyss">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-3 md:px-8">

        {/* Brand */}
        <div>
          <Link to="/" className="inline-block">
            <div className="display text-3xl font-extrabold text-white">
              INDUSTR<span className="text-volt-500">I</span>A
            </div>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-steel-400">
            Équipements de forage de puits d’eau, pompes immergées
            et solutions industrielles pour vos projets.
          </p>

          <div className="mt-5 flex items-start gap-2 text-sm text-steel-500">
            <MapPin size={17} className="mt-0.5 shrink-0 text-volt-400" />
            <span>xxxxx</span>
          </div>
        </div>

        {/* Equipment categories */}
        <nav aria-label="Catégories d’équipements">
          <h2 className="display text-xl font-bold text-white">
            Équipements
          </h2>

          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  className="inline-flex items-center gap-2 text-sm text-steel-400 transition hover:text-volt-400"
                  to={`/catalogue?categorie=${category.slug}`}
                >
                  <ArrowUpRight size={14} />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="display text-xl font-bold text-white">
            Contact
          </h2>

          <p className="mt-4 text-sm leading-6 text-steel-400">
            Une question sur nos équipements ? Contactez directement
            notre service client.
          </p>

          <div className="mt-4 space-y-3">
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-3 text-sm text-steel-300 transition hover:text-volt-400"
            >
              <Phone size={17} className="shrink-0 text-volt-400" />
              {CONTACT.phone}
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3 break-all text-sm text-steel-300 transition hover:text-volt-400"
            >
              <Mail size={17} className="shrink-0 text-volt-400" />
              {CONTACT.email}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-volt-400 px-4 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-volt-500"
            >
              Nous contacter
            </Link>

            <Link
              to="/panier"
              className="rounded-lg border border-steel-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-volt-400 hover:text-volt-400"
            >
              Votre panier
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-steel-700/30 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-steel-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} INDUSTRIA. Tous droits réservés.
          </p>

          <p>
            Démonstration : produits, prix, stocks et commandes fictifs.
          </p>
        </div>
      </div>
    </footer>
  )
}
