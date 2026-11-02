import { useEffect, useState } from "react";
import { PackagePlus, Pencil, Trash2, Plus, X } from "lucide-react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";

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

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

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
      const [productResult, categoryResult] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productResult.data || []);
      setCategories(categoryResult || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setForm({
      ...emptyForm,
      images: [{ image_path: "", is_main: true, position: 0 }],
      specifications: [{ name: "", value: "" }],
    });
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
      [field]: current[field].map((row, i) =>
        i === index ? { ...row, [key]: value } : row
      ),
    }));
  }

  function addRow(field, row) {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], row],
    }));
  }

  function removeRow(field, index) {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, i) => i !== index),
    }));
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
      payload.images = form.images
        .filter((image) => image.image_path.trim())
        .map((image, index) => ({
          image_path: image.image_path.trim(),
          is_main: index === 0 ? true : Boolean(image.is_main),
          position: index,
        }));

      payload.specifications = form.specifications.filter(
        (item) => item.name.trim() && item.value.trim()
      );
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      setShowForm(false);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement");
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      setError(err.message || "Impossible de supprimer ce produit");
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Chargement des produits...</p>;
  }

  return (
    <section className="min-h-screen space-y-6 bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Catalogue
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#0A2540]">Produits</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez vos références, prix et disponibilités.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12395d]"
        >
          <PackagePlus size={17} />
          Ajouter un produit
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
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-bold text-[#0A2540]">
              {editingId ? "Modifier le produit" : "Nouveau produit"}
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
                maxLength="150"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Catégorie *
              <select
                required
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                className={inputClass}
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Référence *
              <input
                required
                maxLength="100"
                value={form.reference}
                onChange={(e) => updateField("reference", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Slug *
              <input
                required
                maxLength="150"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Prix (MAD) *
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Quantité en stock *
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock_quantity}
                onChange={(e) => updateField("stock_quantity", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              Produit actif
            </label>
          </div>

          {!editingId && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#0A2540]">Images</h3>
                  <button
                    type="button"
                    onClick={() =>
                      addRow("images", {
                        image_path: "",
                        is_main: false,
                        position: form.images.length,
                      })
                    }
                    className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>

                {form.images.map((image, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <input
                      value={image.image_path}
                      onChange={(e) =>
                        updateRow("images", index, "image_path", e.target.value)
                      }
                      placeholder="URL ou chemin public de l'image"
                      className="rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-amber-500"
                    />

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={image.is_main}
                        onChange={() =>
                          setForm((current) => ({
                            ...current,
                            images: current.images.map((item, i) => ({
                              ...item,
                              is_main: i === index,
                            })),
                          }))
                        }
                        className="accent-amber-500"
                      />
                      Principale
                    </label>

                    <button
                      type="button"
                      onClick={() => removeRow("images", index)}
                      className="text-left text-sm text-red-600 hover:text-red-700"
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#0A2540]">
                    Spécifications
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      addRow("specifications", { name: "", value: "" })
                    }
                    className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>

                {form.specifications.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      value={item.name}
                      onChange={(e) =>
                        updateRow("specifications", index, "name", e.target.value)
                      }
                      placeholder="Nom (ex. Puissance)"
                      className="rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-amber-500"
                    />

                    <input
                      value={item.value}
                      onChange={(e) =>
                        updateRow("specifications", index, "value", e.target.value)
                      }
                      placeholder="Valeur (ex. 5 kW)"
                      className="rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-amber-500"
                    />

                    <button
                      type="button"
                      onClick={() => removeRow("specifications", index)}
                      className="text-left text-sm text-red-600"
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {editingId && (
            <p className="text-xs leading-5 text-slate-500">
              Les images et spécifications ne sont pas modifiables via la méthode
              update actuelle du backend.
            </p>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-[#0A2540] transition hover:bg-amber-400"
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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-[#0A2540]">
            Catalogue des produits
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {products.length} produit(s) affiché(s)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Produit</th>
                <th className="px-5 py-4">Référence</th>
                <th className="px-5 py-4">Catégorie</th>
                <th className="px-5 py-4">Prix</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.product_images?.[0]?.image_path ? (
                        <img
                          src={product.product_images[0].image_path}
                          alt=""
                          className="h-11 w-11 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <PackagePlus size={19} />
                        </div>
                      )}

                      <span className="font-semibold text-[#0A2540]">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {product.reference}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {product.category?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                    {Number(product.price).toLocaleString("fr-FR")} MAD
                  </td>
                  <td className="px-5 py-4">{product.stock_quantity}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                        product.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {product.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        aria-label="Modifier le produit"
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        aria-label="Supprimer le produit"
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!products.length && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}