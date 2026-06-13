import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { getChatUserProfile } from "@/api/chat/user-profile.api";
import { useEffect } from "react";

export function useChatUserProfileQuery(userId?: string) {
  const query = useQuery({
    queryKey: ["chat", "user-profile", userId],
    queryFn: () => getChatUserProfile(userId as string),
    enabled: !!userId,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load profile",
      );
    }
  }, [query.error, query.isError]);

  return query;
}
