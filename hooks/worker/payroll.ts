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

export function useWorkerPayrollQuery(date?: string) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const resolvedDate = date ?? formatLocalDate(new Date());

  const query = useQuery({
    queryKey: ["worker", "payroll", resolvedDate, token],
    queryFn: () => getWorkerPayroll({ date: resolvedDate }),
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
