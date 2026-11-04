import { apiRequest } from "./api";

export function getQuotations(page = 1, status = "") {
  const params = new URLSearchParams({ page: String(page) });

  if (status) params.set("status", status);

  return apiRequest(`/admin/quotations?${params.toString()}`);
}

export function getQuotation(id) {
  return apiRequest(`/admin/quotations/${id}`);
}

export function updateQuotationStatus(id, status) {
  return apiRequest(`/admin/quotations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteQuotation(id) {
  return apiRequest(`/admin/quotations/${id}`, {
    method: "DELETE",
  });
}