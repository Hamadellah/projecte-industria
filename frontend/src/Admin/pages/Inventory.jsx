
import { useEffect, useState } from "react";
import { getProducts, updateProduct } from "../services/productService";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const result = await getProducts();
      setProducts(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveStock(product, value) {
    const quantity = Number(value);
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
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <p className="p-6">Chargement du stock...</p>;

  return (
    <section className="space-y-5 p-6">
      <div><h1 className="text-2xl font-bold text-[#0A2540]">Gestion du stock</h1><p className="mt-1 text-sm text-slate-500">Quantités enregistrées dans la base de données</p></div>
      {error && <p className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Produit</th><th className="p-4">Référence</th><th className="p-4">Quantité</th><th className="p-4">État</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {products.map((product) => {
              const stock = Number(product.stock_quantity || 0);
              const low = stock <= 5;

              return (
                <tr key={product.id} className="border-t">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{product.reference}</td>
                  <td className="p-4">
                    <input aria-label={`Stock ${product.name}`} type="number" min="0" step="1" defaultValue={stock} id={`stock-${product.id}`} className="w-24 rounded-lg border p-2" />
                  </td>
                  <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${low ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{low ? "Stock faible" : "Disponible"}</span></td>
                  <td className="p-4"><button disabled={savingId === product.id} onClick={() => saveStock(product, document.getElementById(`stock-${product.id}`).value)} className="rounded-lg bg-[#0A2540] px-3 py-2 text-white disabled:opacity-50">Enregistrer</button></td>
                </tr>
              );
            })}
            {!products.length && <tr><td colSpan="5" className="p-6 text-center text-slate-500">Aucun produit trouvé.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">Seuls les 20 premiers produits sont affichés. La pagination peut être ajoutée ensuite.</p>
    </section>
  );
}
