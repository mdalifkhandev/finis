import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  getAdminProjectNames,
  getActiveProjects,
  getActiveWorkers,
  getAdminDashboard,
  getAdminProjects,
  getProjectProfile,
} from "@/api/admin/admin.api";
import { useAuthStore } from "@/store/auth.store";

export function useAdminDashboardQuery() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["admin", "dashboard", token],
    queryFn: getAdminDashboard,
    enabled: !!token,
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

export function useActiveWorkersQuery(page: number, limit: number) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["admin", "active-workers", page, limit, token],
    queryFn: () => getActiveWorkers({ page, limit }),
    enabled: !!token , 
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load workers",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useActiveProjectsQuery(page: number, limit: number) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["admin", "active-projects", page, limit, token],
    queryFn: () => getActiveProjects({ page, limit }),
    enabled: !!token ,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load projects",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useAdminProjectsQuery() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);


  const query = useQuery({
    queryKey: ["admin", "projects", token],
    queryFn: getAdminProjects,
    enabled: !!token,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load projects",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useAdminProjectNamesQuery() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessProjects = role === "admin" || role === "manager";

  const query = useQuery({
    queryKey: ["admin", "project-names", token],
    queryFn: getAdminProjectNames,
    enabled: !!token && canAccessProjects,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load projects",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useProjectProfileQuery(id: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["admin", "project-profile", id, token],
    queryFn: () => getProjectProfile(id),
    enabled: !!token && !!id,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load project profile",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useAdminProfileQuery() {
  return useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => import("@/api/admin/admin.api").then(m => m.getAdminProfile()),
  });
}

