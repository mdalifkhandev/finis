import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskScreen from "@/components/company/task/TaskScreen";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <BackTitleHeader title="Task " onBack={() => router.back()} />
        <TaskScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
