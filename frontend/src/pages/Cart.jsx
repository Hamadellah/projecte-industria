
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const formatPrice = (amount) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState({
    recipient_name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const loadCart = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/cart");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(err.message || "Impossible de charger le panier.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        return sum + price * quantity;
      }, 0),
    [items]
  );

  // Le total contient uniquement le prix des produits.
  // Aucune TVA ni aucun frais de livraison ne sont ajoutés.
  const total = subtotal;

  const changeQuantity = async (item, newQuantity) => {
    if (newQuantity < 1 || busyId !== null) return;

    setBusyId(item.id);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/cart/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: newQuantity }),
      });

      await loadCart();
    } catch (err) {
      setError(err.message || "Impossible de modifier la quantité.");
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (item) => {
    setBusyId(item.id);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/cart/${item.id}`, {
        method: "DELETE",
      });

      setItems((current) => current.filter((product) => product.id !== item.id));
      setSuccess("Produit supprimé du panier.");
    } catch (err) {
      setError(err.message || "Impossible de supprimer ce produit.");
    } finally {
      setBusyId(null);
    }
  };

  const clearCart = async () => {
    if (!items.length || clearing) return;

    setClearing(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest("/cart/clear", {
        method: "DELETE",
      });

      setItems([]);
      setSuccess("Votre panier a été vidé.");
    } catch (err) {
      setError(err.message || "Impossible de vider le panier.");
    } finally {
      setClearing(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!items.length) {
      setError("Votre panier est vide.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setOrderNumber(data.order?.order_number || "");
      setItems([]);
      setShowCheckout(false);
      setSuccess(data.message || "Votre commande a été créée avec succès.");
    } catch (err) {
      setError(err.message || "Impossible de confirmer votre commande.");
      await loadCart();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-abyss flex items-center justify-center text-steel-300">
        <LoaderCircle className="animate-spin mr-3" size={24} />
        Chargement du panier...
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[65vh] bg-abyss text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center border border-steel-700 bg-navy-950 p-8 rounded-xl">
          <ShoppingBag size={44} className="mx-auto mb-5 text-volt-400" />
          <h1 className="text-2xl font-bold mb-3">Votre panier</h1>
          <p className="text-steel-300 mb-6">
            Connectez-vous pour consulter votre panier et passer une commande.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-volt-400 text-navy-950 font-bold px-6 py-3 rounded-md hover:bg-volt-500 transition"
          >
            Se connecter <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-abyss text-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-steel-300 hover:text-volt-400 transition mb-5"
          >
            <ArrowLeft size={17} />
            Continuer mes achats
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-volt-400 text-xs uppercase tracking-[0.25em] mb-2">
                INDUSTRIA / COMMANDE
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Mon panier
              </h1>
              <p className="text-steel-400 mt-2">
                {totalQuantity} article{totalQuantity !== 1 ? "s" : ""} dans votre panier
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                disabled={clearing || busyId !== null}
                className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                {clearing ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}
                Vider le panier
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <X size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
            <div>
              <p>{success}</p>
              {orderNumber && (
                <p className="mt-1 text-sm">
                  Numéro de commande : <strong>{orderNumber}</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="border border-steel-700 bg-navy-950 rounded-xl px-6 py-16 text-center">
            <ShoppingBag size={52} className="mx-auto mb-5 text-steel-500" />
            <h2 className="text-2xl font-bold mb-3">Votre panier est vide</h2>
            <p className="text-steel-400 mb-7">
              Découvrez nos équipements et ajoutez les produits dont vous avez besoin.
            </p>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-volt-400 text-navy-950 font-bold px-6 py-3 rounded-md hover:bg-volt-500 transition"
            >
              Découvrir les produits <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <section className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const productName = item.name || item.product?.name || "Produit";
                const productReference =
                  item.reference || item.product?.reference || "";
                const price = Number(item.price || item.product?.price || 0);
                const quantity = Number(item.quantity || 1);
                const isBusy = busyId === item.id;

                return (
                  <article
                    key={item.id}
                    className="border border-steel-700 bg-navy-950 rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="w-full sm:w-28 h-28 rounded-lg bg-abyss border border-steel-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image || item.product?.image ? (
                          <img
                            src={item.image || item.product?.image}
                            alt={productName}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Package size={42} className="text-steel-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h2 className="font-bold text-lg">{productName}</h2>
                            {productReference && (
                              <p className="text-sm text-steel-400 mt-1">
                                Référence : {productReference}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            disabled={isBusy || clearing}
                            aria-label={`Supprimer ${productName}`}
                            className="p-2 text-steel-400 hover:text-red-400 transition disabled:opacity-50"
                          >
                            {isBusy ? (
                              <LoaderCircle size={19} className="animate-spin" />
                            ) : (
                              <Trash2 size={19} />
                            )}
                          </button>
                        </div>

                        <p className="text-volt-400 font-bold text-lg mt-3">
                          {formatPrice(price)}
                          <span className="text-steel-400 text-sm font-normal">
                            {" "} / unité
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                          <div className="inline-flex items-center border border-steel-700 rounded-md overflow-hidden">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item, quantity - 1)}
                              disabled={quantity <= 1 || isBusy || busyId !== null}
                              aria-label="Diminuer la quantité"
                              className="p-2.5 hover:bg-steel-700 disabled:opacity-40"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="min-w-12 text-center font-semibold">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => changeQuantity(item, quantity + 1)}
                              disabled={isBusy || busyId !== null}
                              aria-label="Augmenter la quantité"
                              className="p-2.5 hover:bg-steel-700 disabled:opacity-40"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-steel-400 mb-1">
                              Sous-total
                            </p>
                            <p className="font-bold text-lg">
                              {formatPrice(price * quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="border border-steel-700 bg-navy-950 rounded-xl p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4 text-steel-300">
                  <span>Nombre d'articles</span>
                  <span>{totalQuantity}</span>
                </div>

                <div className="flex justify-between gap-4 text-steel-300">
                  <span>Sous-total des produits</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between gap-4 text-steel-300">
                  <span>Livraison</span>
                  <span className="text-right">À confirmer</span>
                </div>

                <div className="border-t border-steel-700 pt-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-bold text-base">Total des produits</span>
                    <span className="font-bold text-xl text-volt-400 text-right">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-xs text-steel-400 mt-2">
                    Les frais de livraison seront confirmés séparément.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCheckout((current) => !current)}
                className="w-full mt-6 inline-flex justify-center items-center gap-2 bg-volt-400 text-navy-950 font-bold px-5 py-3.5 rounded-md hover:bg-volt-500 transition"
              >
                {showCheckout ? "Masquer le formulaire" : "Passer la commande"}
                <ArrowRight size={18} />
              </button>

              <p className="text-xs text-steel-500 text-center mt-4">
                Votre commande sera vérifiée avant sa confirmation.
              </p>
            </aside>
          </div>
        )}

        {showCheckout && items.length > 0 && (
          <section className="mt-8 max-w-3xl border border-steel-700 bg-navy-950 rounded-xl p-5 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-volt-400 mb-2">
              Informations de livraison
            </p>
            <h2 className="text-2xl font-bold mb-6">
              Confirmer votre commande
            </h2>

            <form onSubmit={submitOrder} className="space-y-5">
              <div>
                <label
                  htmlFor="recipient_name"
                  className="block text-sm text-steel-300 mb-2"
                >
                  Nom complet *
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-500"
                  />
                  <input
                    id="recipient_name"
                    name="recipient_name"
                    value={form.recipient_name}
                    onChange={handleFormChange}
                    required
                    maxLength={100}
                    autoComplete="name"
                    className="w-full bg-abyss border border-steel-700 rounded-md py-3 pl-10 pr-3 text-white outline-none focus:border-volt-400"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm text-steel-300 mb-2"
                >
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-500"
                  />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    maxLength={20}
                    autoComplete="tel"
                    className="w-full bg-abyss border border-steel-700 rounded-md py-3 pl-10 pr-3 text-white outline-none focus:border-volt-400"
                    placeholder="+212 6..."
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm text-steel-300 mb-2"
                >
                  Ville *
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-500"
                  />
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    required
                    maxLength={100}
                    autoComplete="address-level2"
                    className="w-full bg-abyss border border-steel-700 rounded-md py-3 pl-10 pr-3 text-white outline-none focus:border-volt-400"
                    placeholder="Votre ville"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm text-steel-300 mb-2"
                >
                  Adresse complète *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  required
                  maxLength={255}
                  rows={3}
                  autoComplete="street-address"
                  className="w-full bg-abyss border border-steel-700 rounded-md p-3 text-white outline-none focus:border-volt-400 resize-y"
                  placeholder="Rue, quartier, numéro..."
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm text-steel-300 mb-2"
                >
                  Notes complémentaires (facultatif)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full bg-abyss border border-steel-700 rounded-md p-3 text-white outline-none focus:border-volt-400 resize-y"
                  placeholder="Informations utiles pour la livraison..."
                />
              </div>

              <div className="border-t border-steel-700 pt-5">
                <div className="flex justify-between items-center gap-4 mb-5">
                  <span className="text-steel-300">Total des produits</span>
                  <span className="font-bold text-xl text-volt-400">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !items.length}
                  className="w-full flex items-center justify-center gap-2 bg-volt-400 text-navy-950 font-bold px-5 py-3.5 rounded-md hover:bg-volt-500 transition disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Confirmation en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={19} />
                      Confirmer la commande
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
