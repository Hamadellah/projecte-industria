
import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} MAD`;

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Chargement du dashboard...</p>;

  if (error) return <p className="m-6 whitespace-pre-line rounded-lg bg-red-50 p-4 text-red-700">{error}</p>;

  const stats = [
    { label: "Clients", value: data.total_users ?? 0 },
    { label: "Produits", value: data.total_products ?? 0 },
    { label: "Commandes", value: data.total_orders ?? 0 },
    { label: "Chiffre d'affaires", value: money(data.total_revenue) },
  ];

  return (
    <div className="space-y-6 p-6">
      <div><h1 className="text-2xl font-bold text-[#0A2540]">Vue d'ensemble</h1><p className="mt-1 text-sm text-slate-500">Résumé de votre activité</p></div>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold text-[#0A2540]">{stat.value}</p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b p-5"><h2 className="font-semibold text-[#0A2540]">Commandes récentes</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Commande</th><th className="p-4">Client</th><th className="p-4">Montant</th><th className="p-4">Statut</th></tr></thead>
            <tbody>
              {(data.recent_orders || []).map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-4 font-medium">#{order.id}</td>
                  <td className="p-4">{order.user?.name || "—"}</td>
                  <td className="p-4">{money(order.total)}</td>
                  <td className="p-4">{order.status}</td>
                </tr>
              ))}
              {!(data.recent_orders || []).length && <tr><td colSpan="4" className="p-6 text-center text-slate-500">Aucune commande récente.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
