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
} from "lucide-react";
import { apiRequest } from "../services/api";

export default function MonCompte() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

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
      .catch(() => {
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

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center !bg-abyss px-4">
        <p className="!text-steel-300">Chargement de votre compte...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden !bg-abyss px-4 pb-16 pt-28 sm:px-6 md:pt-32">
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full border-[35px] border-volt-500/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border-[30px] border-steel-500/5" />

      <div className="relative mx-auto max-w-6xl">
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
                  <p className="text-sm !text-steel-500">Nom complet</p>
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
                  <p className="text-sm !text-steel-500">Adresse e-mail</p>
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
                  <p className="text-sm !text-steel-500">Téléphone</p>
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
                <div className="border border-steel-700/50 !bg-navy-950 px-5 py-10 text-center">
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
                    La route API de consultation des commandes client doit
                    être disponible côté backend pour afficher cet historique.
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
                <div className="space-y-3">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-4 border border-steel-700/50 !bg-navy-950 p-4"
                    >
                      <div>
                        <p className="font-bold !text-white">
                          Commande #{order.id}
                        </p>

                        <p className="mt-1 text-sm !text-steel-400">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "fr-FR"
                              )
                            : "Date indisponible"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold !text-white">
                          {Number(order.total ?? 0).toLocaleString("fr-FR")} MAD
                        </p>

                        <span className="mt-1 inline-block border border-volt-500/30 !bg-volt-500/10 px-3 py-1 text-xs font-semibold !text-volt-400">
                          {order.status || "En attente"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
