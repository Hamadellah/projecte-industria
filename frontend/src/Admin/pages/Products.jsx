import { useEffect, useMemo, useState } from "react";
import { PackagePlus, Pencil, Trash2, Plus, X, CalendarDays, Search } from "lucide-react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const emptyForm = { category_id: "", name: "", reference: "", description: "", price: "", stock_quantity: "", is_active: true, images: [], specifications: [{ name: "", value: "" }] };
const inputClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [productResult, categoryResult] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productResult.data || productResult || []);
      setCategories(categoryResult.data || categoryResult || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setForm({ ...emptyForm, images: [], specifications: [{ name: "", value: "" }] });
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(product) {
    setForm({ 
      category_id: String(product.category_id || ""), 
      name: product.name || "", 
      reference: product.reference || "", 
      description: product.description || "", 
      price: String(product.price ?? ""), 
      stock_quantity: String(product.stock_quantity ?? 0), 
      is_active: Boolean(product.is_active), 
      images: [], 
      specifications: product.product_specifications?.length ? product.product_specifications.map(s => ({ name: s.name, value: s.value })) : [{ name: "", value: "" }] 
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  function updateField(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  function updateRow(field, index, key, value) {
    setForm((current) => ({ ...current, [field]: current[field].map((row, i) => i === index ? { ...row, [key]: value } : row) }));
  }

  function addRow(field, row) { setForm((current) => ({ ...current, [field]: [...current[field], row] })); }
  function removeRow(field, index) { setForm((current) => ({ ...current, [field]: current[field].filter((_, i) => i !== index) })); }

  function handleFileChange(e, index) {
    const file = e.target.files[0];
    if (file) {
      setForm((current) => {
        const newImages = [...current.images];
        newImages[index] = { ...newImages[index], file };
        return { ...current, images: newImages };
      });
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    
    if (form.category_id) {
      formData.append("category_id", Number(form.category_id));
    }
    
    formData.append("name", form.name.trim());
    formData.append("reference", form.reference.trim());
    if (form.description) formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock_quantity", form.stock_quantity);
    formData.append("is_active", form.is_active ? "1" : "0");

    // Ajout dyal les images (Files)
    if (form.images && form.images.length > 0) {
      form.images.forEach((img, index) => {
        if (img.file) {
          formData.append(`images[${index}]`, img.file);
        }
      });
    }

    // Ajout dyal specifications k JSON string
    if (!editingId && form.specifications && form.specifications.length > 0) {
      const validSpecs = form.specifications.filter((item) => item.name.trim() && item.value.trim());
      if (validSpecs.length > 0) {
        formData.append("specifications", JSON.stringify(validSpecs));
      }
    }

    try {
      if (editingId) {
        formData.append("_method", "PUT");
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }
      setShowForm(false);
      setEditingId(null);
      await load();
    } catch (err) {
      console.error("Validation Errors Details:", err.response?.data);
      setError(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement");
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try { await deleteProduct(id); await load(); }
    catch (err) { setError(err.message || "Impossible de supprimer ce produit"); }
  }

  const filteredProducts = useMemo(() => products.filter((product) => {
    const term = search.toLowerCase().trim();
    const matchesSearch = !term || `${product.name || ""} ${product.reference || ""}`.toLowerCase().includes(term);
    const createdDate = product.created_at ? new Date(product.created_at).toISOString().slice(0, 10) : "";
    const matchesFrom = !dateFrom || (createdDate && createdDate >= dateFrom);
    const matchesTo = !dateTo || (createdDate && createdDate <= dateTo);
    return matchesSearch && matchesFrom && matchesTo;
  }), [products, search, dateFrom, dateTo]);

  if (loading) return <p className="p-6 text-sm text-slate-500">Chargement des produits...</p>;

  return (
    <section className="min-h-screen space-y-6 bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Catalogue</p><h1 className="mt-2 text-2xl font-bold text-[#0A2540]">Produits</h1><p className="mt-1 text-sm text-slate-500">Gérez vos références, prix et disponibilités.</p></div>
        <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12395d]"><PackagePlus size={17} />Ajouter un produit</button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {showForm && (
        <form onSubmit={submit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4"><h2 className="font-bold text-[#0A2540]">{editingId ? "Modifier le produit" : "Nouveau produit"}</h2><button type="button" onClick={() => setShowForm(false)} aria-label="Fermer le formulaire" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Nom *<input required maxLength="150" value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">Catégorie *<select required value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)} className={inputClass}><option value="">Choisir une catégorie</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Référence *<input required maxLength="100" value={form.reference} onChange={(e) => updateField("reference", e.target.value)} className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">Prix (MAD) *<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">Quantité en stock *<input required type="number" min="0" step="1" value={form.stock_quantity} onChange={(e) => updateField("stock_quantity", e.target.value)} className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Description<textarea rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} className={inputClass} /></label>
            <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2"><input type="checkbox" checked={form.is_active} onChange={(e) => updateField("is_active", e.target.checked)} className="h-4 w-4 accent-amber-500" />Produit actif</label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-[#0A2540]">Images (Fichiers)</h3><button type="button" onClick={() => addRow("images", { file: null })} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700"><Plus size={16} /> Ajouter une image</button></div>
            {form.images.map((image, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index)} className="text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0A2540] hover:file:bg-amber-400" />
                <button type="button" onClick={() => removeRow("images", index)} className="text-sm text-red-600 ml-auto">Retirer</button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-[#0A2540]">Spécifications</h3><button type="button" onClick={() => addRow("specifications", { name: "", value: "" })} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700"><Plus size={16} /> Ajouter</button></div>
            {form.specifications.map((item, index) => <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input value={item.name} onChange={(e) => updateRow("specifications", index, "name", e.target.value)} placeholder="Nom (ex. Puissance)" className="rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-amber-500" /><input value={item.value} onChange={(e) => updateRow("specifications", index, "value", e.target.value)} placeholder="Valeur (ex. 5 kW)" className="rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-amber-500" /><button type="button" onClick={() => removeRow("specifications", index)} className="text-left text-sm text-red-600">Retirer</button></div>)}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5"><button type="submit" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-[#0A2540] hover:bg-amber-400">Enregistrer</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button></div>
        </form>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="min-w-[220px] flex-1 text-xs font-semibold text-slate-600">Rechercher un produit<div className="relative mt-1.5"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom ou référence..." className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500" /></div></label>
        <label className="text-xs font-semibold text-slate-600">Date d'ajout - du<div className="relative mt-1.5"><CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500" /></div></label>
        <label className="text-xs font-semibold text-slate-600">Au<input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className="mt-1.5 block rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" /></label>
        <button type="button" onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Réinitialiser</button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-[#0A2540]">Catalogue des produits</h2><p className="mt-1 text-xs text-slate-500">{filteredProducts.length} produit(s) affiché(s) sur {products.length}</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Produit</th><th className="px-5 py-4">Référence</th><th className="px-5 py-4">Catégorie</th><th className="px-5 py-4">Prix</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Date d'ajout</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const imgPath = product.product_images?.[0]?.image_path;
                const fullImgUrl = imgPath ? `http://127.0.0.1:8000/storage/${imgPath}` : null;
                return (
                  <tr key={product.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4"><div className="flex items-center gap-3">{fullImgUrl ? <img src={fullImgUrl} alt="" className="h-11 w-11 rounded-lg border border-slate-200 object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><PackagePlus size={19} /></div>}<span className="font-semibold text-[#0A2540]">{product.name}</span></div></td>
                    <td className="px-5 py-4 text-slate-600">{product.reference}</td><td className="px-5 py-4 text-slate-600">{product.category?.name || "—"}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">{Number(product.price).toLocaleString("fr-FR")} MAD</td><td className="px-5 py-4">{product.stock_quantity}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{product.created_at ? new Date(product.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                    <td className="px-5 py-4"><span className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${product.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{product.is_active ? "Actif" : "Inactif"}</span></td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => startEdit(product)} aria-label="Modifier le produit" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"><Pencil size={15} /></button><button type="button" onClick={() => remove(product.id)} aria-label="Supprimer le produit" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></div></td>
                  </tr>
                );
              })}
              {!filteredProducts.length && <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-500">Aucun produit ne correspond aux filtres.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}