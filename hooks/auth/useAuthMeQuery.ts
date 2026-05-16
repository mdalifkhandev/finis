import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { meRequest } from "@/api/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useAuthMeQuery() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: meRequest,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load profile",
      );
    }
  }, [query.error, query.isError]);

  return query;
}
