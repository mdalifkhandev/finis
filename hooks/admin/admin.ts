import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { getAdminDashboard } from "@/api/admin/admin.api";
import { useAuthStore } from "@/store/auth.store";

export function useAdminDashboardQuery() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["admin", "dashboard", token],
    queryFn: getAdminDashboard,
    enabled: !!token && role === "admin",
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load dashboard",
      );
    }
  }, [query.error, query.isError]);

  return query;
}
