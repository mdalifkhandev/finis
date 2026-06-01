import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskViewCard from "@/components/company/taskdetails/TaskViewCard";
import { useWorkerTaskQuery } from "@/hooks/worker/tasks";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: task, isLoading, isError } = useWorkerTaskQuery(id as string);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
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
            workerName={task.title || "Company"}
            role={task.project?.name || "Project"}
            dateRange={formatDateRange(task.createdAt, task.dueDate)}
            title={task.title}
            location={task.project?.name || "N/A"}
            city={task.project?.location || ""}
            roomNo={
              task.floor?.name
                ? `${task.floor.name} - ${task.room?.name || ""}`
                : task.room?.name || "N/A"
            }
            startTime="N/A"
            endTime="N/A"
            date={
              task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""
            }
            description={task.description || "No description provided."}
            onStartTask={() =>
              router.push({
                pathname: "/screens/worker/taskdetails",
                params: { id: task.id },
              })
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
