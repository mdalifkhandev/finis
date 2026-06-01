import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskViewCard from "@/components/company/taskdetails/TaskViewCard";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkerTaskQuery } from "@/hooks/worker/tasks";

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
            workerName={task.creator?.fullName || "Company"}
            role={task.project?.name || "Project"}
            dateRange={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
            title={task.title}
            location={task.project?.name || "N/A"}
            city={task.project?.location || ""}
            roomNo={task.floor?.name ? `${task.floor.name} - ${task.room?.name || ""}` : (task.room?.name || "N/A")}
            startTime="N/A" 
            endTime="N/A"
            date={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
            description={task.description || "No description provided."}
            onStartTask={() => router.push({ pathname: "/screens/worker/taskdetails", params: { id: task.id } })}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

