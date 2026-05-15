import type { ApiResponse } from "./index";

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
