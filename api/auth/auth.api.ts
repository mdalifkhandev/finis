import { api } from "@/lib/api/client";
import type {
  ApiResponse,
  AuthResponse,
  AuthSession,
  InviteUserData,
  LoginPayload,
  User,
} from "@/types/auth.types";

function normalizeUser(user: Partial<User> & { email: string; id: string }): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.fullName ?? user.email,
    fullName: user.fullName ?? user.name ?? user.email,
    role: user.role,
    avatarUrl: user.avatarUrl ?? null,
    phone: user.phone ?? null,
  };
}

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await api.post<ApiResponse<AuthSession | AuthResponse>>(
    "/auth/login",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Login failed");
  }

  const authData = data.data as AuthSession | AuthResponse;

  if ("accessToken" in authData) {
    return {
      token: authData.accessToken,
      user: normalizeUser(authData.user),
    };
  }

  return {
    token: authData.token,
    user: normalizeUser(authData.user),
  };
};

export const logoutRequest = async () => {
  const { data } = await api.post<ApiResponse<null>>("/auth/logout");

  if (!data.success) {
    throw new Error(data.message || "Logout failed");
  }

  return data.message || "Logout successful";
};

export const meRequest = async () => {
  const { data } = await api.get<ApiResponse<User>>("/auth/me");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return normalizeUser(data.data);
};

export const inviteRequest = async (payload: InviteUserData) => {
  const { data } = await api.post<ApiResponse<null>>("/auth/invite", payload);

  if (!data.success) {
    throw new Error(data.message || "Invite failed");
  }

  return data.message || "Invite sent";
};
