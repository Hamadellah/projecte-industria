import { useEffect, useState } from "react";
import { Tags, Plus, Pencil, Trash2, X, Image as ImageIcon } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/categoryService";

const emptyForm = {
  name: "",
  slug: "",
  image: "",
  description: "",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

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
      setError(err.message || "Erreur de chargement des catégories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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

  function startCreate() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }

      setShowForm(false);
      setForm({ ...emptyForm });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer la catégorie");
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer cette catégorie ?")) return;

    setError("");

    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError(err.message || "Impossible de supprimer cette catégorie");
    }
  }

  return (
    <section className="min-h-screen space-y-6 bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A2540] text-white">
            <Tags size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Organisation du catalogue
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0A2540]">
              Catégories
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Organisez les familles de produits.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12395d]"
        >
          <Plus size={17} />
          Ajouter une catégorie
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-semibold text-[#0A2540]">
              {editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Fermer le formulaire"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Nom *
              <input
                required
                maxLength="100"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Slug *
              <input
                required
                maxLength="150"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Image (chemin ou URL)
              <input
                maxLength="255"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-[#0A2540] hover:bg-amber-400"
            >
              Enregistrer
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Chargement des catégories...
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex h-40 items-center justify-center overflow-hidden bg-slate-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon size={34} className="text-slate-300" />
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#0A2540]">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {category.slug}
                    </p>
                  </div>

                  <span className="whitespace-nowrap rounded-md bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-800">
                    {category.products_count ?? 0} produit(s)
                  </span>
                </div>

                <p className="mt-4 min-h-10 text-sm leading-5 text-slate-600">
                  {category.description || "Aucune description disponible."}
                </p>

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => edit(category)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={15} />
                    Modifier
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(category.id)}
                    aria-label={`Supprimer ${category.name}`}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-red-600 hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!categories.length && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
              Aucune catégorie trouvée.
            </div>
          )}
        </div>
      )}
    </section>
  );
}