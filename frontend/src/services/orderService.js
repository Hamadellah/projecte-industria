
import { apiRequest } from "./api";

export function getOrders(page = 1, status = "") {
  const params = new URLSearchParams({ page: String(page) });

  if (status) {
    params.set("status", status);
  }

  return apiRequest(`/admin/orders?${params.toString()}`);
}

export function getOrder(id) {
  return apiRequest(`/admin/orders/${id}`);
}

export function updateOrderStatus(id, status) {
  return apiRequest(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
