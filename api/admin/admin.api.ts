import { api } from "@/lib/api/client";
import type {
  AdminActiveWorker,
  AdminActiveWorkersResponse,
  AdminActiveProjectsResponse,
  AdminDashboardData,
  AdminDashboardResponse,
  AdminDashboardWorker,
  AdminProjectProfileResponse,
} from "@/types/admin.types";

function resolveMediaUrl(path: string | null) {
  return path;
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
        avatarUrl: worker.avatarUrl,
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
    avatarUrl: worker.avatarUrl,
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

export async function getAdminProjects() {
  const { data } = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      priority: string | null;
      isWholeHouse: boolean;
      houseSections: any[];
      progress: number;
      startDate: string;
      endDate: string;
      budget: number;
      spent: number | null;
      remaining: number | null;
      location: string;
      numFloors: number;
      roomsPerFloor: number;
      company: {
        id: string;
        name: string;
        logoUrl: string | null;
      };
      _count: {
        floors: number;
        tasks: number;
        teamMembers: number;
      };
      teamMembers: Array<{
        id: string;
        projectId: string;
        userId: string;
        role: string;
        managerId: string | null;
        createdAt: string;
        user: {
          id: string;
          fullName: string;
          avatarUrl: string | null;
        };
      }>;
    }>;
  }>("/admin/projects");

  if (!data.success) {
    throw new Error(data.message || "Failed to load projects");
  }

  return data.data.map((project) => ({
    ...project,
    company: {
      ...project.company,
      logoUrl: project.company.logoUrl,
    },
    teamMembers: project.teamMembers.map((member) => ({
      ...member,
      user: {
        ...member.user,
        avatarUrl: member.user.avatarUrl,
      },
    })),
  }));
}

export async function getAdminProjectNames() {
  const { data } = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: Array<{
      id: string;
      name: string;
    }>;
  }>("/admin/projects/names");

  if (!data.success) {
    throw new Error(data.message || "Failed to load project names");
  }

  return data.data;
}

export async function getProjectProfile(id: string) {
  const { data } = await api.get<AdminProjectProfileResponse>(
    `/admin/projects/${id}/profile`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load project profile");
  }

  return data.data;
}

export type AdminProfileResponse = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  status: string;
  dateOfBirth: string | null;
  address: string | null;
  bio: string | null;
  department: string | null;
  employeeId: string | null;
  joinDate: string | null;
  lastLoginAt: string | null;
  createdAt: string;
};

export async function getAdminProfile() {
  const { data } = await api.get<{ success: boolean; message: string; data: AdminProfileResponse; statusCode: number }>("/admin/profile");
  
  if (!data.success) {
    throw new Error(data.message || "Failed to load admin profile");
  }
  
  return {
    ...data.data,
    avatarUrl: data.data.avatarUrl
  };
}

export type AdminWorkerSummaryProject = {
  projectId: string;
  projectName: string;
  endDate: string;
  status: string;
  company: {
    id: string;
    name: string;
  };
  workerCount: number;
  teamMemberCount: number;
};

export type AdminSubscriptionHistoryPlan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  maxCompanies: number;
  maxProjects: number;
  maxUsers: number;
  hasGeofencing: boolean;
  hasAdvancedReporting: boolean;
  hasCustomReporting: boolean;
  hasWhiteLabel: boolean;
  supportLevel: string;
};

export type AdminSubscriptionHistoryItem = {
  id: string;
  planId: string;
  planName: string;
  interval: "monthly" | "yearly" | string;
  amount: number;
  status: string;
  startedAt: string;
  endedAt: string | null;
  canceledAt: string | null;
  plan: AdminSubscriptionHistoryPlan;
};

export type AdminSubscriptionHistoryCurrent = {
  planName: string;
  subscriptionStatus: string;
  planInterval: "monthly" | "yearly" | string;
  amount: number;
  startDate: string | null;
  daysLeft: number | null;
  currentPeriodEnd: string | null;
  isActive: boolean;
  isExpired: boolean;
  permissions: {
    companies: {
      used: number | null;
      max: number;
      unlimited: boolean;
    };
    projects: {
      used: number | null;
      max: number;
      unlimited: boolean;
    };
    users: {
      used: number | null;
      max: number;
      unlimited: boolean;
    };
    features: {
      geofencing: boolean;
      advancedReporting: boolean;
      customReporting: boolean;
      whiteLabel: boolean;
    };
  };
};

export type AdminSubscriptionHistoryResponse = {
  tenantId: string;
  current: AdminSubscriptionHistoryCurrent;
  history?: AdminSubscriptionHistoryItem[];
};

export async function getAdminSubscriptionHistory() {
  const { data } = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: AdminSubscriptionHistoryResponse;
  }>("/admin/subscription/history");

  if (!data.success) {
    throw new Error(data.message || "Failed to load subscription history");
  }

  return data.data;
}

export type AdminWorkerSummaryResponse = {
  totalProjects: number;
  projects: AdminWorkerSummaryProject[];
};

export async function getAdminWorkerSummary() {
  const { data } = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: AdminWorkerSummaryResponse;
  }>("/admin/projects/worker-summary");

  if (!data.success) {
    throw new Error(data.message || "Failed to load worker summary");
  }

  return data.data;
}

