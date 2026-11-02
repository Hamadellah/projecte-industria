import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  Tags,
  Drill,
} from "lucide-react";

const menuItems = [
  { id: "overview", label: "Vue générale", icon: LayoutDashboard },
  { id: "products", label: "Produits", icon: Package },
  { id: "categories", label: "Catégories", icon: Tags },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
  { id: "inventory", label: "Gestion de stock", icon: Warehouse },
  { id: "clients", label: "Clients", icon: Users },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0A2540] text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-[#0A2540]">
            <Drill size={22} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-[15px] font-bold tracking-[0.12em]">
              FORAGE PRO
            </h1>
            <p className="mt-1 text-[11px] tracking-wide text-slate-400">
              INDUSTRIAL MANAGEMENT
            </p>
          </div>
        </div>

        <div className="px-5 pb-3 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Espace de travail
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-[13px] transition-colors duration-200 ${
                  active
                    ? "bg-white/10 font-semibold text-white"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-amber-500" />
                )}

                <Icon
                  size={18}
                  strokeWidth={active ? 2 : 1.7}
                  className={
                    active
                      ? "text-amber-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  }
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="m-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-medium text-slate-200">
              Système opérationnel
            </p>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-400">
            Gestion centralisée des produits, commandes et stocks.
          </p>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[10px] tracking-wide text-slate-500">
            FORAGE PRO · ADMIN
          </p>
        </div>
      </aside>
    </>
  );
}