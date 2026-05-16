import type { ApiResponse } from "./auth.types";

export type AdminDashboardStats = {
  activeProjects: number;
  workersOnSite: number;
  payrollPending: number;
  inventoryAlerts: number;
};

export type AdminDashboardProject = {
  id: string;
  name: string;
  status: string;
  progress: number;
  endDate: string;
  companyName: string;
  teamCount: number;
};

export type AdminDashboardWorker = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  checkInTime: string;
};

export type AdminActiveWorker = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  checkInTime: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type PaginatedDashboardList<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AdminDashboardData = {
  stats: AdminDashboardStats;
  activeProjects: PaginatedDashboardList<AdminDashboardProject>;
  workersOnSite: PaginatedDashboardList<AdminDashboardWorker>;
  pendingInvitations: PaginatedDashboardList<unknown>;
};

export type AdminDashboardResponse = ApiResponse<AdminDashboardData>;
export type AdminActiveWorkersResponse = ApiResponse<AdminActiveWorker[]>;
export type AdminActiveProjectsResponse = ApiResponse<AdminDashboardProject[]>;
