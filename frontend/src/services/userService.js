
import { apiRequest } from "./api";

export function getUsers(page = 1) {
  return apiRequest(`/admin/users?page=${page}`);
}

export function updateUserRole(id, role) {
  return apiRequest(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function deleteUser(id) {
  return apiRequest(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
