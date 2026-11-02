import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Categories from "./pages/Categories";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MonCompte from "./pages/MonCompte";
import NotFound from "./pages/NotFound";

// Admin : routes conservées
import AdminLayout from "./Admin/AdminLayout";
import Overview from "./Admin/pages/Overview";
import Products from "./Admin/pages/Products";
import Orders from "./Admin/pages/Orders";
import Inventory from "./Admin/pages/Inventory";
import Clients from "./Admin/pages/Clients";
import AdminCategories from "./Admin/pages/Categories";

function StoreLayout() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-3"
      >
        Aller au contenu
      </a>

      <Header />

      <div id="contenu">
        <Routes>
          {/* Accueil */}
          <Route path="/" element={<Home />} />

          {/* Catalogue et produits */}
          <Route path="/catalogue" element={<Catalog />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/produit/:id" element={<Product />} />

          {/* Panier et contact */}
          <Route path="/panier" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />

          {/* Espace client */}
          <Route path="/mon-compte" element={<MonCompte />} />

          {/* Page inconnue */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Administration : inchangée */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="clients" element={<Clients />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
        </Route>

        {/* Partie Client */}
        <Route path="/*" element={<StoreLayout />} />
      </Routes>
    </ErrorBoundary>
  );
}