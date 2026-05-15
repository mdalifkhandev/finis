import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import type { LoginCredentials } from "@/types/api/auth";

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginRequest(credentials),
    onSuccess: (session) => {
      setSession(session);
    },
  });
}
