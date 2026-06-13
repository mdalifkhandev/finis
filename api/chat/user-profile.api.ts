import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type { ApiResponse } from "@/types/auth.types";

export type ChatUserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  status: string;
  department: string | null;
  employeeId: string | null;
  joinDate: string | null;
  createdAt: string;
};

function resolveMediaUrl(path: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function getChatUserProfile(userId: string) {
  const { data } = await api.get<ApiResponse<ChatUserProfile>>(`/public/users/${userId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load user profile");
  }

  return {
    ...data.data,
    avatarUrl: resolveMediaUrl(data.data.avatarUrl),
  };
}
