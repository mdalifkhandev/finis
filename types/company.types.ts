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
