import { useState } from "react";
import {
  Search,
  UserRound,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

export default function Header({ cartCount = 0, onCartClick }) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      alert(`Recherche : ${search}`);
    }
  }

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-4 py-4">
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <a href="#accueil" className="shrink-0">
          <span className="block text-xl font-black tracking-widest text-[#03045E]">
            INDUSTRIA
          </span>
          <span className="text-[10px] text-slate-500">
            Équipements & fournitures
          </span>
        </a>

        <form
          onSubmit={handleSearch}
          className="mx-auto hidden w-full max-w-xl md:block"
        >
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1.5">
            <Search className="ml-2 text-slate-400" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pompes, tuyaux, outillage..."
              className="w-full bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button className="rounded-lg bg-[#0077B6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#023E8A]">
              Rechercher
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3">
          <button className="hidden items-center gap-2 text-sm text-slate-600 lg:flex">
            <UserRound size={21} />
            Mon compte
          </button>

          <button
            onClick={onCartClick}
            className="relative rounded-xl border border-slate-200 p-3 text-[#03045E] hover:bg-sky-50"
            aria-label="Ouvrir le panier"
          >
            <ShoppingCart size={21} />
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#00B4D8] px-1 text-xs font-bold text-[#03045E]">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="px-4 pb-3 md:hidden">
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-transparent px-2 py-3 text-sm outline-none"
          />
        </div>
      </form>

      {menuOpen && (
        <div className="border-t px-4 py-2 md:hidden">
          {[
            "Toutes les catégories",
            "Forage & puits",
            "Pompes",
            "Tuyaux & raccords",
            "Outillage",
            "Protection",
            "Promotions",
          ].map((item) => (
            <a
              key={item}
              href="#categories"
              onClick={() => setMenuOpen(false)}
              className="block border-b border-slate-100 py-3 text-sm text-slate-700 last:border-0"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
