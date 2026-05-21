import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskScreen from "@/components/company/task/TaskScreen";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskRoute() {
  const { id, projectId } = useLocalSearchParams<{ id?: string; projectId?: string }>();
  const activeProjectId = projectId || id;
  const queryClient = useQueryClient();

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  });

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <BackTitleHeader title="Task" onBack={() => router.back()} />
        <TaskScreen projectId={activeProjectId} />
      </ScrollView>
    </SafeAreaView>
  );
}
