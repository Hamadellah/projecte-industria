import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserRound,
  ShoppingCart,
  Menu,
  ChevronDown,
  Truck,
  Headset,
  CircleHelp,
  Tag,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const categories = [
    { name: "Forage & puits", href: "/forage" },
    { name: "Pompes", href: "/pompes" },
    { name: "Tuyaux & raccords", href: "/tuyaux" },
    { name: "Outillage", href: "/outillage" },
    { name: "Protection", href: "/protection" },
    { name: "Promotions", href: "/promotions" },
  ];

  return (
    <header className="relative z-50 w-full bg-white text-[#03045E] shadow-sm">
      {/* Top information bar */}
      <div className="hidden bg-[#03045E] text-white sm:block">
      <div className="w-full max-w-none flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-[#48CAE4]" />
            <span>Livraison partout au Maroc</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:+212522441890" className="flex items-center gap-2 hover:text-[#90E0EF]">
              <Headset size={14} />
              Service client : 05 22 44 18 90
            </a>
            <a href="/aide" className="flex items-center gap-2 hover:text-[#90E0EF]">
              <CircleHelp size={14} />
              Besoin d'aide ?
            </a>
            <span>Français | DH</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-slate-100">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-5 lg:px-8">
          {/* Mobile menu */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 md:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center" aria-label="INDUSTRIA - Accueil">
            <img
              src={logo}
              alt="INDUSTRIA"
              className="h-9 w-auto max-w-[145px] object-contain sm:h-11 sm:max-w-[180px]"
            />
          </Link>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                window.location.href = `/recherche?q=${encodeURIComponent(search.trim())}`;
              }
            }}
            className="mx-auto flex h-10 min-w-0 flex-1 overflow-hidden rounded-md border border-slate-200 bg-[#F5FAFD] focus-within:border-[#0077B6] focus-within:ring-2 focus-within:ring-[#48CAE4]/30 sm:h-11"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit, une référence..."
              aria-label="Rechercher un produit"
              className="min-w-0 flex-1 bg-transparent px-3 text-xs text-[#03045E] outline-none placeholder:text-slate-400 sm:px-4 sm:text-sm"
            />
            <button
              type="submit"
              aria-label="Rechercher"
              className="flex w-10 shrink-0 items-center justify-center bg-[#0077B6] text-white transition hover:bg-[#023E8A] sm:w-12"
            >
              <Search size={19} />
            </button>
          </form>

          {/* Account */}
          <Link
            to="/compte"
            className="hidden shrink-0 items-center gap-2 lg:flex"
          >
            <UserRound size={23} strokeWidth={1.6} />
            <div className="leading-5">
              <p className="text-[10px] text-slate-500">Bonjour, connectez-vous</p>
              <p className="text-xs font-semibold">Mon compte</p>
            </div>
          </Link>

          {/* Cart */}
          <Link
            to="/panier"
            className="relative flex shrink-0 items-center gap-1.5 rounded-lg p-1.5 transition hover:bg-[#CAF0F8]/40 sm:gap-2 sm:px-2"
          >
            <span className="relative">
              <ShoppingCart size={23} strokeWidth={1.7} />
              <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#00B4D8] px-1 text-[10px] font-bold text-white">
                0
              </span>
            </span>
            <div className="hidden leading-5 sm:block">
              <p className="text-[10px] text-slate-500">Votre panier</p>
              <p className="whitespace-nowrap text-xs font-bold">0,00 DH</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden border-b border-slate-200 bg-white md:block">
        <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-5 lg:gap-2 lg:px-8">
          {/* Categories dropdown */}
          <div className="relative py-2">
            <button
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 items-center gap-2 rounded-md bg-[#0077B6] px-3 text-xs font-semibold text-white transition hover:bg-[#023E8A] lg:px-4"
            >
              <Menu size={16} />
              Toutes les catégories
              <ChevronDown
                size={14}
                className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-60 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm transition hover:bg-[#CAF0F8]/50 hover:text-[#0077B6]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-between">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="whitespace-nowrap px-2 py-4 text-[11px] font-medium text-[#03045E] transition hover:text-[#0077B6] lg:px-3 lg:text-xs"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white p-3 shadow-lg md:hidden">
          <Link
            to="/compte"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            <UserRound size={18} />
            Mon compte
          </Link>

          <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Nos catégories
          </p>

          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm transition hover:bg-[#CAF0F8]/50 hover:text-[#0077B6]"
            >
              {category.name}
            </Link>
          ))}

          <div className="mt-3 border-t border-slate-100 px-3 pt-3 text-xs text-slate-500">
            <p className="flex items-center gap-2">
              <Truck size={15} />
              Livraison partout au Maroc
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Headset size={15} />
              Service client : 05 22 44 18 90
            </p>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;