import type { AdminCompany } from "./admin.types";
import type { ApiResponse } from "./auth.types";

export type CompanyLogoFile = {
  uri: string;
  name: string;
  type: string;
};

export type CreateCompanyPayload = {
  name: string;
  industry: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  revenue: string;
  projectLevel: string;
  logo?: CompanyLogoFile | null;
};

export type UpdateCompanyPayload = CreateCompanyPayload;

export type CreateCompanyResponse = ApiResponse<AdminCompany>;

export type CreateProjectPayload = {
  name: string;
  companyId: string;
  type: string;
  startDate: string;
  endDate: string;
  budget: number;
  location: string;
  description: string;
  numFloors?: number;
  roomsPerFloor?: number;
  isWholeHouse?: boolean;
  houseSections?: string[];
  autoGenerateFloors: boolean;
};

export type CompanyProjectTeamMemberUser = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};

export type CompanyProjectTeamMember = {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  managerId: string | null;
  createdAt: string;
  user: CompanyProjectTeamMemberUser;
};

export type CompanyProject = {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  location: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  _count: {
    teamMembers: number;
    tasks: number;
  };
  teamMembers: CompanyProjectTeamMember[];
};

export type CompanyProjectsResponse = ApiResponse<CompanyProject[]>;

export type ProjectProfileClient = {
  companyId: string;
  companyName: string;
  logoUrl: string | null;
  phone: string;
  email: string;
  website: string;
  address: string;
  primaryContact: string | null;
};

export type ProjectProfile = {
  id: string;
  name: string;
  type: string;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  progress: number;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isWholeHouse?: boolean;
  houseSections?: string[];
  numFloors: number;
  roomsPerFloor: number;
  budget: number;
  spent: number;
  remaining: number;
  client: ProjectProfileClient;
  counts: {
    tasks: number;
    teamMembers: number;
    floors: number;
  };
};

export type ProjectProfileResponse = ApiResponse<ProjectProfile>;

export type UpdateProjectPayload = {
  name: string;
  status: string;
  spent: string;
  progress: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  location?: string;
  description?: string;
  numFloors?: number;
  roomsPerFloor?: number;
  isWholeHouse?: boolean;
  houseSections?: string[];
};

export type CompanyContactProject = {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
};

export type CompanyContact = {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  systemRole: string;
  projects: CompanyContactProject[];
};

export type CompanyContactsResponse = ApiResponse<CompanyContact[]>;
