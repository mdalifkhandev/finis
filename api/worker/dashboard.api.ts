import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types/auth.types";

export type WorkerDashboardTask = {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueDate: string;
  project: {
    id: string;
    name: string;
  };
  floor: any | null;
  room: any | null;
  _count: {
    reports: number;
  };
};

export type WorkerDashboardStats = {
  todayTasksCount: number;
  completedToday: number;
  clockStatus: "not_clocked_in" | "clocked_in";
  clockInTime: string | null;
  hoursWorked: number | null;
};

export type WorkerDashboardResponse = {
  stats: WorkerDashboardStats;
  todayTasks: WorkerDashboardTask[];
};

export async function getWorkerDashboard() {
  const { data } = await api.get<ApiResponse<WorkerDashboardResponse>>("/worker/dashboard");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch worker dashboard");
  }
  return data.data;
}

