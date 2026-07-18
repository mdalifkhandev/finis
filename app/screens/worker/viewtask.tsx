import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskViewCard from "@/components/company/taskdetails/TaskViewCard";
import {
  useStartWorkerTaskMutation,
  useWorkerTaskQuery,
  useWorkerSubTaskQuery,
} from "@/hooks/worker/tasks";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDateRange(start?: string | Date, end?: string | Date) {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endStr = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

export default function WorkerViewTaskRoute() {
  const { id, taskType, taskTitle, taskDescription, projectName, floorName, roomName, dueDate } =
    useLocalSearchParams<{
      id: string;
      taskType?: "main" | "subtask";
      taskTitle?: string;
      taskDescription?: string;
      projectName?: string;
      floorName?: string;
      roomName?: string;
      dueDate?: string;
  }>();
  const resolvedTaskType = taskType === "subtask" ? "subtask" : "main";
  const mainTaskQuery = useWorkerTaskQuery(id as string, resolvedTaskType === "main");
  const subTaskQuery = useWorkerSubTaskQuery(id as string, resolvedTaskType === "subtask");
  const task = resolvedTaskType === "main" ? mainTaskQuery.data : subTaskQuery.data;
  const isLoading = resolvedTaskType === "main" ? mainTaskQuery.isLoading : subTaskQuery.isLoading;
  const isError = resolvedTaskType === "main" ? mainTaskQuery.isError : subTaskQuery.isError;
  const error = resolvedTaskType === "main" ? mainTaskQuery.error : subTaskQuery.error;
  const startTaskMutation = useStartWorkerTaskMutation();

  // Log error for debugging
  if (isError && error) {
    console.log("Task load error:", error);
    console.log("Task ID:", id);
    console.log("Task Type:", resolvedTaskType);
  }

  const resolvedTaskTitle = task?.title || taskTitle || "Company";
  const resolvedProjectName = task?.project?.name || projectName || "N/A";
  const resolvedDescription =
    task?.description || taskDescription || "No description provided.";
  const resolvedRoomNo = task?.roomNo || (task?.floor?.name
    ? `${task.floor.name} - ${task.room?.name || ""}`
    : floorName
      ? `${floorName}${roomName ? ` - ${roomName}` : ""}`
      : task?.room?.name || roomName || "N/A");
  const resolvedDueDate = task?.dueDate || dueDate || "";

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 34, flexGrow: 1 }}
      >
        <BackTitleHeader title="View Task" onBack={() => router.back()} />

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#1f3d5c" />
            <Text className="mt-4 text-slate-500">Loading task details...</Text>
          </View>
        ) : isError || !task ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">Failed to load task details.</Text>
          </View>
        ) : (
          <TaskViewCard
            workerName={resolvedTaskTitle}
            role={resolvedProjectName === "N/A" ? "Project" : resolvedProjectName}
            dateRange={formatDateRange(task.createdAt, resolvedDueDate)}
            title={resolvedTaskTitle}
            location={resolvedProjectName}
            city={task.project?.location || ""}
            roomNo={resolvedRoomNo}
            startTime={task?.startTime ? new Date(task.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
            endTime={task?.endTime ? new Date(task.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
            date={resolvedDueDate ? new Date(resolvedDueDate).toLocaleDateString() : "N/A"}
            description={resolvedDescription}
            isStarting={startTaskMutation.isPending}
            onStartTask={(imageUri: string) => {
              startTaskMutation.mutate(
                { id: task.id, imageUri, taskType: resolvedTaskType },
                {
                  onSuccess: () => {
                    router.push({
                      pathname: "/screens/worker/taskdetails",
                      params: { id: task.id, taskType: resolvedTaskType },
                    });
                  },
                  onError: (error: any) => {
                    Alert.alert(
                      "Error",
                      error.message || "Failed to start task",
                    );
                  },
                },
              );
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
