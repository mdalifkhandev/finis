import BackTitleHeader from "@/components/common/BackTitleHeader";
import AssignTaskScreen from "@/components/company/task/AssignTaskScreen";
import { clearTaskDraft } from "@/components/company/task/taskStore";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AssignTaskRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <BackTitleHeader
          title="Assign Task"
          onBack={() => {
            clearTaskDraft();
            router.back();
          }}
        />
        <AssignTaskScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
