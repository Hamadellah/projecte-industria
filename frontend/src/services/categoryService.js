import { apiRequest } from "./api";

export function getCategories() {
  return apiRequest("/admin/categories");
}

export function createCategory(categoryData) {
  const isFormData = categoryData instanceof FormData;

  return apiRequest("/admin/categories", {
    method: "POST",
    body: isFormData ? categoryData : JSON.stringify(categoryData),
  });
}

export function updateCategory(id, categoryData) {
  const isFormData = categoryData instanceof FormData;

  return apiRequest(`/admin/categories/${id}`, {
    method: "POST", // Kanst3mlo POST m3a _method=PUT f FormData 3la 9bel les fichiers f Laravel
    body: isFormData ? categoryData : JSON.stringify(categoryData),
  });
}

export function deleteCategory(id) {
  return apiRequest(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}