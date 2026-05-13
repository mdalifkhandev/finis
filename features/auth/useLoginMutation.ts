import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "./auth.api";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginCredentials } from "./auth.types";

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginRequest(credentials),
    onSuccess: (session) => {
      setSession(session);
    },
  });
}
