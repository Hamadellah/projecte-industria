
import { apiRequest } from "./api";

export function getProducts() {
  return apiRequest("/admin/products");
}

export function createProduct(product) {
  return apiRequest("/admin/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return apiRequest(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/admin/products/${id}`, {
    method: "DELETE",
  });
}
