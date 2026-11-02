import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  Wallet,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { getDashboard } from "../../services/dashboardService";

const money = (value) =>
  `${Number(value || 0).toLocaleString("fr-FR")} MAD`;

const statusStyles = {
  pending: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  processing: {
    label: "En préparation",
    className: "bg-blue-50 text-blue-700",
    icon: RefreshCw,
  },
  shipped: {
    label: "Expédiée",
    className: "bg-violet-50 text-violet-700",
    icon: Truck,
  },
  delivered: {
    label: "Livrée",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Annulée",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
};

function getStatus(status) {
  return (
    statusStyles[String(status || "").toLowerCase()] || {
      label: status || "Non défini",
      className: "bg-slate-100 text-slate-600",
      icon: Clock3,
    }
  );
}

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message || "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 p-5 sm:p-8">
        <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-5 rounded-xl border border-red-200 bg-white p-5 text-sm text-red-700 sm:m-8">
        <div className="flex items-center gap-2 font-semibold">
          <XCircle size={19} />
          Impossible de charger le tableau de bord
        </div>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Clients",
      value: data?.total_users ?? 0,
      detail: "Comptes enregistrés",
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Produits",
      value: data?.total_products ?? 0,
      detail: "Références au catalogue",
      icon: Package,
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Commandes",
      value: data?.total_orders ?? 0,
      detail: "Commandes enregistrées",
      icon: ShoppingCart,
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Chiffre d'affaires",
      value: money(data?.total_revenue),
      detail: "Total communiqué par l'API",
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  const recentOrders = data?.recent_orders || [];

  return (
    <div className="min-h-screen bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#0A2540]">
              Indicateurs clés
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Résumé de votre activité
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.color}`}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                  </div>

                  <p className="mt-4 break-words text-2xl font-bold text-[#0A2540]">
                    {stat.value}
                  </p>
                  <p className="mt-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    {stat.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#0A2540]">
                Commandes récentes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Dernières commandes reçues
              </p>
            </div>

            <span className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800">
              {recentOrders.length} commande(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Commande</th>
                  <th className="px-5 py-4 font-semibold">Client</th>
                  <th className="px-5 py-4 font-semibold">Montant</th>
                  <th className="px-5 py-4 font-semibold">Statut</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const status = getStatus(order.status);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={order.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-[#0A2540]">
                        #{order.id}
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {order.user?.name || "Client"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                        {money(order.total)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {!recentOrders.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      <ShoppingCart
                        size={26}
                        className="mx-auto mb-3 text-slate-400"
                      />
                      Aucune commande récente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}