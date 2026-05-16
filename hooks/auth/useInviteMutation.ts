import { useMutation } from "@tanstack/react-query";
import { inviteRequest } from "@/api/auth/auth.api";
import type { InviteUserData } from "@/types/auth.types";

export function useInviteMutation() {
  const mutation = useMutation({
    mutationFn: (payload: InviteUserData) => inviteRequest(payload),
  });

  return {
    invite: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
