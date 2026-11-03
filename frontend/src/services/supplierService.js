
import { apiRequest } from "./api";

export function getSuppliers() {
  return apiRequest("/admin/suppliers");
}

export function getSupplier(id) {
  return apiRequest(`/admin/suppliers/${id}`);
}

export function createSupplier(supplier) {
  return apiRequest("/admin/suppliers", {
    method: "POST",
    body: JSON.stringify(supplier),
  });
}

export function updateSupplier(id, supplier) {
  return apiRequest(`/admin/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(supplier),
  });
}

export function deleteSupplier(id) {
  return apiRequest(`/admin/suppliers/${id}`, {
    method: "DELETE",
  });
}
