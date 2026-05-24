import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type {
  ApiResponse,
  AuthResponse,
  AuthSession,
  ForgotPasswordData,
  ForgotPasswordResponse,
  InviteUserData,
  LoginPayload,
  ResetPasswordData,
  VerifyOtpData,
  VerifyOtpResponse,
  User,
} from "@/types/auth.types";

function normalizeUser(
  user: Partial<User> & { email: string; id: string },
): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.fullName ?? user.email,
    fullName: user.fullName ?? user.name ?? user.email,
    role: user.role,
    avatarUrl: resolveMediaUrl(user.avatarUrl) ?? null,
    phone: user.phone ?? null,
  };
}

function resolveMediaUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
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

  return normalizeUser({
    ...data.data,
    avatarUrl: resolveMediaUrl(data.data.avatarUrl) ?? data.data.avatarUrl,
  });
};

export const inviteRequest = async (payload: InviteUserData) => {
  const { data } = await api.post<ApiResponse<null>>("/auth/invite", payload);

  if (!data.success) {
    throw new Error(data.message || "Invite failed");
  }

  return data.message || "Invite sent";
};

export const forgotPasswordRequest = async (payload: ForgotPasswordData) => {
  const { data } = await api.post<ApiResponse<ForgotPasswordResponse>>(
    "/auth/forgot-password",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to send reset code");
  }

  return data.data;
};

export const verifyOtpRequest = async (payload: VerifyOtpData) => {
  const { data } = await api.post<ApiResponse<VerifyOtpResponse>>(
    "/auth/verify-otp",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data.data;
};

export const resetPasswordRequest = async (payload: ResetPasswordData) => {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/reset-password",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Password reset failed");
  }

  return data.message || "Password updated";
};

export type ChangePasswordPayload = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export const changePasswordRequest = async (payload: ChangePasswordPayload) => {
  const { data } = await api.post<ApiResponse<any>>("/auth/change-password", payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to change password");
  }

  return data.data;
};

