
import { apiRequest } from "./api";

export function getDashboard() {
  return apiRequest("/admin/dashboard");
}
