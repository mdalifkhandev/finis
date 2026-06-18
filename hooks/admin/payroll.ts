import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  approveAdminPayroll,
  getAdminPayStub,
  getAdminPayrollOverview,
  getAdminPayrollSummary,
  getAdminPayrollUsers,
  processAdminPayroll,
  updateAdminPayroll,
} from "@/api/admin/payroll.api";
import { getAdminWorkerSummary } from "@/api/admin/admin.api";
import { useAuthStore } from "@/store/auth.store";

export function useAdminPayrollSummaryQuery(params?: {
  date?: string;
  month?: string;
  year?: string;
  projectId?: string;
}) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentDate = params?.date ? new Date(params.date) : new Date();
  const resolvedParams = {
    date: params?.date,
    month: params?.month ?? String(currentDate.getMonth() + 1),
    year: params?.year ?? String(currentDate.getFullYear()),
    projectId: params?.projectId,
  };

  const query = useQuery({
    queryKey: [
      "admin",
      "payroll",
      "summary",
      resolvedParams.date ?? "no-date",
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

export function useApproveAdminPayrollMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: ({ payrollId, note }: { payrollId: string; note?: string }) => {
      if (!token) throw new Error("Unauthorized");
      return approveAdminPayroll(payrollId, note ? { note } : undefined);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "payroll", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "payroll", "users"] });
      toast.success("Payroll approved successfully");
    },
    onError: (error: any) => {
      toast.error(error instanceof Error ? error.message : "Failed to approve payroll");
    },
  });
}

export function useProcessAdminPayrollMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (params?: { month?: string; year?: string; projectId?: string }) => {
      if (!token) throw new Error("Unauthorized");
      return processAdminPayroll(params);
    },
    onSuccess: async (response: any) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "payroll", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "payroll", "users"] });
      toast.success(response.message || "Payroll processing started");
    },
    onError: (error: any) => {
      toast.error(error instanceof Error ? error.message : "Failed to process payroll");
    },
  });
}

export function useUpdateAdminPayrollMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: ({
      payrollId,
      payload,
    }: {
      payrollId: string;
      payload: Parameters<typeof updateAdminPayroll>[1];
    }) => {
      if (!token) throw new Error("Unauthorized");
      return updateAdminPayroll(payrollId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "payroll", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "payroll", "overview"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "payroll", "users"] });
      toast.success("Payroll updated successfully");
    },
    onError: (error: any) => {
      toast.error(error instanceof Error ? error.message : "Failed to update payroll");
    },
  });
}

export function useAdminWorkerSummaryQuery() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const query = useQuery({
    queryKey: ["admin", "projects", "worker-summary", token],
    queryFn: getAdminWorkerSummary,
    enabled: isHydrated && !!token,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load scheduled activities",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useAdminPayrollOverviewQuery() {
  const token = useAuthStore((state) => state.token);
  const query = useQuery({
    queryKey: ["admin", "payroll", "overview",  token],
    queryFn: () => getAdminPayrollOverview(),
    enabled:  !!token,

  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load payroll overview",
      );
    }
  }, [query.error, query.isError]);

  return query;
}
