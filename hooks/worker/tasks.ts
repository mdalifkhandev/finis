import { useQuery } from "@tanstack/react-query";
import { getWorkerTaskById } from "@/api/worker/tasks.api";

export function useWorkerTaskQuery(id: string) {
  return useQuery({
    queryKey: ["worker", "task", id],
    queryFn: () => getWorkerTaskById(id),
    enabled: !!id,
  });
}

