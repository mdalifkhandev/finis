import { api } from "@/lib/api/client";
import type {
  ApiResponse,
  AuthSession,
  AuthUser,
  LoginCredentials,
} from "./auth.types";

function normalizeSession(session: AuthSession): AuthSession {
  return {
    accessToken: session.accessToken,
    user: normalizeUser(session.user),
  };
}

function normalizeUser(user: AuthUser): AuthUser {
  return {
    ...user,
    fullName: user.fullName.trim(),
  };
}

export async function loginRequest(credentials: LoginCredentials) {
  const { data } = await api.post<ApiResponse<AuthSession>>(
    "/auth/login",
    credentials,
  );

  if (!data.success) {
    throw new Error(data.message || "Login failed");
  }

  return normalizeSession(data.data);
}

export async function logoutRequest() {
  const { data } = await api.post<ApiResponse<null>>("/auth/logout");

  if (!data.success) {
    throw new Error(data.message || "Logout failed");
  }

  return data.message || "Logout successful";
}

export async function meRequest() {
  const { data } = await api.get<ApiResponse<AuthUser>>("/auth/me");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return normalizeUser(data.data);
}
