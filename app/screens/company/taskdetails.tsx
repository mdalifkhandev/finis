import BackTitleHeader from "@/components/common/BackTitleHeader";
import { useTaskItems } from "@/components/company/task/taskStore";
import { getTaskDetailsPreset } from "@/components/company/taskdetails/taskDetailsPreset";
import TaskDetailsScreen from "@/components/company/taskdetails/TaskDetailsScreen";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetailsRoute() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const tasks = useTaskItems();

  const task = tasks.find((item) => item.id === taskId) ?? tasks[0];
  const preset = getTaskDetailsPreset(task?.status);

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
