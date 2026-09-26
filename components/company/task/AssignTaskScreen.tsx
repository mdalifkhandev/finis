import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState, useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import AssignWorkerCard, { WorkerItem } from "./AssignWorkerCard";
import { addTask, clearTaskDraft, getTaskDraft } from "./taskStore";
import {
  useTaskAvailableWorkersQuery,
  useAssignTaskWorkerMutation,
  useTaskLocationsQuery,
} from "@/hooks/company/company";
import { toast } from "sonner-native";

export default function AssignTaskScreen({ projectId, taskId }: { projectId?: string; taskId?: string }) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  const { data: workersData, isLoading } = useTaskAvailableWorkersQuery(taskId, debouncedSearch);
  const { data: taskLocations } = useTaskLocationsQuery(taskId);

  const filteredWorkers: WorkerItem[] = useMemo(() => {
    if (!workersData?.data) return [];
    return workersData.data.map((w: any) => ({
      id: w.id,
      name: w.fullName,
      role: w.role || "Worker",
      initial: w.fullName ? w.fullName.charAt(0).toUpperCase() : "W",
      available: w.isAvailable,
      avatarUrl: w.avatarUrl,
    }));
  }, [workersData]);

  const handleToggleAssign = (workerId: string) => {
    setAssignedIds((previous) =>
      previous.includes(workerId)
        ? previous.filter((id) => id !== workerId)
        : [...previous, workerId],
    );
  };

  const assignMutation = useAssignTaskWorkerMutation(taskId);

  const handleConfirmAssignment = async () => {
    if (assignedIds.length === 0) {
      Alert.alert("Assign worker", "Please assign at least one worker.");
      return;
    }

    if (taskId) {
      const hasTaskUnits =
        (taskLocations?.floors?.flatMap((floor) => floor.units ?? [])?.length ?? 0) > 0;

      if (!hasTaskUnits) {
        Alert.alert("Assign worker", "No units found in this task.");
        return;
      }

      try {
        await assignMutation.mutateAsync({
          workerIds: assignedIds,
        });
        setAssignedIds([]); // clear selection
        // Automatically refetched by query invalidation, so UI will update
        toast.success("Workers assigned successfully");
        router.back();
      } catch (error) {
        // error already handled in hook
      }
      return;
    }

    const draft = getTaskDraft();
    if (!draft) {
      router.replace({
        pathname: "/screens/company/task",
        params: { id: projectId }
      });
      return;
    }

    if (assignedIds.length === 0) {
      Alert.alert("Assign worker", "Please assign at least one worker.");
      return;
    }

    const assignedWorkers = filteredWorkers.filter((worker) =>
      assignedIds.includes(worker.id),
    );

    const assignee =
      assignedWorkers.length > 1
        ? `${assignedWorkers[0].name} +${assignedWorkers.length - 1}`
        : assignedWorkers[0].name;

    addTask({
      title: draft.title,
      location: draft.location,
      assignee,
      dueDate: draft.dueDate,
      status: "Pending",
      description: draft.description,
      priority: draft.priority,
    });

    clearTaskDraft();
    router.replace({
      pathname: "/screens/company/task",
      params: { id: projectId }
    });
  };

  return (
    <View className="mt-6 px-5">
      <View className="h-[48px] flex-row items-center rounded-[13px] border border-[#CDD4DB] bg-[#F5F7F9] px-3">
        <Ionicons name="search-outline" size={23} color="#7C8594" />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search workers"
          placeholderTextColor="#A0A8B5"
          className="ml-2 flex-1 text-[15px] text-[#26313E]"
        />
      </View>

      <Text className="mt-4 text-[18px] font-medium text-[#334155]">
        Available Workers
      </Text>

      <View className="mt-1">
        {isLoading ? (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator size="large" color="#1F2937" />
          </View>
        ) : filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker) => (
            <AssignWorkerCard
              key={worker.id}
              worker={worker}
              assigned={assignedIds.includes(worker.id)}
              onAssign={() => handleToggleAssign(worker.id)}
            />
          ))
        ) : (
          <Text className="mt-4 text-center text-[15px] text-[#6B7280]">
            No workers found.
          </Text>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleConfirmAssignment}
        disabled={assignMutation.isPending}
        className="mt-6 h-[52px] items-center justify-center rounded-[10px] bg-[#1E5371]"
      >
        {assignMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-[16px] font-medium text-[#F4F8FA]">
            Confirm Assignment
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
