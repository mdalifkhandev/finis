import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkerSubTask,
  getWorkerSubTaskById,
  getWorkerTaskById,
  startWorkerTask,
  getWorkerTaskInventory,
  updateWorkerTaskInventory,
  completeWorkerTaskReport,
  getWorkerTasks,
  WorkerTaskKind,
} from "@/api/worker/tasks.api";

export function useWorkerTaskQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: ["worker", "task", id],
    queryFn: () => getWorkerTaskById(id),
    enabled: !!id && enabled,
  });
}

export function useWorkerSubTaskQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: ["worker", "subtask", id],
    queryFn: () => getWorkerSubTaskById(id),
    enabled: !!id && enabled,
  });
}

export function useStartWorkerTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      imageUri,
      taskType,
    }: {
      id: string;
      imageUri: string;
      taskType: WorkerTaskKind;
    }) => startWorkerTask(id, imageUri, taskType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", "task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["worker", "subtask", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["worker", "dashboard"] });
    },
  });
}

export function useWorkerTaskInventoryQuery(taskId: string, taskType: WorkerTaskKind = "subtask") {
  return useQuery({
    queryKey: ["worker", taskType, taskId, "inventory"],
    queryFn: () => getWorkerTaskInventory(taskId, taskType),
    enabled: !!taskId,
  });
}

export function useUpdateWorkerTaskInventoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      inventoryId,
      data,
      taskType,
    }: {
      taskId: string;
      inventoryId: string;
      data: any;
      taskType: WorkerTaskKind;
    }) => updateWorkerTaskInventory(taskId, inventoryId, data, taskType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", variables.taskType, variables.taskId, "inventory"] });
    },
  });
}

export function useCompleteWorkerTaskReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      afterPhotoUri,
      inventoryUsed,
      notes,
      taskType,
    }: {
      taskId: string;
      afterPhotoUri: string | null;
      inventoryUsed: { inventoryId: string; qtyUsed: number }[];
      notes: string;
      taskType: WorkerTaskKind;
    }) => completeWorkerTaskReport(taskId, afterPhotoUri, inventoryUsed, notes, taskType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", "task", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["worker", "subtask", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["worker", "dashboard"] });
    },
  });
}

export function useWorkerTasksQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["worker", "tasks", page, limit],
    queryFn: () => getWorkerTasks(page, limit),
  });
}

export function useCreateWorkerSubTaskMutation(taskId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      unitId: string;
      title: string;
      description?: string;
      priority?: string;
      dueDate?: string;
      estimatedHours?: number;
    }) => {
      if (!taskId) throw new Error("Task ID is required");
      return createWorkerSubTask(taskId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["worker", "tasks"] });
    },
  });
}
