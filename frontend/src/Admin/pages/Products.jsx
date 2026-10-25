
import { useEffect, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";

const emptyForm = {
  category_id: "",
  name: "",
  reference: "",
  slug: "",
  description: "",
  price: "",
  stock_quantity: "",
  is_active: true,
  images: [{ image_path: "", is_main: true, position: 0 }],
  specifications: [{ name: "", value: "" }],
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [productResult, categoryResult] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productResult.data || []);
      setCategories(categoryResult || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(product) {
    setForm({
      category_id: String(product.category_id || ""),
      name: product.name || "",
      reference: product.reference || "",
      slug: product.slug || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      stock_quantity: String(product.stock_quantity ?? 0),
      is_active: Boolean(product.is_active),
      images: [{ image_path: "", is_main: true, position: 0 }],
      specifications: [{ name: "", value: "" }],
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateRow(field, index, key, value) {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((row, i) => i === index ? { ...row, [key]: value } : row),
    }));
  }

  function addRow(field, row) {
    setForm((current) => ({ ...current, [field]: [...current[field], row] }));
  }

  function removeRow(field, index) {
    setForm((current) => ({ ...current, [field]: current[field].filter((_, i) => i !== index) }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      category_id: Number(form.category_id),
      name: form.name.trim(),
      reference: form.reference.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      is_active: form.is_active,
    };

    if (!editingId) {
      payload.images = form.images.filter((image) => image.image_path.trim()).map((image, index) => ({
        image_path: image.image_path.trim(),
        is_main: index === 0 ? true : Boolean(image.is_main),
        position: index,
      }));
      payload.specifications = form.specifications.filter((item) => item.name.trim() && item.value.trim());
    }

    try {
      if (editingId) await updateProduct(editingId, payload);
      else await createProduct(payload);
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="p-6">Chargement des produits...</p>;

  return (
    <section className="space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Produits</h1>
          <p className="mt-1 text-sm text-slate-500">Gestion du catalogue et du stock</p>
        </div>
        <button onClick={startCreate} className="rounded-lg bg-[#0A2540] px-4 py-2.5 font-semibold text-white">Ajouter un produit</button>
      </div>

      {error && <p className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {showForm && (
        <form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-5">
          <h2 className="font-semibold text-[#0A2540]">{editingId ? "Modifier le produit" : "Nouveau produit"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">Nom *
              <input required maxLength="150" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" />
            </label>
            <label className="text-sm">Catégorie *
              <select required value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)} className="mt-1 w-full rounded-lg border p-2.5">
                <option value="">Choisir une catégorie</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label className="text-sm">Référence *
              <input required maxLength="100" value={form.reference} onChange={(e) => updateField("reference", e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" />
            </label>
            <label className="text-sm">Slug *
              <input required maxLength="150" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" />
            </label>
            <label className="text-sm">Prix (MAD) *
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" />
            </label>
            <label className="text-sm">Quantité en stock *
              <input required type="number" min="0" step="1" value={form.stock_quantity} onChange={(e) => updateField("stock_quantity", e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" />
            </label>
            <label className="text-sm sm:col-span-2">Description
              <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" rows="3" />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => updateField("is_active", e.target.checked)} />
              Produit actif
            </label>
          </div>

          {!editingId && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Images (chemins)</h3>
                  <button type="button" onClick={() => addRow("images", { image_path: "", is_main: false, position: form.images.length })} className="text-sm font-semibold text-blue-700">+ Ajouter une image</button>
                </div>
                {form.images.map((image, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                    <input value={image.image_path} onChange={(e) => updateRow("images", index, "image_path", e.target.value)} placeholder="https://... ou chemin public" className="rounded-lg border p-2.5" />
                    <label className="flex items-center gap-2 text-sm"><input type="radio" checked={image.is_main} onChange={() => setForm((current) => ({ ...current, images: current.images.map((item, i) => ({ ...item, is_main: i === index })) }))} /> Principale</label>
                    <button type="button" onClick={() => removeRow("images", index)} className="text-sm text-red-600">Retirer</button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Spécifications</h3>
                  <button type="button" onClick={() => addRow("specifications", { name: "", value: "" })} className="text-sm font-semibold text-blue-700">+ Ajouter une spécification</button>
                </div>
                {form.specifications.map((item, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input value={item.name} onChange={(e) => updateRow("specifications", index, "name", e.target.value)} placeholder="Nom (ex. Puissance)" className="rounded-lg border p-2.5" />
                    <input value={item.value} onChange={(e) => updateRow("specifications", index, "value", e.target.value)} placeholder="Valeur (ex. 5 kW)" className="rounded-lg border p-2.5" />
                    <button type="button" onClick={() => removeRow("specifications", index)} className="text-sm text-red-600">Retirer</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {editingId && <p className="text-sm text-slate-500">Les images et spécifications ne sont pas modifiables via la méthode update actuelle du Backend.</p>}

          <div className="flex gap-2">
            <button className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-[#0A2540]">Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2">Annuler</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr><th className="p-4">Produit</th><th className="p-4">Référence</th><th className="p-4">Catégorie</th><th className="p-4">Prix</th><th className="p-4">Stock</th><th className="p-4">Statut</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="p-4"><div className="flex items-center gap-3">{product.product_images?.[0]?.image_path && <img src={product.product_images[0].image_path} alt="" className="h-10 w-10 rounded object-cover" />}<span className="font-medium">{product.name}</span></div></td>
                <td className="p-4">{product.reference}</td>
                <td className="p-4">{product.category?.name || "—"}</td>
                <td className="p-4">{Number(product.price).toLocaleString("fr-FR")} MAD</td>
                <td className="p-4">{product.stock_quantity}</td>
                <td className="p-4">{product.is_active ? "Actif" : "Inactif"}</td>
                <td className="space-x-3 whitespace-nowrap p-4"><button onClick={() => startEdit(product)} className="text-blue-700">Modifier</button><button onClick={() => remove(product.id)} className="text-red-600">Supprimer</button></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-slate-500">Aucun produit trouvé.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
