import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/categories', label: 'Catégories' },
  { to: '/contact', label: 'Devis et contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { count } = useCart()
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const linkCls = ({ isActive }) =>
    `px-1 py-2 text-[0.95rem] font-medium transition-colors ${isActive ? 'text-white border-b-2 border-volt-500' : 'text-steel-300 hover:text-white border-b-2 border-transparent'}`

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? 'bg-abyss/90 backdrop-blur-md border-b border-steel-700/30' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link to="/" className="display text-3xl font-extrabold tracking-wide text-white" aria-label="INDUSTRIA, retour à l’accueil">
          INDUSTR<span className="text-volt-500">I</span>A
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/panier" className="relative flex h-11 w-11 items-center justify-center text-steel-100 hover:text-white" aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}>
            <ShoppingCart size={22} aria-hidden="true" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-volt-500 px-1 text-xs font-semibold text-white">{count}</span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-steel-100 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-abyss px-6 py-8 md:hidden" aria-label="Navigation mobile">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => `display block border-b border-steel-700/30 py-4 text-4xl font-bold ${isActive ? 'text-volt-400' : 'text-white'}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
