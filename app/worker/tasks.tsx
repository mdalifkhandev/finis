import WorkerGroupedTaskList, {
  WORKER_TASK_MOCK_DATA,
} from "@/components/worker/WorkerGroupedTaskList";
import { useWorkerTasksQuery } from "@/hooks/worker/tasks";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkerTasks() {
  const { data, isLoading, refetch, isRefetching } = useWorkerTasksQuery(1, 100);
  const tasks = data?.data ?? [];
  const displayedTasks = tasks.length ? tasks : WORKER_TASK_MOCK_DATA;

  return (
    <SafeAreaView
      className="flex-1 bg-[#E9EDF1]"
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" />

      <View className="h-16 flex-row items-center justify-center px-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-5"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="chevron-left" size={30} color="#26313E" />
        </TouchableOpacity>
        <Text className="text-[18px] font-bold text-[#26313E]">Tasks</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            colors={["#1E5371"]}
            tintColor="#1E5371"
          />
        }
      >
        {isLoading ? (
          <View className="mt-24 items-center">
            <ActivityIndicator size="large" color="#1E5371" />
          </View>
        ) : displayedTasks.length ? (
          <WorkerGroupedTaskList
            tasks={displayedTasks}
            onPressTask={(task) => {
              if (task.id.startsWith("mock-")) return;
              router.push({
                pathname: "/screens/worker/taskdetails",
                params: { id: task.id },
              });
            }}
          />
        ) : (
          <View className="mt-24 items-center">
            <Text className="text-[15px] text-[#667085]">No tasks found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
