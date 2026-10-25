
import { LayoutDashboard, Package, ShoppingCart, Warehouse, Users, Drill } from 'lucide-react'
const menuItems = [
  { id: 'overview', label: 'Vue générale', icon: LayoutDashboard },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  { id: 'inventory', label: 'Gestion de stock', icon: Warehouse },
  { id: 'clients', label: 'Clients', icon: Users },
]

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0A2540] text-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B] text-[#0A2540]">
            <Drill size={23} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">FORAGE PRO</h1>
            <p className="text-xs text-slate-400">Administration</p>
          </div>
        </div>

        <div className="px-5 pt-7 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Menu principal
        </div>

        <nav className="flex-1 space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = activePage === item.id

            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose() }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active ? 'bg-[#F59E0B] text-[#0A2540] shadow-lg shadow-black/10' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="m-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold">Espace administrateur</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Gérez vos produits, commandes et clients depuis un seul espace.</p>
        </div>
      </aside>
    </>
  )
}
