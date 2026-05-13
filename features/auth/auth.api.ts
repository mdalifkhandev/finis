import { api } from "@/lib/api/client";
import type {
  ApiResponse,
  AuthSession,
  LoginCredentials,
} from "./auth.types";

function normalizeSession(session: AuthSession): AuthSession {
  return {
    accessToken: session.accessToken,
    user: {
      ...session.user,
      fullName: session.user.fullName.trim(),
    },
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
