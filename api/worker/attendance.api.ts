import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth.types";

export type WorkerAttendanceSession = {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  hoursWorked: number | null;
  zoneSeconds?: number | null;
  outsideSeconds?: number | null;
};

export type WorkerTodayAttendance = {
  date: string;
  status: "not_recorded" | "clocked_in" | "clocked_out";
  sessions: WorkerAttendanceSession[];
  totalHours: number;
  currentSessionStart: string | null;
};

export type WorkerProjectOption = {
  projectId: string;
  projectName: string;
  status: string;
  location: string | null;
  hasZone: boolean;
  zoneName: string | null;
};

export async function getTodayAttendance() {
  const { data } = await api.get<ApiResponse<WorkerTodayAttendance>>("/worker/attendance/today");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch attendance");
  }

  return data.data;
}

export async function checkInWorker(payload?: { projectId?: string; lat?: number; lng?: number }) {
  const { data } = await api.post<ApiResponse<{ sessionId: string; message: string }>>(
    "/worker/attendance/check-in",
    payload ?? {},
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to check in");
  }

  return data.data;
}

export async function getWorkerProjects() {
  const { data } = await api.get<ApiResponse<WorkerProjectOption[]>>("/worker/projects");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch worker projects");
  }

  return data.data;
}

export async function checkOutWorker(payload?: { lat?: number; lng?: number }) {
  const { data } = await api.post<ApiResponse<{ message: string; totalHoursToday: number }>>(
    "/worker/attendance/check-out",
    payload ?? {},
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to check out");
  }

  return data.data;
}

export type WorkerLocationUpdatePayload = {
  lat: number;
  lng: number;
  geofenceId?: string;
  eventType?: "enter" | "exit" | "update";
};

export type WorkerLocationUpdateResponse = {
  message: string;
  log: unknown;
  isInsideZone: boolean;
  zoneName: string | null;
};

export async function updateWorkerLocation(payload: WorkerLocationUpdatePayload) {
  const { data } = await api.post<ApiResponse<WorkerLocationUpdateResponse>>(
    "/worker/location",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update worker location");
  }

  return data.data;
}
