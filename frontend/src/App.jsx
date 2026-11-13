
import { Route, Routes } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

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

import AdminLayout from "./Admin/AdminLayout";
import Overview from "./Admin/pages/Overview";
import Products from "./Admin/pages/Products";
import Orders from "./Admin/pages/Orders";
import Inventory from "./Admin/pages/Inventory";
import Clients from "./Admin/pages/Clients";
import AdminCategories from "./Admin/pages/Categories";
import Suppliers from "./Admin/pages/Suppliers";
import Invoices from "./Admin/pages/Invoices";
import Quotations from "./Admin/pages/Quotations";


// ========================================
// Store Layout
// ========================================

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
          <Route path="/" element={<Home />} />

          <Route path="/catalogue" element={<Catalog />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/produit/:id" element={<Product />} />

          <Route path="/panier" element={<Cart />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/mon-compte" element={<MonCompte />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}


// ========================================
// Main App
// ========================================

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Routes>

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<Overview />}
              />

              <Route
                path="products"
                element={<Products />}
              />

              <Route
                path="categories"
                element={<AdminCategories />}
              />

              <Route
                path="suppliers"
                element={<Suppliers />}
              />

              <Route
                path="orders"
                element={<Orders />}
              />

              <Route
                path="quotations"
                element={<Quotations />}
              />

              <Route
                path="invoices"
                element={<Invoices />}
              />

              <Route
                path="inventory"
                element={<Inventory />}
              />

              <Route
                path="clients"
                element={<Clients />}
              />
            </Route>
          </Route>


          {/* Public Store Routes */}
          <Route
            path="/*"
            element={<StoreLayout />}
          />

        </Routes>
      </CartProvider>
    </ErrorBoundary>
  );
}
