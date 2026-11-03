import { useEffect, useState } from "react";
import { ShoppingCart, RefreshCw, X, Eye, UserRound, Mail, Phone, CalendarDays, Package, MapPin } from "lucide-react";
import { getOrders, getOrder, updateOrderStatus } from "../../services/orderService";

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

function unwrapOrder(result) {
  return result?.data?.order || result?.order || result?.data || result;
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("fr-FR")} MAD`;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

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

  async function openDetails(order) {
    setSelectedOrder(order);
    setDetailsLoading(true);
    setDetailsError("");

    try {
      const result = await getOrder(order.id);
      setSelectedOrder(unwrapOrder(result));
    } catch (err) {
      setDetailsError(err.message || "Impossible de charger les détails de la commande.");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function changeStatus(id, status) {
    setSavingId(id);
    setError("");

    try {
      await updateOrderStatus(id, status);
      await load();

      if (selectedOrder?.id === id) {
        setSelectedOrder((current) => ({ ...current, status }));
      }
    } catch (err) {
      setError(err.message || "Impossible de modifier le statut");
    } finally {
      setSavingId(null);
    }
  }

  const products = selectedOrder?.orderItems || selectedOrder?.order_items || selectedOrder?.items || [];
  const customer = selectedOrder?.user || selectedOrder?.customer || {};

  const detailRow = (label, value, Icon) => (
    <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
      <div className="mt-0.5 text-amber-600"><Icon size={17} /></div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#0A2540]">{value || "Non renseigné"}</p>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen space-y-6 bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Activité commerciale</p>
          <h1 className="mt-2 text-2xl font-bold text-[#0A2540]">Commandes</h1>
          <p className="mt-1 text-sm text-slate-500">Suivez les commandes et actualisez leur statut.</p>
        </div>
        <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-600">
          <ShoppingCart size={17} /><span>{orders.length} résultat(s)</span>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div><h2 className="font-semibold text-[#0A2540]">Liste des commandes</h2><p className="mt-1 text-xs text-slate-500">Cliquez sur une commande pour consulter ses détails.</p></div>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500">
            <option value="">Toutes les commandes</option>
            {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
          </select>
          <button type="button" onClick={load} aria-label="Actualiser les commandes" className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"><RefreshCw size={17} /></button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? <p className="p-8 text-sm text-slate-500">Chargement des commandes...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-4">N° commande</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Modifier</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => openDetails(order)} className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900">
                        #{order.id}<Eye size={14} />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{order.user?.name || "—"}</p>
                      <p className="mt-1 text-xs text-slate-500">{order.user?.email || ""}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">{formatMoney(order.total)}</td>
                    <td className="px-5 py-4"><span className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${statusClass[order.status] || "bg-slate-100 text-slate-600"}`}>{labels[order.status] || order.status}</span></td>
                    <td className="px-5 py-4">
                      <select disabled={savingId === order.id} value={order.status} onChange={(e) => changeStatus(order.id, e.target.value)} className="max-w-44 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-amber-500 disabled:opacity-50">
                        {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {!orders.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">Aucune commande trouvée.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">Les commandes et leurs statuts sont chargés depuis le backend.</p>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Détail de la commande</p><h2 className="mt-1 text-xl font-bold text-[#0A2540]">Commande #{selectedOrder.id}</h2></div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
            </div>

            {detailsLoading ? <p className="p-8 text-center text-sm text-slate-500">Chargement des détails...</p> : (
              <div className="space-y-6 p-5">
                {detailsError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{detailsError}</div>}

                <div className="grid gap-3 sm:grid-cols-2">
                  {detailRow("Nom du client", customer.name, UserRound)}
                  {detailRow("Email", customer.email, Mail)}
                  {detailRow("Téléphone", customer.phone || customer.phone_number, Phone)}
                  {detailRow("Adresse", selectedOrder.shipping_address || selectedOrder.address || customer.address, MapPin)}
                  {detailRow("Date de commande", selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString("fr-FR") : null, CalendarDays)}
                  {detailRow("Statut", labels[selectedOrder.status] || selectedOrder.status, Eye)}
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2"><Package size={19} className="text-amber-600" /><h3 className="font-bold text-[#0A2540]">Produits commandés</h3></div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Produit</th><th className="px-4 py-3">Référence</th><th className="px-4 py-3">Prix unitaire</th><th className="px-4 py-3">Quantité</th><th className="px-4 py-3">Sous-total</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map((item, index) => {
                          const product = item.product || item;
                          const quantity = Number(item.quantity || 0);
                          const price = Number(item.unit_price ?? item.price ?? product.price ?? 0);
                          return <tr key={item.id || index}>
                            <td className="px-4 py-3 font-medium text-[#0A2540]">{product.name || item.name || "Produit"}</td>
                            <td className="px-4 py-3 text-slate-600">{product.reference || item.reference || "—"}</td>
                            <td className="px-4 py-3">{formatMoney(price)}</td>
                            <td className="px-4 py-3">{quantity}</td>
                            <td className="px-4 py-3 font-semibold">{formatMoney(item.subtotal ?? price * quantity)}</td>
                          </tr>;
                        })}
                        {!products.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucun produit détaillé retourné par l'API.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="ml-auto max-w-sm space-y-2 rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between text-sm text-slate-600"><span>Total de la commande</span><strong className="text-lg text-[#0A2540]">{formatMoney(selectedOrder.total)}</strong></div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Fermer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}