import { useQuery } from "@tanstack/react-query";
import { getAdminProfile } from "@/api/profile/profile.api";

export function useAdminProfileQuery() {
  return useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => getAdminProfile(),
  });
}


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminProfile } from "@/api/profile/profile.api";
import { toast } from "sonner-native";

export function useUpdateAdminProfileMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => updateAdminProfile(formData),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}


import { getWorkerProfile, updateWorkerProfile } from "@/api/profile/profile.api";

export function useWorkerProfileQuery() {
  return useQuery({
    queryKey: ["worker", "profile"],
    queryFn: () => getWorkerProfile(),
  });
}

export function useUpdateWorkerProfileMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => updateWorkerProfile(formData),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["worker", "profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

