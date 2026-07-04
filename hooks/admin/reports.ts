import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  downloadAdminReportsExport,
  getAdminGeneratedReport,
  type AdminExportReportsParams,
  type AdminGenerateReportParams,
} from "@/api/admin/reports.api";
import { useAuthStore } from "@/store/auth.store";

export function useAdminGeneratedReportQuery(
  params?: Partial<AdminGenerateReportParams>,
) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const role = useAuthStore((state) => state.user?.role);
  const isEnabled =
    isHydrated &&
    !!token &&
    role === "admin" &&
    !!params?.type &&
    !!params?.frequency &&
    !!params?.startDate &&
    !!params?.endDate;

  const query = useQuery({
    queryKey: [
      "admin",
      "reports",
      params?.type,
      params?.frequency,
      params?.startDate,
      params?.endDate,
      token,
    ],
    queryFn: () => getAdminGeneratedReport(params as AdminGenerateReportParams),
    enabled: isEnabled,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to generate report",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useExportAdminReportsMutation() {
  return useMutation({
    mutationFn: (params?: AdminExportReportsParams) =>
      downloadAdminReportsExport(params),
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to export reports",
      );
    },
  });
}
