import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { meRequest } from "./auth.api";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ["auth", "me", accessToken],
    queryFn: meRequest,
    enabled: !!accessToken,
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
