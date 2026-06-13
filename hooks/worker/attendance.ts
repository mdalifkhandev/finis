import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";
import {
  checkInWorker,
  checkOutWorker,
  getTodayAttendance,
} from "@/api/worker/attendance.api";

export function useTodayAttendanceQuery() {
  return useQuery({
    queryKey: ["worker", "attendance", "today"],
    queryFn: getTodayAttendance,
  });
}

export function useCheckInWorkerMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: checkInWorker,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["worker", "attendance", "today"] });
      await queryClient.invalidateQueries({ queryKey: ["worker", "dashboard"] });
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error ? mutation.error.message : "Failed to check in",
      );
    }
  }, [mutation.error, mutation.isError]);

  return mutation;
}

export function useCheckOutWorkerMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: checkOutWorker,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["worker", "attendance", "today"] });
      await queryClient.invalidateQueries({ queryKey: ["worker", "dashboard"] });
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      const message =
        mutation.error instanceof Error ? mutation.error.message : "Failed to check out";
      if (message.includes("No active check-in found")) {
        return;
      }
      toast.error(message);
    }
  }, [mutation.error, mutation.isError]);

  return mutation;
}
