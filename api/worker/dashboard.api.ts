import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types/auth.types";
import type { WorkerGroupedTaskItem } from "@/components/worker/WorkerGroupedTaskList";

type WorkerDashboardTaskResponse = {
  id: string;
  title: string;
  priority: string | null;
  status: string;
  dueDate: string | null;
  project: {
    id: string;
    name: string;
  } | null;
  scheduledLabel?: string | null;
  floors: Array<{
    id: string;
    name: string;
    floorNumber?: number;
    units: Array<{
      id: string;
      name: string;
      status: string;
      approvalDecision?: string | null;
      canCreateSubTask?: boolean;
      subTasks: Array<{
        id: string;
        title: string;
        status: string;
        approvalDecision?: string | null;
        action?: string | null;
        reportCount?: number;
      }>;
    }>;
  }>;
  task?: {
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
      return {
        id: task.id,
        title: task.title?.trim() || "Task",
        description: task.title,
        priority: task.priority ?? undefined,
        status: task.status,
        dueDate: task.dueDate ?? undefined,
        scheduledLabel: task.scheduledLabel ?? null,
        project: task.project ?? undefined,
        floors: (task.floors ?? []).map((floor) => ({
          id: floor.id,
          name: floor.name,
          floorNumber: floor.floorNumber,
          units: (floor.units ?? []).map((unit) => ({
            id: unit.id,
            name: unit.name,
            status: unit.status,
            approvalDecision: unit.approvalDecision ?? null,
            canCreateSubTask: unit.canCreateSubTask ?? false,
            subTasks: (unit.subTasks ?? []).map((subTask) => ({
              id: subTask.id,
              title: subTask.title,
              status: subTask.status,
              approvalDecision: subTask.approvalDecision ?? null,
              action: subTask.action ?? null,
              reportCount: subTask.reportCount ?? 0,
            })),
          })),
        })),
      };
    }),
  };
}

