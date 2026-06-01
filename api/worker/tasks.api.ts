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

