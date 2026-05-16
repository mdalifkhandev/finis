import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  forgotPasswordRequest,
  inviteRequest,
  loginApi,
  meRequest,
  resetPasswordRequest,
  verifyOtpRequest,
} from "@/api/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type {
  ForgotPasswordData,
  InviteUserData,
  LoginPayload,
  ResetPasswordData,
  VerifyOtpData,
} from "@/types/auth.types";

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

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: (payload: ForgotPasswordData) => forgotPasswordRequest(payload),
  });

  return {
    sendCode: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export const useVerifyOtp = () => {
  const mutation = useMutation({
    mutationFn: (payload: VerifyOtpData) => verifyOtpRequest(payload),
  });

  return {
    verifyOtp: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: (payload: ResetPasswordData) => resetPasswordRequest(payload),
  });

  return {
    resetPassword: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
