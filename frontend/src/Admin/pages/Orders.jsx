
import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../services/orderService";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const labels = { pending: "En attente", processing: "En préparation", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" };

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter]);

  async function changeStatus(id, status) {
    setSavingId(id);
    setError("");
    try {
      await updateOrderStatus(id, status);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <p className="p-6">Chargement des commandes...</p>;

  return (
    <section className="space-y-5 p-6">
      <div><h1 className="text-2xl font-bold text-[#0A2540]">Commandes</h1><p className="mt-1 text-sm text-slate-500">Suivi et mise à jour des commandes clients</p></div>
      {error && <p className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border bg-white p-2.5">
        <option value="">Toutes les commandes</option>
        {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
      </select>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">N°</th><th className="p-4">Client</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Statut</th><th className="p-4">Changer le statut</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4 font-medium">#{order.id}</td>
                <td className="p-4">{order.user?.name || "—"}</td>
                <td className="p-4">{order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                <td className="p-4">{Number(order.total || 0).toLocaleString("fr-FR")} MAD</td>
                <td className="p-4">{labels[order.status] || order.status}</td>
                <td className="p-4">
                  <select disabled={savingId === order.id} value={order.status} onChange={(e) => changeStatus(order.id, e.target.value)} className="rounded-lg border p-2 disabled:opacity-50">
                    {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan="6" className="p-6 text-center text-slate-500">Aucune commande trouvée.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">Affichage de la première page de résultats.</p>
    </section>
  );
}
