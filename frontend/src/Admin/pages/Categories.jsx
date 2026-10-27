
import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/categoryService";

const emptyForm = { name: "", slug: "", image: "", description: "" };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setCategories(await getCategories());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function edit(category) {
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      image: category.image || "",
      description: category.description || "",
    });
    setEditingId(category.id);
    setShowForm(true);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await updateCategory(editingId, form);
      else await createCategory(form);
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="p-6">Chargement des catégories...</p>;

  return (
    <section className="space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Catégories</h1>
          <p className="mt-1 text-sm text-slate-500">Organisez votre catalogue</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }} className="rounded-lg bg-[#0A2540] px-4 py-2.5 font-semibold text-white">Ajouter une catégorie</button>
      </div>

      {error && <p className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {showForm && (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">{editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
          <label className="text-sm">Nom *
            <input required maxLength="100" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" />
          </label>
          <label className="text-sm">Slug *
            <input required maxLength="150" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" />
          </label>
          <label className="text-sm sm:col-span-2">Image (chemin ou URL)
            <input maxLength="255" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" />
          </label>
          <label className="text-sm sm:col-span-2">Description
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" rows="3" />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-[#0A2540]">Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2">Annuler</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="rounded-xl border bg-white p-5 shadow-sm">
            {category.image && <img src={category.image} alt={category.name} className="mb-4 h-36 w-full rounded-lg object-cover" />}
            <h3 className="font-semibold text-[#0A2540]">{category.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{category.slug}</p>
            <p className="mt-3 text-sm">{category.description || "Aucune description"}</p>
            <p className="mt-3 text-sm font-medium">Produits : {category.products_count ?? 0}</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => edit(category)} className="text-sm font-semibold text-blue-700">Modifier</button>
              <button onClick={() => remove(category.id)} className="text-sm font-semibold text-red-600">Supprimer</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
