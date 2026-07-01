import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkerSubTask, getWorkerTaskById, startWorkerTask, reportWorkerTaskBeforePhoto, getWorkerTaskInventory, updateWorkerTaskInventory, completeWorkerTaskReport, getWorkerTasks } from "@/api/worker/tasks.api";

export function useWorkerTaskQuery(id: string) {
  return useQuery({
    queryKey: ["worker", "task", id],
    queryFn: () => getWorkerTaskById(id),
    enabled: !!id,
  });
}

export function useStartWorkerTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => startWorkerTask(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", "task", variables] });
      queryClient.invalidateQueries({ queryKey: ["worker", "dashboard"] });
    },
  });
}

export function useWorkerTaskInventoryQuery(taskId: string) {
  return useQuery({
    queryKey: ["worker", "task", taskId, "inventory"],
    queryFn: () => getWorkerTaskInventory(taskId),
    enabled: !!taskId,
  });
}

export function useReportWorkerTaskBeforePhotoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUri }: { id: string; imageUri: string }) => reportWorkerTaskBeforePhoto(id, imageUri),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", "task", variables.id] });
    },
  });
}

export function useUpdateWorkerTaskInventoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, inventoryId, data }: { taskId: string; inventoryId: string; data: any }) => updateWorkerTaskInventory(taskId, inventoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", "task", variables.taskId, "inventory"] });
    },
  });
}

export function useCompleteWorkerTaskReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, afterPhotoUri, inventoryUsed, notes }: { taskId: string; afterPhotoUri: string | null; inventoryUsed: { inventoryId: string; qtyUsed: number }[]; notes: string }) => 
      completeWorkerTaskReport(taskId, afterPhotoUri, inventoryUsed, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["worker", "task", variables.taskId] });
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
