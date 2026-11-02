import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const pageInfo = {
  "/admin": { id: "overview", title: "Vue générale" },
  "/admin/products": { id: "products", title: "Produits" },
  "/admin/categories": { id: "categories", title: "Catégories" },
  "/admin/orders": { id: "orders", title: "Commandes" },
  "/admin/inventory": { id: "inventory", title: "Gestion de stock" },
  "/admin/clients": { id: "clients", title: "Clients" },
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPage = pageInfo[location.pathname] || pageInfo["/admin"];

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  function handleNavigate(page) {
    const paths = {
      overview: "/admin",
      products: "/admin/products",
      categories: "/admin/categories",
      orders: "/admin/orders",
      inventory: "/admin/inventory",
      clients: "/admin/clients",
    };

    if (paths[page]) {
      navigate(paths[page]);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <Sidebar
        activePage={currentPage.id}
        onNavigate={handleNavigate}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          title={currentPage.title}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={() => setIsOpen(true)}
        />

        <div className="flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <p className="truncate text-xs text-slate-500">
            Espace d'administration
          </p>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-40 truncate text-sm font-medium text-slate-700 sm:block">
              {user?.name || "Administrateur"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:text-sm"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>

        <main>
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}