
import { apiRequest } from "./api";

// Get all quotations
export function getQuotations(page = 1, status = "") {
  const params = new URLSearchParams({ page: String(page) });

  if (status) params.set("status", status);

  return apiRequest(`/admin/quotations?${params.toString()}`);
}

// Get one quotation
export function getQuotation(id) {
  return apiRequest(`/admin/quotations/${id}`);
}

// Create quotation
export function createQuotation(data) {
  return apiRequest("/admin/quotations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update quotation status
export function updateQuotationStatus(id, status) {
  return apiRequest(`/admin/quotations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Delete quotation
export function deleteQuotation(id) {
  return apiRequest(`/admin/quotations/${id}`, {
    method: "DELETE",
  });
}

// Get products for quotation form
export function getQuotationProducts(page = 1) {
  return apiRequest(`/admin/products?page=${page}`);
}

// Get currently authenticated admin
export function getCurrentAdmin() {
  return apiRequest("/user");
}
