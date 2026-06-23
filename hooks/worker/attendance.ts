import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";
import {
  checkInWorker,
  checkOutWorker,
  getTodayAttendance,
  getWorkerWeeklyAttendanceSummary,
} from "@/api/worker/attendance.api";

export function useTodayAttendanceQuery() {
  return useQuery({
    queryKey: ["worker", "attendance", "today"],
    queryFn: getTodayAttendance,
  });
}

export function useWorkerWeeklyAttendanceSummaryQuery() {
  return useQuery({
    queryKey: ["worker", "attendance", "weekly-summary"],
    queryFn: getWorkerWeeklyAttendanceSummary,
  });
}

export function useCheckInWorkerMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: checkInWorker,
    onMutate: (variables) => {
      console.log("[WorkerAttendance] check-in mutate", variables);
    },
    onError: (error) => {
      console.log("[WorkerAttendance] check-in error", error);
    },
    onSuccess: async () => {
      console.log("[WorkerAttendance] check-in success");
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
    onMutate: (variables) => {
      console.log("[WorkerAttendance] check-out mutate", variables);
    },
    onError: (error) => {
      console.log("[WorkerAttendance] check-out error", error);
    },
    onSuccess: async () => {
      console.log("[WorkerAttendance] check-out success");
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
