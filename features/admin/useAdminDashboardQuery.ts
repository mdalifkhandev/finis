import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { getAdminDashboard } from "@/services/adminService";
import { useAuthStore } from "@/stores/authStore";

export function useAdminDashboardQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["admin", "dashboard", accessToken],
    queryFn: getAdminDashboard,
    enabled: !!accessToken && role === "admin",
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
