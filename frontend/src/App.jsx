
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
import NotFound from "./pages/NotFound";

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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-volt-500 focus:px-4 focus:py-2 focus:text-white"
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
        <Route path="/login" element={<Login />} />

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

        <Route path="/*" element={<StoreLayout />} />
      </Routes>
    </ErrorBoundary>
  );
}
