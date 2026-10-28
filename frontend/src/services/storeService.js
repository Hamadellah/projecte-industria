
import { apiRequest } from "./api";

// Categories publiques du site
export function getStoreCategories() {
  return apiRequest("/categories");
}

// Produits publics du site
export function getStoreProducts() {
  return apiRequest("/products");
}

// Détails d'un produit
export function getStoreProduct(id) {
  return apiRequest(`/products/${id}`);
}
