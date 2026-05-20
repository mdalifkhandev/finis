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

export type ApiMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export type AdminCompany = {
  id: string;
  name: string;
  industry: string;
  revenue: number;
  projectLevel: string;
  address: string;
  website: string;
  phone: string;
  email: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    projects: number;
    members: number;
  };
};

export type AdminCompaniesResponse = ApiResponse<AdminCompany[]> & {
  meta: ApiMeta;
};

export type AdminCompanyDetail = AdminCompany & {
  tenantId: string | null;
  ownerId: string;
  description: string;
  updatedAt: string;
  certifications: unknown[];
};

export type AdminCompanyDetailResponse = ApiResponse<AdminCompanyDetail>;

export type AdminProjectProfile = {
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
  location: string;
  description: string;
  numFloors: number;
  roomsPerFloor: number;
  budget: number;
  spent: number;
  remaining: number;
  client: {
    companyId: string;
    companyName: string;
    logoUrl: string | null;
    phone: string;
    email: string;
    website: string;
    address: string;
    primaryContact: string | null;
  };
  counts: {
    tasks: number;
    teamMembers: number;
    floors: number;
  };
};

export type AdminProjectProfileResponse = ApiResponse<AdminProjectProfile>;
