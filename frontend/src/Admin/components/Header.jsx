
import { Search, Bell, Menu, ChevronDown } from 'lucide-react'

export default function Header({ title, searchQuery, setSearchQuery, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Ouvrir le menu">
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-[#0A2540] sm:text-xl">{title}</h2>
          <p className="hidden text-xs text-slate-500 sm:block">Espace de gestion Forage Pro</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#F59E0B] focus:ring-2 focus:ring-amber-100 lg:w-64" />
        </div>

        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50" aria-label="Notifications">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F59E0B] ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A2540] text-sm font-bold text-white">A</div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">Administrateur</p>
          </div>
          <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  )
}
