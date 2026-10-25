
import { apiRequest } from "./api";

export function getCategories() {
  return apiRequest("/admin/categories");
}

export function createCategory(category) {
  return apiRequest("/admin/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

export function updateCategory(id, category) {
  return apiRequest(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
}

export function deleteCategory(id) {
  return apiRequest(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}
