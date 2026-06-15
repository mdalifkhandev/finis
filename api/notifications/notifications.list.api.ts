import { api } from "@/lib/api/client";

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  refId: string | null;
  refType: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getMyNotifications() {
  const { data } = await api.get<{ success: boolean; message: string; data: AppNotification[] }>(
    "/notifications/my",
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load notifications");
  }

  return data.data;
}
