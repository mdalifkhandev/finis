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

export async function getTodayAttendance() {
  const { data } = await api.get<ApiResponse<WorkerTodayAttendance>>("/worker/attendance/today");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch attendance");
  }

  return data.data;
}

export async function checkInWorker(payload?: { lat?: number; lng?: number }) {
  const { data } = await api.post<ApiResponse<{ sessionId: string; message: string }>>(
    "/worker/attendance/check-in",
    payload ?? {},
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to check in");
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
