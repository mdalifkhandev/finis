export type User = {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role?: string;
  avatarUrl?: string | null;
  phone?: string | null;
};

export type LoginPayload = {
  email?: string;
  identifier?: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthSession = {
  accessToken: string;
  user: User;
};

export type InviteUserData = {
  email: string;
  role: "admin" | "manager" | "worker" | string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};
