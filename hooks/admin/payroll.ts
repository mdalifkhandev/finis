import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { getAdminPayStub, getAdminPayrollSummary, getAdminPayrollUsers } from "@/api/admin/payroll.api";
import { useAuthStore } from "@/store/auth.store";

export function useAdminPayrollSummaryQuery(params?: {
  month?: string;
  year?: string;
  projectId?: string;
}) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentDate = new Date();
  const resolvedParams = {
    month: params?.month ?? String(currentDate.getMonth() + 1),
    year: params?.year ?? String(currentDate.getFullYear()),
    projectId: params?.projectId,
  };

  const query = useQuery({
    queryKey: [
      "admin",
      "payroll",
      "summary",
      resolvedParams.month,
      resolvedParams.year,
      resolvedParams.projectId,
      token,
    ],
    queryFn: () => getAdminPayrollSummary(resolvedParams),
    enabled: isHydrated && !!token,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load payroll summary",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useAdminPayStubQuery(payrollId?: string) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const query = useQuery({
    queryKey: ["admin", "payroll", "stub", payrollId, token],
    queryFn: () => getAdminPayStub(payrollId as string),
    enabled: isHydrated && !!token && !!payrollId,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load pay stub",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useAdminPayrollUsersQuery(date?: string) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentDate = new Date();
  const resolvedDate = date ?? currentDate.toISOString().split("T")[0];

  const query = useQuery({
    queryKey: ["admin", "payroll", "users", resolvedDate, token],
    queryFn: () => getAdminPayrollUsers({ date: resolvedDate }),
    enabled: isHydrated && !!token,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load payroll users",
      );
    }
  }, [query.error, query.isError]);

  return query;
}
