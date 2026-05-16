import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/api/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type { LoginPayload } from "@/types/auth.types";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: ({ user, token }) => {
      void setAuth(user, token);
    },
  });

  return {
    login: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
