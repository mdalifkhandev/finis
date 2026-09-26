import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { getWorkerPayroll } from "@/api/worker/payroll.api";
import { useAuthStore } from "@/store/auth.store";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useWorkerPayrollQuery(params?: { date?: string; startDate?: string; endDate?: string }) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const query = useQuery({
    queryKey: ["worker", "payroll", params?.date, params?.startDate, params?.endDate, token],
    queryFn: () => getWorkerPayroll(params),
    enabled: isHydrated && !!token,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load worker payroll",
      );
    }
  }, [query.error, query.isError]);

  return query;
}
