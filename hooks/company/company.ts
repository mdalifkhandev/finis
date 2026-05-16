import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
} from "@/api/company/company.api";
import { useAuthStore } from "@/store/auth.store";
import type {
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types/company.types";

export function useCompaniesQuery(page: number, limit: number) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["company", "companies", page, limit, token],
    queryFn: () => getCompanies({ page, limit }),
    enabled: !!token && role === "admin",
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load companies",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateCompanyPayload) => createCompany(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["company", "companies"] });
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error
          ? mutation.error.message
          : "Failed to create company",
      );
    }
  }, [mutation.error, mutation.isError]);

  return {
    createCompany: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useUpdateCompanyMutation(companyId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCompanyPayload }) =>
      updateCompany(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["company", "companies"] });
      if (companyId) {
        void queryClient.invalidateQueries({
          queryKey: ["company", "detail", companyId],
        });
      }
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error
          ? mutation.error.message
          : "Failed to update company",
      );
    }
  }, [mutation.error, mutation.isError]);

  return {
    updateCompany: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useCompanyQuery(id?: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["company", "detail", id, token],
    queryFn: () => getCompany(id as string),
    enabled: !!id && !!token && role === "admin",
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load company",
      );
    }
  }, [query.error, query.isError]);

  return query;
}
