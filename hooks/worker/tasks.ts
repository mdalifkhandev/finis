import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkerTaskById, startWorkerTask, reportWorkerTaskBeforePhoto, getWorkerTaskInventory } from "@/api/worker/tasks.api";

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
