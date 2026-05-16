import type { ApiResponse } from "./auth.types";
import type { AdminCompany } from "./admin.types";

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
  _count: {
    teamMembers: number;
    tasks: number;
  };
  teamMembers: CompanyProjectTeamMember[];
};

export type CompanyProjectsResponse = ApiResponse<CompanyProject[]>;
