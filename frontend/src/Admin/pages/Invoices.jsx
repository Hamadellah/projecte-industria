
import { useEffect, useState } from "react";
import { FileText, Search, Eye, RefreshCw, X, ChevronLeft, ChevronRight, Receipt, CalendarDays, User, CreditCard, AlertCircle, CheckCircle2, Clock, Ban } from "lucide-react";
import { getInvoices, getInvoice, updateInvoiceStatus } from "../../services/invoiceService";

const statusConfig = {
  unpaid: { label: "Non payée", className: "bg-amber-50 text-amber-700", icon: Clock },
  paid: { label: "Payée", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  cancelled: { label: "Annulée", className: "bg-red-50 text-red-700", icon: Ban },
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

function getInvoiceNumber(invoice) {
  return invoice?.invoice_number || invoice?.number || invoice?.reference || `FAC-${invoice?.id ?? "—"}`;
}

function getInvoiceAmount(invoice) {
  return invoice?.total_amount ?? invoice?.amount ?? invoice?.total ?? invoice?.order?.total ?? 0;
}

function getClientName(invoice) {
  const user = invoice?.order?.user || invoice?.user || invoice?.customer;
  return user?.name || user?.full_name || "Client non renseigné";
}

function getOrderReference(invoice) {
  return invoice?.order?.reference || invoice?.order?.order_number || invoice?.order_id || "—";
}

function getResponseRows(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function loadInvoices(page = currentPage, status = statusFilter) {
    setLoading(true);
    setError("");

    try {
      const response = await getInvoices(page, status);
      const rows = getResponseRows(response);

      setInvoices(rows);
      setCurrentPage(Number(response?.current_page || response?.meta?.current_page || page));
      setLastPage(Number(response?.last_page || response?.meta?.last_page || 1));
    } catch (err) {
      setError(err?.message || "Impossible de charger les factures.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices(1, statusFilter);
  }, [statusFilter]);

  const filteredInvoices = invoices.filter((invoice) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      getInvoiceNumber(invoice),
      getClientName(invoice),
      getOrderReference(invoice),
      invoice?.status,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid").length;
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "unpaid").length;

  async function openDetails(invoice) {
    setSelectedInvoice(invoice);
    setDetailLoading(true);

    try {
      const response = await getInvoice(invoice.id);
      const detail = response?.data || response?.invoice || response;
      setSelectedInvoice(detail);
    } catch (err) {
      setError(err?.message || "Impossible de charger les détails de la facture.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleStatusChange(invoice, newStatus) {
    if (!newStatus || newStatus === invoice.status) return;

    setUpdatingStatus(true);
    setError("");
    setSuccess("");

    try {
      await updateInvoiceStatus(invoice.id, newStatus);
      setSuccess("Statut de la facture mis à jour avec succès.");

      if (selectedInvoice?.id === invoice.id) {
        setSelectedInvoice((current) => ({ ...current, status: newStatus }));
      }

      await loadInvoices(currentPage, statusFilter);
    } catch (err) {
      setError(err?.message || "Impossible de modifier le statut de la facture.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  function changePage(page) {
    if (page < 1 || page > lastPage || page === currentPage) return;
    loadInvoices(page, statusFilter);
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              <Receipt size={15} />
              Gestion financière
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">Factures</h1>
            <p className="mt-1 text-sm text-slate-500">Consultez et gérez les factures de vos commandes.</p>
          </div>

          <button type="button" onClick={() => loadInvoices(currentPage, statusFilter)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>

        {success && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{success}</span>
            <button type="button" onClick={() => setSuccess("")} aria-label="Fermer"><X size={16} /></button>
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
                <p className="text-sm text-slate-500">Factures affichées</p>
                <p className="mt-2 text-3xl font-bold text-[#0A2540]">{totalInvoices}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-[#0A2540]"><FileText size={22} /></div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Factures payées</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{paidInvoices}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><CheckCircle2 size={22} /></div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Factures non payées</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">{unpaidInvoices}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600"><Clock size={22} /></div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-[#0A2540]">Liste des factures</h2>
              <p className="mt-1 text-xs text-slate-500">Suivi des paiements et des statuts.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-64">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une facture..." className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
              </div>

              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-amber-500">
                <option value="">Tous les statuts</option>
                <option value="unpaid">Non payée</option>
                <option value="paid">Payée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
              <RefreshCw size={18} className="animate-spin" />
              Chargement des factures...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <FileText size={35} className="mx-auto text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">Aucune facture trouvée</p>
              <p className="mt-1 text-sm text-slate-500">Essayez de modifier les filtres de recherche.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">N° Facture</th>
                    <th className="px-5 py-4 font-semibold">Client</th>
                    <th className="px-5 py-4 font-semibold">Commande</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Montant</th>
                    <th className="px-5 py-4 font-semibold">Statut</th>
                    <th className="px-5 py-4 text-right font-semibold">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((invoice) => {
                    const status = statusConfig[invoice.status] || statusConfig.unpaid;
                    const StatusIcon = status.icon;

                    return (
                      <tr key={invoice.id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-50 p-2 text-[#0A2540]"><FileText size={16} /></div>
                            <span className="font-semibold text-slate-800">{getInvoiceNumber(invoice)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-700">{getClientName(invoice)}</td>
                        <td className="px-5 py-4 text-slate-600">#{getOrderReference(invoice)}</td>
                        <td className="px-5 py-4 text-slate-500">{formatDate(invoice.created_at || invoice.issued_at)}</td>
                        <td className="px-5 py-4 font-semibold text-[#0A2540]">{formatMoney(getInvoiceAmount(invoice))}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                            <StatusIcon size={13} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button type="button" onClick={() => openDetails(invoice)} title="Voir les détails" className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                            <Eye size={16} />
                          </button>
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

      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                  <Receipt size={15} />
                  Détail de la facture
                </div>
                <h2 className="mt-1 font-bold text-[#0A2540]">{getInvoiceNumber(selectedInvoice)}</h2>
              </div>
              <button type="button" onClick={() => setSelectedInvoice(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={19} /></button>
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
                    <p className="mt-2 font-semibold text-[#0A2540]">{getClientName(selectedInvoice)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} /> Date de création</p>
                    <p className="mt-2 font-semibold text-[#0A2540]">{formatDate(selectedInvoice.created_at || selectedInvoice.issued_at)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500"><ShoppingCartIcon /> Commande</p>
                    <p className="mt-2 font-semibold text-[#0A2540]">#{getOrderReference(selectedInvoice)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs text-slate-500"><CreditCard size={14} /> Montant total</p>
                    <p className="mt-2 font-bold text-[#0A2540]">{formatMoney(getInvoiceAmount(selectedInvoice))}</p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Modifier le statut de la facture</label>
                  <select value={selectedInvoice.status || "unpaid"} disabled={updatingStatus} onChange={(event) => handleStatusChange(selectedInvoice, event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 disabled:opacity-50">
                    <option value="unpaid">Non payée</option>
                    <option value="paid">Payée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                  {updatingStatus && <p className="mt-2 text-xs text-slate-500">Mise à jour en cours...</p>}
                </div>

                {Array.isArray(selectedInvoice.order?.order_items) && selectedInvoice.order.order_items.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-[#0A2540]">Articles de la commande</h3>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full min-w-[400px] text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500">
                          <tr>
                            <th className="px-3 py-3 text-left font-semibold">Produit</th>
                            <th className="px-3 py-3 text-center font-semibold">Quantité</th>
                            <th className="px-3 py-3 text-right font-semibold">Prix</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedInvoice.order.order_items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-3 py-3 text-slate-700">{item.product?.name || item.product_name || "Produit"}</td>
                              <td className="px-3 py-3 text-center text-slate-600">{item.quantity ?? "—"}</td>
                              <td className="px-3 py-3 text-right font-medium text-slate-700">{formatMoney(item.unit_price ?? item.price ?? 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => setSelectedInvoice(null)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Fermer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingCartIcon() {
  return <FileText size={14} />;
}
