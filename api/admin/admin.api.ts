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

