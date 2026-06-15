import { api } from "@/lib/api/client";

export async function saveDeviceToken(payload: {
  token: string;
  platform?: string;
}) {
  const { data } = await api.post<{ success: boolean; message: string }>(
    "/notifications/device-token",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to save device token");
  }

  return data;
}
