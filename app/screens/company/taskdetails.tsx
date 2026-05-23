import BackTitleHeader from "@/components/common/BackTitleHeader";
import { useTaskDetailsQuery } from "@/hooks/company/company";
import { getTaskDetailsPreset } from "@/components/company/taskdetails/taskDetailsPreset";
import TaskDetailsScreen from "@/components/company/taskdetails/TaskDetailsScreen";
import { TaskStatus } from "@/components/company/task/types";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetailsRoute() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const { data: task, isLoading } = useTaskDetailsQuery(taskId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#E9EDF1] items-center justify-center">
        <ActivityIndicator size="large" color="#1F506D" />
      </SafeAreaView>
    );
  }
  const preset = getTaskDetailsPreset(task?.status as TaskStatus);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <BackTitleHeader
          title={task?.title || preset.screenTitle}
          onBack={() => router.back()}
        />
        <TaskDetailsScreen task={task} />
      </ScrollView>
    </SafeAreaView>
  );
}
