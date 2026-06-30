import BackTitleHeader from "@/components/common/BackTitleHeader";
import {
  useAdminSubTaskDetailsQuery,
  useTaskDetailsQuery,
  useUpdateTaskMutation,
} from "@/hooks/company/company";
import TaskDetailsScreen from "@/components/company/taskdetails/TaskDetailsScreen";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetailsRoute() {
  const { taskId, subTaskId } = useLocalSearchParams<{ taskId?: string; subTaskId?: string }>();
  const resolvedTaskId = Array.isArray(taskId) ? taskId[0] : taskId;
  const resolvedSubTaskId = Array.isArray(subTaskId) ? subTaskId[0] : subTaskId;
  const isSubTaskMode = Boolean(resolvedSubTaskId);

  const taskQuery = useTaskDetailsQuery(isSubTaskMode ? undefined : resolvedTaskId);
  const subTaskQuery = useAdminSubTaskDetailsQuery(resolvedSubTaskId);
  const task = isSubTaskMode ? subTaskQuery.data : taskQuery.data;
  const isLoading = isSubTaskMode ? subTaskQuery.isLoading : taskQuery.isLoading;
  const isRefreshing = isSubTaskMode ? subTaskQuery.isRefetching : taskQuery.isRefetching;
  const updateTaskMutation = useUpdateTaskMutation(isSubTaskMode ? "" : task?.id || "");

  if (isLoading) {
    return (
      <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1] items-center justify-center">
        <ActivityIndicator size="large" color="#1F506D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() =>
              void (isSubTaskMode ? subTaskQuery.refetch() : taskQuery.refetch())
            }
            tintColor="#1F506D"
            colors={["#1F506D"]}
          />
        }
      >
        <BackTitleHeader
          title={task?.title || "Task Details"}
          onBack={() => router.back()}
        />
        <TaskDetailsScreen
          task={task}
          updateTaskMutation={isSubTaskMode ? undefined : updateTaskMutation}
          isSubTaskMode={isSubTaskMode}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
