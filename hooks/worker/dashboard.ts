import { useQuery } from "@tanstack/react-query";
import { getWorkerDashboard } from "@/api/worker/dashboard.api";

export function useWorkerDashboardQuery() {
  return useQuery({
    queryKey: ["worker", "dashboard"],
    queryFn: () => getWorkerDashboard(),
  });
}

