import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  User,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban,
  Trash2,
  Package,
  FileCheck,
} from "lucide-react";

import {
  getQuotations,
  getQuotation,
  updateQuotationStatus,
  deleteQuotation,
} from "../../services/quotationService";

const statusConfig = {
  pending: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700",
    icon: Clock,
  },
  accepted: {
    label: "Accepté",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Refusé",
    className: "bg-red-50 text-red-700",
    icon: Ban,
  },
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMoney(value) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function getQuotationNumber(quotation) {
  return quotation?.quotation_number || `DEV-${quotation?.id ?? "—"}`;
}

function getClientName(quotation) {
  return quotation?.user?.name || quotation?.user?.full_name || quotation?.customer?.name || "Client non renseigné";
}

function getItems(quotation) {
  return quotation?.quotationItems || quotation?.quotation_items || quotation?.items || [];
}

function getResponseRows(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function unwrapQuotation(response) {
  return response?.data?.quotation || response?.quotation || response?.data?.data || response?.data || response;
}

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadQuotations(page = currentPage, status = statusFilter) {
    setLoading(true);
    setError("");

    try {
      const response = await getQuotations(page, status);
      const rows = getResponseRows(response);

      setQuotations(rows);
      setCurrentPage(Number(response?.current_page || response?.meta?.current_page || page));
      setLastPage(Number(response?.last_page || response?.meta?.last_page || 1));
    } catch (err) {
      setError(err?.message || "Impossible de charger les demandes de devis.");
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotations(1, statusFilter);
  }, [statusFilter]);

  const filteredQuotations = quotations.filter((quotation) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      getQuotationNumber(quotation),
      getClientName(quotation),
      quotation?.status,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  const pendingCount = quotations.filter((item) => item.status === "pending").length;
  const acceptedCount = quotations.filter((item) => item.status === "accepted").length;
  const rejectedCount = quotations.filter((item) => item.status === "rejected").length;

  async function openDetails(quotation) {
    setSelectedQuotation(quotation);
    setDetailLoading(true);
    setError("");

    try {
      const response = await getQuotation(quotation.id);
      setSelectedQuotation(unwrapQuotation(response));
    } catch (err) {
      setError(err?.message || "Impossible de charger les détails du devis.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleStatusChange(quotation, newStatus) {
    if (!newStatus || newStatus === quotation.status) return;

    setUpdatingStatus(true);
    setError("");
    setSuccess("");

    try {
      await updateQuotationStatus(quotation.id, newStatus);

      setSuccess("Statut du devis mis à jour avec succès.");

      setQuotations((current) =>
        current.map((item) =>
          item.id === quotation.id ? { ...item, status: newStatus } : item
        )
      );

      setSelectedQuotation((current) =>
        current?.id === quotation.id ? { ...current, status: newStatus } : current
      );
    } catch (err) {
      setError(err?.message || "Impossible de modifier le statut du devis.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleDelete(quotation) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le devis ${getQuotationNumber(quotation)} ?`
    );

    if (!confirmed) return;

    setDeletingId(quotation.id);
    setError("");
    setSuccess("");

    try {
      await deleteQuotation(quotation.id);

      setQuotations((current) => current.filter((item) => item.id !== quotation.id));

      if (selectedQuotation?.id === quotation.id) {
        setSelectedQuotation(null);
      }

      setSuccess("Devis supprimé avec succès.");

      if (quotations.length === 1 && currentPage > 1) {
        await loadQuotations(currentPage - 1, statusFilter);
      }
    } catch (err) {
      setError(err?.message || "Impossible de supprimer le devis.");
    } finally {
      setDeletingId(null);
    }
  }

  function changePage(page) {
    if (page < 1 || page > lastPage || page === currentPage) return;
    loadQuotations(page, statusFilter);
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              <FileCheck size={15} />
              Gestion commerciale
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">Demandes de devis</h1>
            <p className="mt-1 text-sm text-slate-500">Consultez et gérez les demandes de devis de vos clients.</p>
          </div>

          <button type="button" onClick={() => loadQuotations(currentPage, statusFilter)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>

        {success && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{success}</span>
            <button type="button" onClick={() => setSuccess("")} aria-label="Fermer">
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">En attente</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Acceptés</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{acceptedCount}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Refusés</p>
                <p className="mt-2 text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <Ban size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-[#0A2540]">Liste des devis</h2>
              <p className="mt-1 text-xs text-slate-500">Suivi des demandes et de leurs statuts.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-64">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un devis..." className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
              </div>

              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-amber-500">
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
              <RefreshCw size={18} className="animate-spin" />
              Chargement des devis...
            </div>
          ) : filteredQuotations.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <FileText size={35} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">Aucun devis trouvé</p>
              <p className="mt-1 text-sm text-slate-500">Aucune demande ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">N° Devis</th>
                    <th className="px-5 py-4 font-semibold">Client</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Montant</th>
                    <th className="px-5 py-4 font-semibold">Statut</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuotations.map((quotation) => {
                    const status = statusConfig[quotation.status] || statusConfig.pending;
                    const StatusIcon = status.icon;

                    return (
                      <tr key={quotation.id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-2 text-[#0A2540]">
                              <FileText size={16} />
                            </div>
                            <button type="button" onClick={() => openDetails(quotation)} className="font-semibold text-[#0A2540] hover:text-amber-600">
                              {getQuotationNumber(quotation)}
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-700">{getClientName(quotation)}</td>
                        <td className="px-5 py-4 text-slate-500">{formatDate(quotation.created_at)}</td>
                        <td className="px-5 py-4 font-semibold text-[#0A2540]">{formatMoney(quotation.total)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                            <StatusIcon size={13} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button type="button" onClick={() => openDetails(quotation)} title="Voir les détails" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                              <Eye size={16} />
                            </button>
                            <button type="button" onClick={() => handleDelete(quotation)} disabled={deletingId === quotation.id} title="Supprimer" className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                              {deletingId === quotation.id ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">Page {currentPage} sur {lastPage}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1 || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft size={15} />
                Précédent
              </button>
              <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage >= lastPage || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                Suivant
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedQuotation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onClick={() => setSelectedQuotation(null)}>
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                  <FileCheck size={15} />
                  Détail du devis
                </div>
                <h2 className="mt-1 font-bold text-[#0A2540]">{getQuotationNumber(selectedQuotation)}</h2>
              </div>
              <button type="button" onClick={() => setSelectedQuotation(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={19} />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
                <RefreshCw size={18} className="animate-spin" />
                Chargement des détails...
              </div>
            ) : (
              <div className="space-y-5 p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500"><User size={14} /> Client</p>
                    <p className="mt-2 font-semibold text-[#0A2540]">{getClientName(selectedQuotation)}</p>
                    <p className="mt-1 text-xs text-slate-500">{selectedQuotation.user?.email || selectedQuotation.customer?.email || "—"}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} /> Date de création</p>
                    <p className="mt-2 font-semibold text-[#0A2540]">{formatDate(selectedQuotation.created_at)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500"><CreditCard size={14} /> Montant total</p>
                    <p className="mt-2 font-bold text-[#0A2540]">{formatMoney(selectedQuotation.total)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500"><FileText size={14} /> Numéro du devis</p>
                    <p className="mt-2 font-semibold text-[#0A2540]">{getQuotationNumber(selectedQuotation)}</p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Modifier le statut du devis</label>
                  <select value={selectedQuotation.status || "pending"} disabled={updatingStatus} onChange={(event) => handleStatusChange(selectedQuotation, event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 disabled:opacity-50">
                    <option value="pending">En attente</option>
                    <option value="accepted">Accepté</option>
                    <option value="rejected">Refusé</option>
                  </select>
                  {updatingStatus && <p className="mt-2 text-xs text-slate-500">Mise à jour en cours...</p>}
                </div>

                {selectedQuotation.notes && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500">Notes</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{selectedQuotation.notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0A2540]">
                    <Package size={17} />
                    Produits demandés
                  </h3>

                  {getItems(selectedQuotation).length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
                      Aucun produit disponible dans ce devis.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full min-w-[500px] text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500">
                          <tr>
                            <th className="px-3 py-3 text-left font-semibold">Produit</th>
                            <th className="px-3 py-3 text-center font-semibold">Quantité</th>
                            <th className="px-3 py-3 text-right font-semibold">Prix unitaire</th>
                            <th className="px-3 py-3 text-right font-semibold">Sous-total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {getItems(selectedQuotation).map((item) => (
                            <tr key={item.id || `${item.product_id}-${item.quantity}`}>
                              <td className="px-3 py-3 font-medium text-slate-700">{item.product?.name || item.product_name || `Produit #${item.product_id || "—"}`}</td>
                              <td className="px-3 py-3 text-center text-slate-600">{item.quantity ?? "—"}</td>
                              <td className="px-3 py-3 text-right text-slate-600">{formatMoney(item.unit_price)}</td>
                              <td className="px-3 py-3 text-right font-semibold text-[#0A2540]">{formatMoney(item.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-500">Total du devis</p>
                    <p className="mt-1 text-xl font-bold text-[#0A2540]">{formatMoney(selectedQuotation.total)}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedQuotation(null)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}