import { useEffect, useState } from "react";
import { ShoppingCart, RefreshCw } from "lucide-react";
import { getOrders, updateOrderStatus } from "../../services/orderService";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const labels = {
  pending: "En attente",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusClass = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function load() {
    setLoading(true);

    try {
      const result = await getOrders(1, filter);
      setOrders(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erreur de chargement des commandes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function changeStatus(id, status) {
    setSavingId(id);
    setError("");

    try {
      await updateOrderStatus(id, status);
      await load();
    } catch (err) {
      setError(err.message || "Impossible de modifier le statut");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="min-h-screen space-y-6 bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Activité commerciale
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#0A2540]">Commandes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Suivez les commandes et actualisez leur statut.
          </p>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-600">
          <ShoppingCart size={17} />
          <span>{orders.length} résultat(s)</span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <h2 className="font-semibold text-[#0A2540]">Liste des commandes</h2>
          <p className="mt-1 text-xs text-slate-500">
            Filtrez les commandes par statut.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500"
          >
            <option value="">Toutes les commandes</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {labels[status]}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={load}
            aria-label="Actualiser les commandes"
            className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-8 text-sm text-slate-500">
            Chargement des commandes...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">N° commande</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Statut</th>
                  <th className="px-5 py-4">Modifier</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-semibold text-[#0A2540]">
                      #{order.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {order.user?.name || "—"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.user?.email || ""}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                      {Number(order.total || 0).toLocaleString("fr-FR")} MAD
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                          statusClass[order.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {labels[order.status] || order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        disabled={savingId === order.id}
                        value={order.status}
                        onChange={(e) => changeStatus(order.id, e.target.value)}
                        className="max-w-44 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-amber-500 disabled:opacity-50"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {labels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}

                {!orders.length && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      Aucune commande trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Les commandes et leurs statuts sont chargés depuis le backend.
      </p>
    </section>
  );
}