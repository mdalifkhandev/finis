import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type {
  AdminActiveWorker,
  AdminActiveWorkersResponse,
  AdminActiveProjectsResponse,
  AdminDashboardData,
  AdminDashboardResponse,
  AdminDashboardWorker,
} from "@/types/admin.types";

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
      data: data.data.workersOnSite.data.map((worker: AdminDashboardWorker) => ({
        ...worker,
        avatarUrl: resolveMediaUrl(worker.avatarUrl),
      })),
    },
  } as AdminDashboardData;
}

type ActiveWorkersParams = {
  page?: number;
  limit?: number;
};

export async function getActiveWorkers(params: ActiveWorkersParams = {}) {
  const { page = 1, limit = 10 } = params;
  const { data } = await api.get<AdminActiveWorkersResponse>(
    "/admin/dashboard/active-workers",
    {
      params: { page, limit },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load workers");
  }

  return data.data.map((worker: AdminActiveWorker) => ({
    ...worker,
    avatarUrl: resolveMediaUrl(worker.avatarUrl),
  }));
}

type ActiveProjectsParams = {
  page?: number;
  limit?: number;
};

export async function getActiveProjects(params: ActiveProjectsParams = {}) {
  const { page = 1, limit = 10 } = params;
  const { data } = await api.get<AdminActiveProjectsResponse>(
    "/admin/dashboard/active-projects",
    {
      params: { page, limit },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load projects");
  }

  return data.data;
}
