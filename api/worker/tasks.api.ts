import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types/auth.types";

export type WorkerTaskDetail = {
  id: string;
  projectId: string;
  floorId: string | null;
  roomId: string | null;
  assignedTo: string;
  createdBy: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    location: string | null;
    geofences: any[];
  };
  floor: {
    id: string;
    name: string;
    floorNumber: number;
  } | null;
  room: {
    id: string;
    name: string;
    type: string | null;
  } | null;
  creator: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  reports: any[];
  taskInventories: any[];
};

export async function getWorkerTaskById(id: string) {
  const { data } = await api.get<ApiResponse<WorkerTaskDetail>>(`/worker/tasks/${id}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch task details");
  }
  return data.data;
}

export async function startWorkerTask(id: string) {
  const { data } = await api.post<ApiResponse<any>>(`/worker/tasks/${id}/start`);
  if (!data.success) {
    throw new Error(data.message || "Failed to start task");
  }
  return data.data;
}

export async function reportWorkerTaskBeforePhoto(id: string, imageUri: string) {
  const formData = new FormData();
  formData.append("beforePhoto", {
    uri: imageUri,
    name: "before_photo.jpg",
    type: "image/jpeg",
  } as any);

  const { data } = await api.post<ApiResponse<any>>(`/worker/tasks/${id}/report`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Failed to upload photo");
  }
  return data.data;
}

export type TaskInventoryItem = {
  id: string;
  name: string;
  category: string;
  currentQty: number;
  unit: string;
  location: string | null;
};

export async function getWorkerTaskInventory(taskId: string) {
  const { data } = await api.get<ApiResponse<TaskInventoryItem[]>>(`/worker/tasks/${taskId}/inventory`);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch task inventory");
  }
  return data.data;
}
