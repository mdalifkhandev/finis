import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type {
  AdminDashboardData,
  AdminDashboardResponse,
} from "@/types/api/admin";

function resolveMediaUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function getAdminDashboard() {
  const { data } = await api.get<AdminDashboardResponse>("/admin/dashboard");

  if (!data.success) {
    throw new Error(data.message || "Failed to load dashboard");
  }

  return {
    ...data.data,
    workersOnSite: {
      ...data.data.workersOnSite,
      data: data.data.workersOnSite.data.map((worker) => ({
        ...worker,
        avatarUrl: resolveMediaUrl(worker.avatarUrl),
      })),
    },
  } as AdminDashboardData;
}
