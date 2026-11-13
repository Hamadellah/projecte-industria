
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Package,
  LogOut,
  ShoppingBag,
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  CalendarDays,
  LoaderCircle,
  X,
  CheckCircle2,
  Clock,
  Truck,
  Check,
} from "lucide-react";
import { apiRequest } from "../services/api";

const formatPrice = (amount) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "Date indisponible";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getStatus = (status) => {
  const statuses = {
    pending: {
      label: "En attente",
      icon: Clock,
    },
    processing: {
      label: "En préparation",
      icon: Package,
    },
    shipped: {
      label: "Expédiée",
      icon: Truck,
    },
    delivered: {
      label: "Livrée",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Annulée",
      icon: X,
    },
  };

  return statuses[status] || {
    label: status || "En attente",
    icon: Clock,
  };
};

export default function MonCompte() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  // Gestion des détails d'une commande
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      return;
    }

    apiRequest("/orders")
      .then((data) => {
        const result = Array.isArray(data)
          ? data
          : data.data ?? data.orders ?? [];

        setOrders(Array.isArray(result) ? result : []);
      })
      .catch((error) => {
        console.error(error);

        setOrdersError(
          "L'historique des commandes n'est pas encore disponible."
        );
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  // Afficher ou masquer les détails d'une commande
  async function handleShowOrder(orderId) {
    // Si la commande est déjà ouverte, on la ferme
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setSelectedOrder(null);
      setDetailsError("");
      return;
    }

    setSelectedOrderId(orderId);
    setSelectedOrder(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const data = await apiRequest(`/orders/${orderId}`);

      setSelectedOrder(data.order || data);
    } catch (error) {
      console.error(error);

      setDetailsError(
        error.message || "Impossible de charger les détails de cette commande."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center !bg-abyss px-4">
        <p className="!text-steel-300">
          Chargement de votre compte...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden !bg-abyss px-4 pb-16 pt-28 sm:px-6 md:pt-32">
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full border-[35px] border-volt-500/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border-[30px] border-steel-500/5" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <section className="relative mb-8 overflow-hidden border border-steel-700/50 !bg-navy-900 p-6 shadow-xl sm:p-10">
          <div className="blueprint pointer-events-none absolute inset-0 opacity-30" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] !text-volt-400">
                INDUSTRIA · Espace client
              </p>

              <h1 className="display text-3xl font-bold !text-white sm:text-4xl">
                Bonjour, {user.name}
              </h1>

              <p className="mt-3 max-w-xl leading-7 !text-steel-300">
                Retrouvez vos informations et suivez vos commandes depuis
                votre espace personnel.
              </p>

              <div className="mt-6 h-1 w-20 !bg-volt-500" />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start border border-steel-600 !bg-navy-950 px-5 py-3 font-semibold !text-white transition hover:border-volt-500 hover:!text-volt-400 sm:self-center"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informations client */}
          <section className="border border-steel-700/50 !bg-navy-900 p-6 shadow-lg lg:col-span-1">
            <div className="mb-5 flex h-14 w-14 items-center justify-center border border-volt-500/30 !bg-volt-500/10 !text-volt-400">
              <UserRound size={27} />
            </div>

            <h2 className="display text-2xl font-bold !text-white">
              Mes informations
            </h2>

            <p className="mt-2 text-sm !text-steel-400">
              Les informations associées à votre compte.
            </p>

            <div className="mt-7 space-y-5">
              <div className="flex items-start gap-3">
                <UserRound
                  className="mt-1 shrink-0 !text-volt-400"
                  size={19}
                />

                <div className="min-w-0">
                  <p className="text-sm !text-steel-500">
                    Nom complet
                  </p>

                  <p className="break-words font-semibold !text-white">
                    {user.name || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  className="mt-1 shrink-0 !text-volt-400"
                  size={19}
                />

                <div className="min-w-0">
                  <p className="text-sm !text-steel-500">
                    Adresse e-mail
                  </p>

                  <p className="break-all font-semibold !text-white">
                    {user.email || "Non renseignée"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  className="mt-1 shrink-0 !text-volt-400"
                  size={19}
                />

                <div className="min-w-0">
                  <p className="text-sm !text-steel-500">
                    Téléphone
                  </p>

                  <p className="font-semibold !text-white">
                    {user.phone || "Non renseigné"}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/catalogue"
              className="mt-8 flex w-full items-center justify-center gap-2 !bg-volt-500 px-4 py-3 font-bold !text-navy-950 transition hover:!bg-volt-400"
            >
              Explorer le catalogue
              <ArrowRight size={18} />
            </Link>
          </section>

          {/* Commandes */}
          <section className="border border-steel-700/50 !bg-navy-900 p-6 shadow-lg sm:p-8 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border border-volt-500/30 !bg-volt-500/10 !text-volt-400">
                <Package size={25} />
              </div>

              <div>
                <h2 className="display text-2xl font-bold !text-white">
                  Mes commandes
                </h2>

                <p className="mt-1 text-sm !text-steel-400">
                  Consultez l'historique de vos achats.
                </p>
              </div>
            </div>

            <div className="mt-7">
              {loading ? (
                <div className="flex items-center justify-center gap-3 border border-steel-700/50 !bg-navy-950 px-5 py-10">
                  <LoaderCircle
                    size={20}
                    className="animate-spin !text-volt-400"
                  />

                  <p className="!text-steel-300">
                    Chargement des commandes...
                  </p>
                </div>
              ) : ordersError ? (
                <div className="border border-volt-500/30 !bg-volt-500/5 p-5">
                  <p className="font-semibold !text-volt-400">
                    {ordersError}
                  </p>

                  <p className="mt-2 text-sm leading-6 !text-steel-300">
                    Vérifiez que la route API de consultation des commandes
                    est disponible.
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="border border-steel-700/50 !bg-navy-950 px-5 py-12 text-center">
                  <ShoppingBag
                    size={40}
                    className="mx-auto mb-4 !text-steel-600"
                  />

                  <h3 className="font-semibold !text-white">
                    Aucune commande pour le moment
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 !text-steel-400">
                    Vos commandes apparaîtront ici lorsque vous aurez effectué
                    un achat.
                  </p>

                  <Link
                    to="/catalogue"
                    className="mt-5 inline-flex items-center gap-2 !bg-volt-500 px-5 py-3 font-bold !text-navy-950 transition hover:!bg-volt-400"
                  >
                    Découvrir les produits
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isSelected = selectedOrderId === order.id;
                    const status = getStatus(order.status);
                    const StatusIcon = status.icon;

                    return (
                      <article
                        key={order.id}
                        className="overflow-hidden border border-steel-700/50 !bg-navy-950"
                      >
                        {/* Résumé de la commande */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
                          <div className="min-w-0">
                            <p className="font-bold !text-white">
                              Commande #{order.order_number || order.id}
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-sm !text-steel-400">
                              <CalendarDays size={15} />
                              {formatDate(order.created_at)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold !text-white">
                              {formatPrice(order.total)}
                            </p>

                            <span className="mt-2 inline-flex items-center gap-1.5 border border-volt-500/30 !bg-volt-500/10 px-3 py-1 text-xs font-semibold !text-volt-400">
                              <StatusIcon size={13} />
                              {status.label}
                            </span>
                          </div>

                          <div className="w-full border-t border-steel-700/50 pt-4">
                            <button
                              type="button"
                              onClick={() => handleShowOrder(order.id)}
                              disabled={detailsLoading && isSelected}
                              className="inline-flex items-center gap-2 text-sm font-semibold !text-volt-400 transition hover:!text-volt-300 disabled:opacity-50"
                            >
                              {isSelected ? (
                                <>
                                  <EyeOff size={17} />
                                  Masquer les détails
                                </>
                              ) : (
                                <>
                                  <Eye size={17} />
                                  Voir les détails
                                </>
                              )}

                              {detailsLoading && isSelected && (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Détails de la commande */}
                        {isSelected && (
                          <div className="border-t border-steel-700/50 p-4 sm:p-5">
                            {detailsLoading ? (
                              <div className="flex items-center justify-center gap-3 py-8">
                                <LoaderCircle
                                  size={22}
                                  className="animate-spin !text-volt-400"
                                />

                                <p className="!text-steel-300">
                                  Chargement des détails...
                                </p>
                              </div>
                            ) : detailsError ? (
                              <div className="border border-red-500/30 bg-red-500/10 p-4">
                                <p className="text-sm !text-red-400">
                                  {detailsError}
                                </p>

                                <button
                                  type="button"
                                  onClick={() => handleShowOrder(order.id)}
                                  className="mt-3 text-sm font-semibold !text-volt-400 hover:underline"
                                >
                                  Réessayer
                                </button>
                              </div>
                            ) : selectedOrder ? (
                              <div className="space-y-6">
                                {/* Informations de livraison */}
                                <div>
                                  <h3 className="mb-4 flex items-center gap-2 font-bold !text-white">
                                    <MapPin
                                      size={19}
                                      className="!text-volt-400"
                                    />
                                    Informations de livraison
                                  </h3>

                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                      <p className="text-xs !text-steel-500">
                                        Destinataire
                                      </p>

                                      <p className="mt-1 font-medium !text-white">
                                        {selectedOrder.recipient_name || "Non renseigné"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs !text-steel-500">
                                        Téléphone
                                      </p>

                                      <p className="mt-1 font-medium !text-white">
                                        {selectedOrder.phone || "Non renseigné"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs !text-steel-500">
                                        Ville
                                      </p>

                                      <p className="mt-1 font-medium !text-white">
                                        {selectedOrder.city || "Non renseignée"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs !text-steel-500">
                                        Adresse
                                      </p>

                                      <p className="mt-1 break-words font-medium !text-white">
                                        {selectedOrder.address || "Non renseignée"}
                                      </p>
                                    </div>
                                  </div>

                                  {selectedOrder.notes && (
                                    <div className="mt-4">
                                      <p className="text-xs !text-steel-500">
                                        Notes
                                      </p>

                                      <p className="mt-1 text-sm !text-steel-300">
                                        {selectedOrder.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Produits commandés */}
                                <div>
                                  <h3 className="mb-4 flex items-center gap-2 font-bold !text-white">
                                    <ShoppingBag
                                      size={19}
                                      className="!text-volt-400"
                                    />
                                    Produits commandés
                                  </h3>

                                  {selectedOrder.order_items?.length > 0 ||
                                  selectedOrder.orderItems?.length > 0 ? (
                                    <div className="space-y-3">
                                      {(selectedOrder.order_items ||
                                        selectedOrder.orderItems).map((item) => {
                                        const productName =
                                          item.product_name ||
                                          item.product?.name ||
                                          "Produit";

                                        const unitPrice = Number(
                                          item.unit_price ?? item.price ?? 0
                                        );

                                        const quantity = Number(
                                          item.quantity || 0
                                        );

                                        return (
                                          <div
                                            key={item.id}
                                            className="flex flex-wrap items-center justify-between gap-3 border border-steel-700/50 bg-abyss p-3 sm:p-4"
                                          >
                                            <div className="min-w-0">
                                              <p className="font-semibold !text-white">
                                                {productName}
                                              </p>

                                              {item.product_reference && (
                                                <p className="mt-1 text-xs !text-steel-500">
                                                  Référence : {item.product_reference}
                                                </p>
                                              )}

                                              <p className="mt-1 text-xs !text-steel-400">
                                                {formatPrice(unitPrice)} × {quantity}
                                              </p>
                                            </div>

                                            <p className="font-bold !text-volt-400">
                                              {formatPrice(
                                                unitPrice * quantity
                                              )}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className="border border-steel-700/50 bg-abyss p-4 text-sm !text-steel-400">
                                      Aucun produit trouvé dans cette commande.
                                    </p>
                                  )}
                                </div>

                                {/* Total */}
                                <div className="border-t border-steel-700 pt-4">
                                  <div className="space-y-3">
                                    <div className="flex justify-between gap-3 text-sm">
                                      <span className="!text-steel-400">
                                        Sous-total
                                      </span>

                                      <span className="!text-white">
                                        {formatPrice(selectedOrder.subtotal)}
                                      </span>
                                    </div>

                                    <div className="flex justify-between gap-3 text-sm">
                                      <span className="!text-steel-400">
                                        Livraison
                                      </span>

                                      <span className="!text-white">
                                        {formatPrice(selectedOrder.delivery_fee)}
                                      </span>
                                    </div>

                                    <div className="flex justify-between gap-3 border-t border-steel-700 pt-3">
                                      <span className="font-bold !text-white">
                                        Total de la commande
                                      </span>

                                      <span className="text-lg font-bold !text-volt-400">
                                        {formatPrice(selectedOrder.total)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
