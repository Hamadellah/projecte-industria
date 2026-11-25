import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  ShoppingCart,
  UserRound,
  LogIn,
} from 'lucide-react'
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
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })

  const { count } = useCart()
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user') || 'null'))
      } catch {
        setUser(null)
      }
    }

    window.addEventListener('storage', syncUser)
    window.addEventListener('focus', syncUser)

    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('focus', syncUser)
    }
  }, [])

  const linkCls = ({ isActive }) =>
    `whitespace-nowrap px-1 py-2 text-sm font-medium transition-colors lg:text-[0.95rem] ${
      isActive
        ? 'border-b-2 border-volt-500 text-white'
        : 'border-b-2 border-transparent text-steel-300 hover:text-white'
    }`

  const accountPath = user ? '/mon-compte' : '/login'
  const accountLabel = user ? 'Mon compte' : 'Connexion'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid
            ? 'border-b border-steel-700/30 bg-[#050b18]/95 backdrop-blur-md'
            : 'bg-gradient-to-b from-[#050b18]/85 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 md:h-20 md:px-8">
          <Link
            to="/"
            className="display shrink-0 text-2xl font-extrabold tracking-wide text-white sm:text-3xl"
            aria-label="INDUSTRIA, retour à l'accueil"
          >
            INDUSTR<span className="text-volt-500">I</span>A
          </Link>

          <nav
            className="hidden items-center gap-5 md:flex lg:gap-8"
            aria-label="Navigation principale"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkCls}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              to={accountPath}
              className="flex h-10 items-center justify-center gap-2 rounded-lg px-2 text-steel-100 transition hover:bg-white/5 hover:text-volt-400 sm:h-11"
              aria-label={accountLabel}
              title={accountLabel}
            >
              {user ? <UserRound size={20} /> : <LogIn size={20} />}
              <span className="hidden whitespace-nowrap text-sm font-medium lg:inline">
                {accountLabel}
              </span>
            </Link>

            <Link
              to="/panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-steel-100 transition hover:bg-white/5 hover:text-white sm:h-11 sm:w-11"
              aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}
            >
              <ShoppingCart size={21} aria-hidden="true" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-volt-500 px-1 text-xs font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-steel-100 transition hover:bg-white/5 hover:text-white sm:h-11 sm:w-11 md:hidden"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col bg-[#050b18] px-5 py-5 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation mobile"
        >
          {/* Top bar dakhel mobile menu bach ykoun bouton X bayn o sahla */}
          <div className="flex items-center justify-between border-b border-steel-700/40 pb-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="display text-2xl font-extrabold tracking-wide text-white"
            >
              INDUSTR<span className="text-volt-500">I</span>A
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-steel-700/60 bg-white/5 text-white hover:bg-white/10"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="mt-6 flex-1 overflow-y-auto" aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `display block border-b border-steel-700/30 py-3.5 text-2xl font-bold transition-colors ${
                        isActive ? 'text-volt-400' : 'text-white hover:text-volt-300'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              <li className="mt-4">
                <NavLink
                  to={accountPath}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl border border-steel-700/40 bg-white/5 px-4 py-3.5 text-base font-semibold transition-colors ${
                      isActive ? 'text-volt-400' : 'text-white hover:text-volt-300'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    {user ? <UserRound size={20} /> : <LogIn size={20} />}
                    {accountLabel}
                  </span>
                  <span className="text-xs text-steel-400">→</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}