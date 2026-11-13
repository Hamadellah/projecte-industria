
import { useEffect, useMemo, useState } from "react";
import {
  FileText, Search, Eye, RefreshCw, X, ChevronLeft, ChevronRight,
  CalendarDays, User, CreditCard, AlertCircle, CheckCircle2, Clock,
  Ban, Trash2, Package, FileCheck, Plus, Trash, Calculator, Save,
  Minus, Printer, Pencil, Download
} from "lucide-react";

import {
  getQuotations,
  getQuotation,
  createQuotation,
  updateQuotationStatus,
  deleteQuotation,
  getQuotationProducts,
  getCurrentAdmin,
} from "../../services/quotationService";

const statusConfig = {
  pending: { label: "En attente", className: "bg-amber-50 text-amber-700", icon: Clock },
  accepted: { label: "Accepté", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "Refusé", className: "bg-red-50 text-red-700", icon: Ban },
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
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

function getCreatorName(quotation) {
  return (
    quotation?.user?.name ||
    quotation?.user?.full_name ||
    quotation?.customer?.name ||
    "Admin non renseigné"
  );
}

function getItems(quotation) {
  return (
    quotation?.quotationItems ||
    quotation?.quotation_items ||
    quotation?.items ||
    []
  );
}

function getResponseRows(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.data?.products)) return response.data.products;
  return [];
}

function unwrapQuotation(response) {
  return (
    response?.data?.quotation ||
    response?.quotation ||
    response?.data?.data ||
    response?.data ||
    response
  );
}

function unwrapUser(response) {
  return (
    response?.data?.user ||
    response?.user ||
    response?.data?.data ||
    response?.data ||
    response
  );
}

function getProductName(product) {
  return product?.name || product?.title || product?.product_name || `Produit #${product?.id}`;
}

function getProductPrice(product) {
  return Number(
    product?.price ??
    product?.selling_price ??
    product?.sale_price ??
    product?.unit_price ??
    0
  );
}

function generateQuotationNumber() {
  return `DEV-${new Date().getFullYear()}-${Date.now()}`;
}

