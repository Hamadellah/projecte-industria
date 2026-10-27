import { useEffect, useState } from "react";
import { Warehouse, AlertTriangle, CheckCircle2, Save } from "lucide-react";
import { getProducts, updateProduct } from "../../services/productService";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [quantities, setQuantities] = useState({});

  async function load() {
    setLoading(true);

    try {
      const result = await getProducts();
      const items = result.data || [];

      setProducts(items);
      setQuantities(
        Object.fromEntries(
          items.map((product) => [
            product.id,
            String(product.stock_quantity ?? 0),
          ])
        )
      );
      setError("");
    } catch (err) {
      setError(err.message || "Erreur de chargement du stock");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveStock(product) {
    const quantity = Number(quantities[product.id]);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("La quantité doit être un entier positif ou zéro.");
      return;
    }

    setSavingId(product.id);
    setError("");

    try {
      await updateProduct(product.id, { stock_quantity: quantity });
      await load();
    } catch (err) {
      setError(err.message || "Impossible de modifier le stock");
    } finally {
      setSavingId(null);
    }
  }

  const lowStockCount = products.filter(
    (product) => Number(product.stock_quantity || 0) <= 5
  ).length;

  const totalUnits = products.reduce(
    (total, product) => total + Number(product.stock_quantity || 0),
    0
  );

  return (
    <section className="min-h-screen space-y-6 bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Logistique
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#0A2540]">
          Gestion de stock
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Contrôlez les quantités et repérez les stocks faibles.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Warehouse size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Unités en stock</p>
            <p className="mt-1 text-2xl font-bold text-[#0A2540]">
              {totalUnits.toLocaleString("fr-FR")}
            </p>
          </div>
        </article>

        <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Stocks faibles</p>
            <p className="mt-1 text-2xl font-bold text-[#0A2540]">
              {lowStockCount}
            </p>
          </div>
        </article>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-[#0A2540]">État du stock</h2>
          <p className="mt-1 text-xs text-slate-500">
            Modifiez une quantité puis enregistrez-la.
          </p>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">Chargement du stock...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Produit</th>
                  <th className="px-5 py-4">Référence</th>
                  <th className="px-5 py-4">Quantité</th>
                  <th className="px-5 py-4">État</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const stock = Number(product.stock_quantity || 0);
                  const low = stock <= 5;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-semibold text-[#0A2540]">
                        {product.name}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {product.reference || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <input
                          aria-label={`Stock ${product.name}`}
                          type="number"
                          min="0"
                          step="1"
                          value={quantities[product.id] ?? ""}
                          onChange={(e) =>
                            setQuantities((current) => ({
                              ...current,
                              [product.id]: e.target.value,
                            }))
                          }
                          className="w-24 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-amber-500"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                            low
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {low ? (
                            <AlertTriangle size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {low ? "Stock faible" : "Disponible"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={savingId === product.id}
                          onClick={() => saveStock(product)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#0A2540] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#12395d] disabled:opacity-50"
                        >
                          <Save size={14} />
                          {savingId === product.id ? "Enregistrement..." : "Enregistrer"}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!products.length && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        L'affichage dépend des produits renvoyés par votre API.
      </p>
    </section>
  );
}