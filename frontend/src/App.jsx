
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes } from "react-router-dom";
import { LayoutDashboard, Package, Boxes, ShoppingCart, Users, Tags } from "lucide-react";
import Overview from "./pages/Overview";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Clients from "./pages/Clients";

const links = [
  { to: "/", label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Produits", icon: Package },
  { to: "/categories", label: "Catégories", icon: Tags },
  { to: "/orders", label: "Commandes", icon: ShoppingCart },
  { to: "/inventory", label: "Stock", icon: Boxes },
  { to: "/clients", label: "Clients", icon: Users },
];

function Layout() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] md:flex">
      <aside className="w-full shrink-0 bg-[#0A2540] p-4 text-white md:min-h-screen md:w-64">
        <h1 className="mb-8 px-3 py-3 text-xl font-bold">Forage<span className="text-amber-400">Pro</span></h1>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${isActive ? "bg-amber-500 font-semibold text-[#0A2540]" : "text-slate-200 hover:bg-white/10"}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs text-slate-500">Administration</p>
            <h2 className="font-semibold text-[#0A2540]">Gestion de la boutique</h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-[#0A2540]">Admin</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="clients" element={<Clients />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