function normalizeItems(items) {
  return (items || []).map((item) => ({
    product_id: item.product_id ?? item.product?.id,
    product_name: item.product?.name || item.product_name || `Produit #${item.product_id}`,
    quantity: Number(item.quantity || 1),
    unit_price: Number(item.unit_price || 0),
    subtotal: Number(item.subtotal ?? (Number(item.quantity || 1) * Number(item.unit_price || 0))),
  }));
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

  // Create form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [quotationItems, setQuotationItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [formError, setFormError] = useState("");

  // Edit form
  const [showEditForm, setShowEditForm] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [editNotes, setEditNotes] = useState("");
  const [editProductId, setEditProductId] = useState("");
  const [editProductSearch, setEditProductSearch] = useState("");
  const [editError, setEditError] = useState("");

  // Print
  const [printQuotation, setPrintQuotation] = useState(null);

  async function loadQuotations(page = currentPage, status = statusFilter) {
    setLoading(true);
    setError("");

    try {
      const response = await getQuotations(page, status);
      setQuotations(getResponseRows(response));
      setCurrentPage(Number(response?.current_page || response?.meta?.current_page || page));
      setLastPage(Number(response?.last_page || response?.meta?.last_page || 1));
    } catch (err) {
      setError(err?.message || "Impossible de charger les devis.");
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotations(1, statusFilter);
  }, [statusFilter]);

  // Open browser print dialog when a quotation is selected for printing.
  useEffect(() => {
    if (!printQuotation) return;

    const timer = setTimeout(() => window.print(), 400);
    const handleAfterPrint = () => setPrintQuotation(null);

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printQuotation]);

  async function openCreateForm() {
    setShowCreateForm(true);
    setFormError("");
    setError("");
    setSuccess("");
    setQuotationItems([]);
    setNotes("");
    setSelectedProductId("");
    setProductSearch("");
    setAdmin(null);
    setProductsLoading(true);

    try {
      const [productsResponse, adminResponse] = await Promise.all([
        getQuotationProducts(1),
        getCurrentAdmin(),
      ]);

      setProducts(getResponseRows(productsResponse));
      setAdmin(unwrapUser(adminResponse));
    } catch (err) {
      setFormError(err?.message || "Impossible de charger les produits ou le compte Admin.");
    } finally {
      setProductsLoading(false);
    }
  }

  const availableProducts = products.filter((product) => {
    const query = productSearch.trim().toLowerCase();
    return !query || getProductName(product).toLowerCase().includes(query);
  });

  function addProduct() {
    if (!selectedProductId) {
      setFormError("Veuillez sélectionner un produit.");
      return;
    }

    const product = products.find((item) => String(item.id) === String(selectedProductId));

    if (!product) {
      setFormError("Produit introuvable.");
      return;
    }

    const existing = quotationItems.find((item) => String(item.product_id) === String(product.id));

    if (existing) {
      setQuotationItems((current) =>
        current.map((item) =>
          String(item.product_id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
            : item
        )
      );
    } else {
      const price = getProductPrice(product);
      setQuotationItems((current) => [
        ...current,
        {
          product_id: product.id,
          product_name: getProductName(product),
          quantity: 1,
          unit_price: price,
          subtotal: price,
        },
      ]);
    }

    setSelectedProductId("");
    setFormError("");
  }

  function updateItemQuantity(productId, quantity) {
    const parsed = Math.max(1, Number(quantity) || 1);
    setQuotationItems((current) =>
      current.map((item) =>
        String(item.product_id) === String(productId)
          ? { ...item, quantity: parsed, subtotal: parsed * item.unit_price }
          : item
      )
    );
  }

  function updateItemPrice(productId, price) {
    const parsed = Math.max(0, Number(price) || 0);
    setQuotationItems((current) =>
      current.map((item) =>
        String(item.product_id) === String(productId)
          ? { ...item, unit_price: parsed, subtotal: item.quantity * parsed }
          : item
      )
    );
  }

  function removeItem(productId) {
    setQuotationItems((current) => current.filter((item) => String(item.product_id) !== String(productId)));
  }

  const total = useMemo(
    () => quotationItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0),
    [quotationItems]
  );

  const editTotal = useMemo(
    () => editItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0),
    [editItems]
  );

  async function handleCreateQuotation(event) {
    event.preventDefault();
    setFormError("");
    setError("");
    setSuccess("");

    if (!admin?.id) {
      setFormError("Impossible de récupérer l'identifiant de l'Admin.");
      return;
    }

    if (quotationItems.length === 0) {
      setFormError("Veuillez ajouter au moins un produit.");
      return;
    }

    const payload = {
      user_id: Number(admin.id),
      quotation_number: generateQuotationNumber(),
      status: "pending",
      total: Number(total.toFixed(2)),
      notes: notes.trim() || null,
      items: quotationItems.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price.toFixed(2)),
        subtotal: Number(item.subtotal.toFixed(2)),
      })),
    };

    setCreating(true);

    try {
      await createQuotation(payload);
      setShowCreateForm(false);
      setQuotationItems([]);
      setNotes("");
      setSuccess("Devis créé avec succès.");
      await loadQuotations(1, statusFilter);
    } catch (err) {
      setFormError(err?.message || "Une erreur est survenue lors de la création du devis.");
    } finally {
      setCreating(false);
    }
  }

  const filteredQuotations = quotations.filter((quotation) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [
      getQuotationNumber(quotation),
      getCreatorName(quotation),
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
        current.map((item) => item.id === quotation.id ? { ...item, status: newStatus } : item)
      );
      setSelectedQuotation((current) =>
        current?.id === quotation.id ? { ...current, status: newStatus } : current
      );
    } catch (err) {
      setError(err?.message || "Impossible de modifier le statut.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleDelete(quotation) {
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer le devis ${getQuotationNumber(quotation)} ?`);
    if (!confirmed) return;

    setDeletingId(quotation.id);
    setError("");
    setSuccess("");

    try {
      await deleteQuotation(quotation.id);
      setQuotations((current) => current.filter((item) => item.id !== quotation.id));

      if (selectedQuotation?.id === quotation.id) setSelectedQuotation(null);

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

  // EDIT: loads quotation and products, then allows local editing.
  async function openEditForm(quotation) {
    setEditError("");
    setProductsLoading(true);
    setShowEditForm(true);

    try {
      const [quotationResponse, productsResponse] = await Promise.all([
        getQuotation(quotation.id),
        getQuotationProducts(1),
      ]);

      const freshQuotation = unwrapQuotation(quotationResponse);

      setEditDraft(freshQuotation);
      setEditItems(normalizeItems(getItems(freshQuotation)));
      setEditNotes(freshQuotation.notes || "");
      setProducts(getResponseRows(productsResponse));
      setEditProductId("");
      setEditProductSearch("");
    } catch (err) {
      setEditError(err?.message || "Impossible de charger les informations du devis.");
    } finally {
      setProductsLoading(false);
    }
  }

  const availableEditProducts = products.filter((product) => {
    const query = editProductSearch.trim().toLowerCase();
    return !query || getProductName(product).toLowerCase().includes(query);
  });

  function addEditProduct() {
    const product = products.find((item) => String(item.id) === String(editProductId));

    if (!product) {
      setEditError("Veuillez sélectionner un produit.");
      return;
    }

    const existing = editItems.find((item) => String(item.product_id) === String(product.id));

    if (existing) {
      setEditItems((current) =>
        current.map((item) =>
          String(item.product_id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
            : item
        )
      );
    } else {
      const price = getProductPrice(product);
      setEditItems((current) => [
        ...current,
        {
          product_id: product.id,
          product_name: getProductName(product),
          quantity: 1,
          unit_price: price,
          subtotal: price,
        },
      ]);
    }

    setEditProductId("");
    setEditError("");
  }

  function updateEditQuantity(productId, quantity) {
    const parsed = Math.max(1, Number(quantity) || 1);
    setEditItems((current) =>
      current.map((item) =>
        String(item.product_id) === String(productId)
          ? { ...item, quantity: parsed, subtotal: parsed * item.unit_price }
          : item
      )
    );
  }

  function updateEditPrice(productId, price) {
    const parsed = Math.max(0, Number(price) || 0);
    setEditItems((current) =>
      current.map((item) =>
        String(item.product_id) === String(productId)
          ? { ...item, unit_price: parsed, subtotal: item.quantity * parsed }
          : item
      )
    );
  }

  function removeEditItem(productId) {
    setEditItems((current) => current.filter((item) => String(item.product_id) !== String(productId)));
  }

  // This saves the edited version in React state only.
  // It does NOT send a PUT/PATCH request to the backend.
  function saveEditLocally() {
    setEditError("");

    if (!editDraft?.id) {
      setEditError("Devis introuvable.");
      return;
    }

    if (editItems.length === 0) {
      setEditError("Ajoutez au moins un produit.");
      return;
    }

    const updatedQuotation = {
      ...editDraft,
      notes: editNotes.trim() || null,
      total: Number(editTotal.toFixed(2)),
      quotationItems: editItems.map((item) => ({
        ...item,
        product: {
          id: item.product_id,
          name: item.product_name,
        },
      })),
    };

    setQuotations((current) =>
      current.map((item) => item.id === updatedQuotation.id ? updatedQuotation : item)
    );

    setSelectedQuotation(updatedQuotation);
    setShowEditForm(false);
    setSuccess("Modifications appliquées à l'affichage. Elles ne sont pas enregistrées dans la base de données.");
  }

  function printQuotationDocument(quotation) {
    if (!quotation) return;

    setPrintQuotation({
      ...quotation,
      quotationItems: getItems(quotation),
    });
  }

  function changePage(page) {
    if (page < 1 || page > lastPage || page === currentPage) return;
    loadQuotations(page, statusFilter);
  }

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 15mm;
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          .quotation-print-area,
          .quotation-print-area * {
            visibility: visible !important;
          }

          .quotation-print-area {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: #172033 !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* MAIN PAGE */}
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 print:hidden">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
                <FileCheck size={15} />
                Gestion commerciale
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">Gestion des devis</h1>
              <p className="mt-1 text-sm text-slate-500">Créez et gérez les devis de vos produits.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => loadQuotations(currentPage, statusFilter)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                <RefreshCw size={16} /> Actualiser
              </button>
              <button type="button" onClick={openCreateForm} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123b61]">
                <Plus size={17} /> Ajouter un devis
              </button>
            </div>
          </div>

          {success && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <div className="flex items-center gap-2"><CheckCircle2 size={17} />{success}</div>
              <button type="button" onClick={() => setSuccess("")}><X size={16} /></button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={17} /> {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">En attente</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Acceptés</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{acceptedCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Refusés</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{rejectedCount}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-[#0A2540]">Liste des devis</h2>
                <p className="mt-1 text-xs text-slate-500">Suivi des devis créés.</p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative sm:w-64">
                  <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un devis..." className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
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
                <RefreshCw size={18} className="animate-spin" /> Chargement des devis...
              </div>
            ) : filteredQuotations.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <FileText size={35} className="mx-auto text-slate-300" />
                <p className="mt-3 font-semibold text-slate-700">Aucun devis trouvé</p>
                <p className="mt-1 text-sm text-slate-500">Cliquez sur Ajouter un devis pour créer votre premier devis.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">N° Devis</th>
                      <th className="px-5 py-4 font-semibold">Admin créateur</th>
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
                            <button type="button" onClick={() => openDetails(quotation)} className="font-semibold text-[#0A2540] hover:text-amber-600">
                              {getQuotationNumber(quotation)}
                            </button>
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-700">{getCreatorName(quotation)}</td>
                          <td className="px-5 py-4 text-slate-500">{formatDate(quotation.created_at)}</td>
                          <td className="px-5 py-4 font-semibold text-[#0A2540]">{formatMoney(quotation.total)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                              <StatusIcon size={13} /> {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" onClick={() => openDetails(quotation)} title="Voir les détails" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-blue-50">
                                <Eye size={16} />
                              </button>
                              <button type="button" onClick={async () => {
                                try {
                                  const response = await getQuotation(quotation.id);
                                  printQuotationDocument(unwrapQuotation(response));
                                } catch {
                                  setError("Impossible de préparer le devis pour impression.");
                                }
                              }} title="Imprimer" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-amber-50 hover:text-amber-700">
                                <Printer size={16} />
                              </button>
                              <button type="button" onClick={() => handleDelete(quotation)} disabled={deletingId === quotation.id} title="Supprimer" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
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
                <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1 || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40">
                  <ChevronLeft size={15} /> Précédent
                </button>
                <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage >= lastPage || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40">
                  Suivant <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5 print:hidden">
          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600"><FileCheck size={15} /> Gestion commerciale</div>
                <h2 className="mt-1 text-xl font-bold text-[#0A2540]">Créer un nouveau devis</h2>
                <p className="mt-1 text-sm text-slate-500">Ajoutez les produits et définissez leurs quantités.</p>
              </div>
              <button type="button" onClick={() => !creating && setShowCreateForm(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateQuotation}>
              <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-7">
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0A2540]"><User size={17} /> Informations de création</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div><p className="text-xs text-slate-500">Admin connecté</p><p className="mt-1 font-semibold text-slate-800">{admin?.name || admin?.full_name || "Chargement..."}</p></div>
                    <div><p className="text-xs text-slate-500">User ID</p><p className="mt-1 font-semibold text-slate-800">{admin?.id || "—"}</p></div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2"><Package size={18} className="text-amber-600" /><h3 className="font-semibold text-[#0A2540]">Sélectionner les produits</h3></div>
                  {productsLoading ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-10 text-sm text-slate-500"><RefreshCw size={17} className="animate-spin" /> Chargement des produits...</div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <div className="space-y-2">
                          <input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Rechercher un produit..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                          <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500">
                            <option value="">Sélectionner un produit</option>
                            {availableProducts.map((product) => <option key={product.id} value={product.id}>{getProductName(product)} — {formatMoney(getProductPrice(product))}</option>)}
                          </select>
                        </div>
                        <button type="button" onClick={addProduct} disabled={!selectedProductId || productsLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#123b61] disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17} /> Ajouter</button>
                      </div>
                      {products.length === 0 && <p className="mt-3 text-sm text-amber-700">Aucun produit disponible.</p>}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold text-[#0A2540]">Produits du devis</h3><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{quotationItems.length} produit(s)</span></div>
                  {quotationItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center"><Package size={30} className="mx-auto text-slate-300" /><p className="mt-2 font-medium text-slate-600">Aucun produit ajouté</p><p className="mt-1 text-xs text-slate-400">Sélectionnez un produit pour commencer.</p></div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full min-w-[650px] text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3 text-left font-semibold">Produit</th><th className="px-4 py-3 text-center font-semibold">Quantité</th><th className="px-4 py-3 text-right font-semibold">Prix unitaire</th><th className="px-4 py-3 text-right font-semibold">Sous-total</th><th className="px-4 py-3 text-center font-semibold">Action</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {quotationItems.map((item) => (
                            <tr key={item.product_id}>
                              <td className="px-4 py-4 font-medium text-slate-700">{item.product_name}</td>
                              <td className="px-4 py-4"><div className="flex items-center justify-center gap-2">
                                <button type="button" onClick={() => updateItemQuantity(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1} className="rounded-md border border-slate-200 p-1.5 text-slate-600 disabled:opacity-30"><Minus size={13} /></button>
                                <input type="number" min="1" value={item.quantity} onChange={(event) => updateItemQuantity(item.product_id, event.target.value)} className="w-16 rounded-md border border-slate-200 px-2 py-1.5 text-center outline-none focus:border-amber-500" />
                                <button type="button" onClick={() => updateItemQuantity(item.product_id, item.quantity + 1)} className="rounded-md border border-slate-200 p-1.5 text-slate-600"><Plus size={13} /></button>
                              </div></td>
                              <td className="px-4 py-4"><input type="number" min="0" step="0.01" value={item.unit_price} onChange={(event) => updateItemPrice(item.product_id, event.target.value)} className="ml-auto block w-28 rounded-md border border-slate-200 px-2 py-2 text-right outline-none focus:border-amber-500" /></td>
                              <td className="px-4 py-4 text-right font-semibold text-[#0A2540]">{formatMoney(item.subtotal)}</td>
                              <td className="px-4 py-4 text-center"><button type="button" onClick={() => removeItem(item.product_id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash size={16} /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0A2540]">Notes / Remarques</label>
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Ajouter des remarques facultatives..." className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Calculator size={17} /> Récapitulatif du devis</div>
                  <div className="mt-4 flex items-center justify-between"><span className="text-sm text-slate-500">Nombre de produits</span><span className="font-semibold text-slate-700">{quotationItems.length}</span></div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-4"><span className="font-semibold text-[#0A2540]">Total général</span><span className="text-2xl font-bold text-[#0A2540]">{formatMoney(total)}</span></div>
                </div>

                {formError && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{formError}</div>}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button type="button" onClick={() => setShowCreateForm(false)} disabled={creating} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Annuler</button>
                <button type="submit" disabled={creating || productsLoading || quotationItems.length === 0} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123b61] disabled:cursor-not-allowed disabled:opacity-50">
                  {creating ? <><RefreshCw size={16} className="animate-spin" /> Enregistrement...</> : <><Save size={16} /> Créer le devis</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedQuotation && !showEditForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 print:hidden" onClick={() => setSelectedQuotation(null)}>
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600"><FileCheck size={15} /> Détail du devis</div>
                <h2 className="mt-1 font-bold text-[#0A2540]">{getQuotationNumber(selectedQuotation)}</h2>
              </div>
              <button type="button" onClick={() => setSelectedQuotation(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={19} /></button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500"><RefreshCw size={18} className="animate-spin" /> Chargement des détails...</div>
            ) : (
              <div className="space-y-5 p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-4"><p className="flex items-center gap-2 text-xs text-slate-500"><User size={14} /> Admin créateur</p><p className="mt-2 font-semibold text-[#0A2540]">{getCreatorName(selectedQuotation)}</p></div>
                  <div className="rounded-lg bg-slate-50 p-4"><p className="flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} /> Date de création</p><p className="mt-2 font-semibold text-[#0A2540]">{formatDate(selectedQuotation.created_at)}</p></div>
                  <div className="rounded-lg bg-slate-50 p-4"><p className="flex items-center gap-2 text-xs text-slate-500"><CreditCard size={14} /> Montant total</p><p className="mt-2 font-bold text-[#0A2540]">{formatMoney(selectedQuotation.total)}</p></div>
                  <div className="rounded-lg bg-slate-50 p-4"><p className="flex items-center gap-2 text-xs text-slate-500"><FileText size={14} /> Numéro du devis</p><p className="mt-2 font-semibold text-[#0A2540]">{getQuotationNumber(selectedQuotation)}</p></div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Modifier le statut du devis</label>
                  <select value={selectedQuotation.status || "pending"} disabled={updatingStatus} onChange={(event) => handleStatusChange(selectedQuotation, event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 disabled:opacity-50">
                    <option value="pending">En attente</option><option value="accepted">Accepté</option><option value="rejected">Refusé</option>
                  </select>
                </div>

                {selectedQuotation.notes && <div className="rounded-lg border border-slate-200 p-4"><p className="text-xs font-semibold text-slate-500">Notes</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{selectedQuotation.notes}</p></div>}

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0A2540]"><Package size={17} /> Produits du devis</h3>
                  {getItems(selectedQuotation).length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">Aucun produit disponible dans ce devis.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full min-w-[500px] text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-3 py-3 text-left font-semibold">Produit</th><th className="px-3 py-3 text-center font-semibold">Quantité</th><th className="px-3 py-3 text-right font-semibold">Prix unitaire</th><th className="px-3 py-3 text-right font-semibold">Sous-total</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {getItems(selectedQuotation).map((item, index) => (
                            <tr key={item.id || `${item.product_id}-${index}`}>
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

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div><p className="text-xs text-slate-500">Total du devis</p><p className="mt-1 text-xl font-bold text-[#0A2540]">{formatMoney(selectedQuotation.total)}</p></div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => printQuotationDocument(selectedQuotation)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-amber-50"><Printer size={16} /> Imprimer</button>
                    <button type="button" onClick={() => openEditForm(selectedQuotation)} className="inline-flex items-center gap-2 rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#123b61]"><Pencil size={16} /> Modifier</button>
                    <button type="button" onClick={() => setSelectedQuotation(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Fermer</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditForm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5 print:hidden">
          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600"><Pencil size={15} /> Modification</div>
                <h2 className="mt-1 text-xl font-bold text-[#0A2540]">Modifier {getQuotationNumber(editDraft || selectedQuotation)}</h2>
                <p className="mt-1 text-xs text-amber-700">Les changements sont temporaires et ne seront pas enregistrés dans la base de données.</p>
              </div>
              <button type="button" onClick={() => setShowEditForm(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500"><RefreshCw size={18} className="animate-spin" /> Chargement...</div>
            ) : (
              <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-7">
                <div>
                  <h3 className="mb-3 font-semibold text-[#0A2540]">Ajouter un produit</h3>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-2">
                      <input value={editProductSearch} onChange={(event) => setEditProductSearch(event.target.value)} placeholder="Rechercher un produit..." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
                      <select value={editProductId} onChange={(event) => setEditProductId(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500">
                        <option value="">Sélectionner un produit</option>
                        {availableEditProducts.map((product) => <option key={product.id} value={product.id}>{getProductName(product)} — {formatMoney(getProductPrice(product))}</option>)}
                      </select>
                    </div>
                    <button type="button" onClick={addEditProduct} disabled={!editProductId} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#123b61] disabled:opacity-50"><Plus size={16} /> Ajouter</button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-[#0A2540]">Produits du devis</h3>
                  {editItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">Aucun produit dans le devis.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full min-w-[650px] text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3 text-left">Produit</th><th className="px-4 py-3 text-center">Quantité</th><th className="px-4 py-3 text-right">Prix unitaire</th><th className="px-4 py-3 text-right">Sous-total</th><th className="px-4 py-3 text-center">Action</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {editItems.map((item, index) => (
                            <tr key={`${item.product_id}-${index}`}>
                              <td className="px-4 py-4 font-medium text-slate-700">{item.product_name}</td>
                              <td className="px-4 py-4"><input type="number" min="1" value={item.quantity} onChange={(event) => updateEditQuantity(item.product_id, event.target.value)} className="mx-auto block w-20 rounded-md border border-slate-200 px-2 py-2 text-center outline-none focus:border-amber-500" /></td>
                              <td className="px-4 py-4"><input type="number" min="0" step="0.01" value={item.unit_price} onChange={(event) => updateEditPrice(item.product_id, event.target.value)} className="ml-auto block w-28 rounded-md border border-slate-200 px-2 py-2 text-right outline-none focus:border-amber-500" /></td>
                              <td className="px-4 py-4 text-right font-semibold text-[#0A2540]">{formatMoney(item.subtotal)}</td>
                              <td className="px-4 py-4 text-center"><button type="button" onClick={() => removeEditItem(item.product_id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0A2540]">Notes / Remarques</label>
                  <textarea value={editNotes} onChange={(event) => setEditNotes(event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-500" placeholder="Notes du devis..." />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Calculator size={17} /> Nouveau total</div>
                  <div className="mt-3 flex items-center justify-between"><span className="font-semibold text-[#0A2540]">Total général</span><span className="text-2xl font-bold text-[#0A2540]">{formatMoney(editTotal)}</span></div>
                </div>

                {editError && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={17} /> {editError}</div>}
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button type="button" onClick={() => setShowEditForm(false)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button>
              <button type="button" onClick={saveEditLocally} disabled={productsLoading || !editDraft} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#123b61] disabled:opacity-50"><Save size={16} /> Appliquer les modifications</button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT DOCUMENT */}
      {printQuotation && (
        <div className="quotation-print-area hidden bg-white p-8 text-slate-900 print:block">
          <div className="flex items-start justify-between border-b-2 border-[#0A2540] pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-[#0A2540]">DEVIS</h1>
              <p className="mt-2 text-sm text-slate-500">Document commercial</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#0A2540]">{getQuotationNumber(printQuotation)}</p>
              <p className="mt-2 text-sm text-slate-600">Date : {formatDate(printQuotation.created_at)}</p>
              <p className="mt-1 text-sm text-slate-600">Statut : {statusConfig[printQuotation.status]?.label || "En attente"}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Émis par</p>
              <p className="mt-2 font-semibold text-[#0A2540]">{getCreatorName(printQuotation)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Référence du devis</p>
              <p className="mt-2 font-semibold text-[#0A2540]">{getQuotationNumber(printQuotation)}</p>
            </div>
          </div>

          <table className="mt-10 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#0A2540] text-white">
                <th className="border border-[#0A2540] px-3 py-3 text-left">Désignation</th>
                <th className="border border-[#0A2540] px-3 py-3 text-center">Quantité</th>
                <th className="border border-[#0A2540] px-3 py-3 text-right">Prix unitaire</th>
                <th className="border border-[#0A2540] px-3 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {getItems(printQuotation).map((item, index) => (
                <tr key={item.id || `${item.product_id}-${index}`}>
                  <td className="border border-slate-300 px-3 py-3">{item.product?.name || item.product_name || `Produit #${item.product_id || "—"}`}</td>
                  <td className="border border-slate-300 px-3 py-3 text-center">{item.quantity}</td>
                  <td className="border border-slate-300 px-3 py-3 text-right">{formatMoney(item.unit_price)}</td>
                  <td className="border border-slate-300 px-3 py-3 text-right font-semibold">{formatMoney(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-72 border-t-2 border-[#0A2540] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0A2540]">TOTAL TTC</span>
                <span className="text-xl font-bold text-[#0A2540]">{formatMoney(printQuotation.total)}</span>
              </div>
            </div>
          </div>

          {printQuotation.notes && (
            <div className="mt-10 rounded border border-slate-300 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Notes et conditions</p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{printQuotation.notes}</p>
            </div>
          )}

          <div className="mt-20 grid grid-cols-2 gap-10">
            <div className="border-t border-slate-400 pt-3 text-center text-sm text-slate-600">Signature et cachet</div>
            <div className="border-t border-slate-400 pt-3 text-center text-sm text-slate-600">Bon pour accord</div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
            Merci pour votre confiance.
          </div>

          <div className="no-print mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white"><Printer size={16} /> Imprimer / PDF</button>
            <button type="button" onClick={() => setPrintQuotation(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}
