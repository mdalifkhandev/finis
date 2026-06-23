import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectAnalysisScreen from "@/components/company/projectanalysis/ProjectAnalysisScreen";
import { useProjectAnalysisQuery } from "@/hooks/company/company";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectAnalysisRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const analysisQuery = useProjectAnalysisQuery(id);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
        refreshControl={
          <RefreshControl
            refreshing={analysisQuery.isRefetching}
            onRefresh={analysisQuery.refetch}
            tintColor="#1F506D"
            colors={["#1F506D"]}
          />
        }
      >
        <BackTitleHeader
          title="Project Analysis"
          onBack={() => router.back()}
        />
        <ProjectAnalysisScreen
          data={analysisQuery.data}
          isLoading={analysisQuery.isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
