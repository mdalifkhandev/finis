import { api } from "@/lib/api/client";
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
  return path;
}

export async function getChatUserProfile(userId: string) {
  const { data } = await api.get<ApiResponse<ChatUserProfile>>(`/public/users/${userId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load user profile");
  }

  return {
    ...data.data,
    avatarUrl: data.data.avatarUrl,
  };
}
