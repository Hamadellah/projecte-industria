
import { useEffect, useMemo, useState } from "react";
import { Warehouse, AlertTriangle, CheckCircle2, Save, Search, XCircle } from "lucide-react";
import { getProducts, updateProduct } from "../../services/productService";

const inputClass = "w-full rounded-lg border border-slate-400 bg-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-950 placeholder:text-slate-600 outline-none transition hover:bg-slate-300 focus:border-amber-500 focus:bg-slate-100 focus:ring-2 focus:ring-amber-200";

const selectClass = "mt-1.5 w-full rounded-lg border border-slate-400 bg-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition hover:bg-slate-300 focus:border-amber-500 focus:bg-slate-100 focus:ring-2 focus:ring-amber-200";

const compactInputClass = "rounded-lg border border-slate-400 bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-950 placeholder:text-slate-600 outline-none transition hover:bg-slate-300 focus:border-amber-500 focus:bg-slate-100 focus:ring-2 focus:ring-amber-200";

function getStockState(quantity) {
  if (quantity <= 0) return "out";
  if (quantity <= 5) return "low";
  return "available";
}

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = Number(product.stock_quantity || 0);
      const term = search.toLowerCase().trim();

      const matchesSearch =
        !term ||
        `${product.name || ""} ${product.reference || ""}`
          .toLowerCase()
          .includes(term);

      const matchesState =
        !stockFilter || getStockState(stock) === stockFilter;

      const matchesMin =
        minQuantity === "" || stock >= Number(minQuantity);

      const matchesMax =
        maxQuantity === "" || stock <= Number(maxQuantity);

      return matchesSearch && matchesState && matchesMin && matchesMax;
    });
  }, [products, search, stockFilter, minQuantity, maxQuantity]);

  const lowStockCount = products.filter(
    (product) =>
      Number(product.stock_quantity || 0) > 0 &&
      Number(product.stock_quantity || 0) <= 5
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock_quantity || 0) <= 0
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

      <div className="grid gap-4 sm:grid-cols-3">
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

        <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Ruptures de stock</p>
            <p className="mt-1 text-2xl font-bold text-[#0A2540]">
              {outOfStockCount}
            </p>
          </div>
        </article>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="min-w-[220px] flex-1 text-xs font-semibold text-slate-600">
          Rechercher un produit
          <div className="relative mt-1.5">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom ou référence..."
              className="w-full rounded-lg border border-slate-400 bg-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-950 placeholder:text-slate-600 outline-none transition hover:bg-slate-300 focus:border-amber-500 focus:bg-slate-100 focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </label>

        <label className="min-w-[170px] text-xs font-semibold text-slate-600">
          État du stock
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">Tous les états</option>
            <option value="available">Disponible</option>
            <option value="low">Stock faible</option>
            <option value="out">Rupture de stock</option>
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Quantité minimum
          <input
            type="number"
            min="0"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            placeholder="Min."
            className={`mt-1.5 w-full ${compactInputClass}`}
          />
        </label>

        <label className="text-xs font-semibold text-slate-600">
          Quantité maximum
          <input
            type="number"
            min="0"
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(e.target.value)}
            placeholder="Max."
            className={`mt-1.5 w-full ${compactInputClass}`}
          />
        </label>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStockFilter("");
            setMinQuantity("");
            setMaxQuantity("");
          }}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Réinitialiser
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-[#0A2540]">État du stock</h2>
          <p className="mt-1 text-xs text-slate-500">
            {filteredProducts.length} produit(s) affiché(s) sur {products.length}
          </p>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">
            Chargement du stock...
          </p>
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
                {filteredProducts.map((product) => {
                  const stock = Number(product.stock_quantity || 0);
                  const state = getStockState(stock);

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
                          className={`w-24 ${compactInputClass}`}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                            state === "out"
                              ? "bg-red-50 text-red-700"
                              : state === "low"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {state === "out" ? (
                            <XCircle size={14} />
                          ) : state === "low" ? (
                            <AlertTriangle size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}

                          {state === "out"
                            ? "Rupture de stock"
                            : state === "low"
                            ? "Stock faible"
                            : "Disponible"}
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
                          {savingId === product.id
                            ? "Enregistrement..."
                            : "Enregistrer"}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!filteredProducts.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      Aucun produit ne correspond aux filtres.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
