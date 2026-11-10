import { apiRequest } from "./api";

export function getProducts() {
  return apiRequest("/admin/products");
}

export function createProduct(productData) {
  // Ila kant FormData (fiha fichiers), ma-ndiroch JSON.stringify
  const isFormData = productData instanceof FormData;

  return apiRequest("/admin/products", {
    method: "POST",
    body: isFormData ? productData : JSON.stringify(productData),
    // L-apiRequest dyalk itha kant k-t-zid Content-Type rassa, khassha t-habssha ila kan body FormData
  });
}

export function updateProduct(id, productData) {
  const isFormData = productData instanceof FormData;

  return apiRequest(`/admin/products/${id}`, {
    method: "POST", // Kanst3mlo POST m3a _method=PUT f FormData 3la 9bel les fichiers f Laravel
    body: isFormData ? productData : JSON.stringify(productData),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/admin/products/${id}`, {
    method: "DELETE",
  });
}