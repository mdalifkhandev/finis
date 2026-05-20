import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectAnalysisScreen from "@/components/company/projectanalysis/ProjectAnalysisScreen";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectAnalysisRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <BackTitleHeader
          title="Project Analysis"
          onBack={() => router.back()}
        />
        <ProjectAnalysisScreen projectId={id} />
      </ScrollView>
    </SafeAreaView>
  );
}
