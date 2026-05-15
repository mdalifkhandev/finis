import type { ApiResponse } from "./index";

export type { ApiResponse } from "./index";

export type AuthUser = {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  role: "admin" | "worker" | "manager" | string;
  status?: string;
  avatarUrl: string | null;
  tenantId: string | null;
  department?: string | null;
  joinDate?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string | null;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type LoginCredentials = {
  identifier: string;
  password: string;
};

export type AuthResponse<T> = ApiResponse<T>;
