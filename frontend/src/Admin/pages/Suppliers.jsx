
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/supplierService";

const inputClass =
  "w-full rounded-lg border border-slate-400 bg-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-950 placeholder:text-slate-600 outline-none transition hover:bg-slate-300 focus:border-amber-500 focus:bg-slate-100 focus:ring-2 focus:ring-amber-200";

const searchInputClass =
  "w-full rounded-lg border border-slate-400 bg-slate-200 py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-950 placeholder:text-slate-600 outline-none transition hover:bg-slate-300 focus:border-amber-500 focus:bg-slate-100 focus:ring-2 focus:ring-amber-200";

const emptyForm = {
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  ice: "",
};

function getErrorMessage(error) {
  return error?.message || "Une erreur est survenue. Veuillez réessayer.";
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSuppliers() {
    setLoading(true);
    setError("");

    try {
      const response = await getSuppliers();
      const rows = Array.isArray(response) ? response : response?.data;
      setSuppliers(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return suppliers;

    return suppliers.filter((supplier) =>
      [
        supplier.name,
        supplier.contact_person,
        supplier.email,
        supplier.phone,
        supplier.city,
        supplier.ice,
      ].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [suppliers, search]);

  const totalProducts = suppliers.reduce(
    (total, supplier) => total + Number(supplier.products_count || 0),
    0
  );

  function openCreateModal() {
    setEditingSupplier(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(supplier) {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name || "",
      contact_person: supplier.contact_person || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      city: supplier.city || "",
      ice: supplier.ice || "",
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingSupplier(null);
    setForm(emptyForm);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Le nom du fournisseur est obligatoire.");
      return;
    }

    setSaving(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value.trim()])
      );

      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, payload);
        setSuccess("Fournisseur modifié avec succès.");
      } else {
        await createSupplier(payload);
        setSuccess("Fournisseur ajouté avec succès.");
      }

      setModalOpen(false);
      setEditingSupplier(null);
      setForm(emptyForm);
      await loadSuppliers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(supplier) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le fournisseur "${supplier.name}" ?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteSupplier(supplier.id);
      setSuccess("Fournisseur supprimé avec succès.");
      await loadSuppliers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              <Building2 size={15} />
              Gestion commerciale
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">
              Fournisseurs
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Gérez vos partenaires et leurs informations.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12385d]"
          >
            <Plus size={18} />
            Ajouter un fournisseur
          </button>
        </div>

        {success && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && !modalOpen && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total fournisseurs
                </p>
                <p className="mt-2 text-3xl font-bold text-[#0A2540]">
                  {suppliers.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-[#0A2540]">
                <Building2 size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Produits associés
                </p>
                <p className="mt-2 text-3xl font-bold text-[#0A2540]">
                  {totalProducts}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Package size={23} />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-[#0A2540]">
                Liste des fournisseurs
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredSuppliers.length} résultat(s)
              </p>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-72">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un fournisseur..."
                  className={searchInputClass}
                />
              </div>

              <button
                type="button"
                onClick={loadSuppliers}
                title="Actualiser"
                className="rounded-lg border border-slate-200 px-3 text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
              <RefreshCw size={18} className="animate-spin" />
              Chargement des fournisseurs...
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <Building2 size={35} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                Aucun fournisseur trouvé
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ajoutez un fournisseur ou modifiez votre recherche.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Fournisseur
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Contact
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Coordonnées
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Ville
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Produits
                    </th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-bold text-[#0A2540]">
                            {(supplier.name || "F").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {supplier.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              ID #{supplier.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {supplier.contact_person || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1 text-xs text-slate-600">
                          <p className="flex items-center gap-2">
                            <Mail size={13} className="text-slate-400" />
                            {supplier.email || "—"}
                          </p>

                          <p className="flex items-center gap-2">
                            <Phone size={13} className="text-slate-400" />
                            {supplier.phone || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          {supplier.city || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          {supplier.products_count ?? 0} produit(s)
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(supplier)}
                            title="Modifier"
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(supplier)}
                            title="Supprimer"
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="font-bold text-[#0A2540]">
                  {editingSupplier
                    ? "Modifier le fournisseur"
                    : "Nouveau fournisseur"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Renseignez les informations du partenaire.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Nom du fournisseur *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    placeholder="Ex. Fournitures Industrielles SARL"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Personne à contacter
                  </label>

                  <input
                    name="contact_person"
                    value={form.contact_person}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="Nom du contact"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Adresse e-mail
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Téléphone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={30}
                    placeholder="+212 6..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Ville
                  </label>

                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    maxLength={255}
                    placeholder="Ex. Casablanca"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Adresse
                  </label>

                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Adresse complète"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    ICE
                  </label>

                  <input
                    name="ice"
                    value={form.ice}
                    onChange={handleChange}
                    maxLength={30}
                    placeholder="Identifiant Commun de l'Entreprise"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12385d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}

                  {saving
                    ? "Enregistrement..."
                    : editingSupplier
                    ? "Enregistrer les modifications"
                    : "Ajouter le fournisseur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
