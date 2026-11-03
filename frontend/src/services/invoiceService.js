
import { apiRequest } from "./api";

export function getInvoices(page = 1, status = "") {
  const params = new URLSearchParams({ page: String(page) });

  if (status) {
    params.set("status", status);
  }

  return apiRequest(`/admin/invoices?${params.toString()}`);
}

export function getInvoice(id) {
  return apiRequest(`/admin/invoices/${id}`);
}

export function updateInvoiceStatus(id, status) {
  return apiRequest(`/admin/invoices/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
