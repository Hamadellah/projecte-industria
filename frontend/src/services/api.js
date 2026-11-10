const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // N-choufo wash l-body li da5el howa FormData wla la
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      // Ila kant FormData, MAT-zidch "Content-Type": "application/json"
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // N-siffto data kamla dyal l-errors (bch tban lina f catch ila kan 422)
    const error = new Error(data.message || `Erreur HTTP : ${response.status}`);
    error.response = { data };
    throw error;
  }

  return data;
}