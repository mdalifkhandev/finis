import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types/auth.types";
import type { WorkerGroupedTaskItem } from "@/components/worker/WorkerGroupedTaskList";

type WorkerDashboardTaskResponse = {
  id: string;
  title: string;
  priority: string | null;
  status: string;
  approvalDecision?: string | null;
  createdBy?: string | null;
  unitId?: string | null;
  unit?: {
    id: string;
    name: string;
  } | null;
  taskAssignee?: {
    userId?: string;
    user?: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
      role: string;
    } | null;
    unit?: {
      id: string;
      name: string;
    } | null;
  } | null;
  task: {
    id: string;
    title: string;
    priority: string | null;
    dueDate: string | null;
    status: string;
    project: {
      id: string;
      name: string;
    } | null;
    floor: {
      id: string;
      name: string;
    } | null;
    unit: {
      id: string;
      name: string;
    } | null;
  };
  _count: {
    reports: number;
  };
};

export type WorkerDashboardStats = {
  todayTasksCount: number;
  completedToday: number;
  clockStatus: "not_clocked_in" | "clocked_in" | "clocked_out";
  clockInTime: string | null;
  hoursWorked: number | null;
};

export type WorkerDashboardResponse = {
  stats: WorkerDashboardStats;
  todayTasks: WorkerGroupedTaskItem[];
};

export async function getWorkerDashboard() {
  const { data } = await api.get<
    ApiResponse<{
      stats: WorkerDashboardStats;
      todayTasks: WorkerDashboardTaskResponse[];
    }>
  >("/worker/dashboard");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch worker dashboard");
  }

  return {
    ...data.data,
    todayTasks: (data.data.todayTasks ?? []).map((task) => {
      const resolvedUnit = task.unit ?? task.taskAssignee?.unit ?? task.task?.unit ?? null;
      return {
        id: task.id,
        title: task.task?.title?.trim() || task.title,
        description: task.title,
        priority: task.priority ?? task.task?.priority ?? undefined,
        status: task.status,
        dueDate: task.task?.dueDate ?? undefined,
        project: task.task?.project ?? undefined,
        floor: task.task?.floor ?? undefined,
        room: resolvedUnit ?? undefined,
      };
    }),
  };
}

