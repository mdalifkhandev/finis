import BackTitleHeader from "@/components/common/BackTitleHeader";
import {
  mapApiToProjectData,
  saveProject,
  useProjectData,
} from "@/components/company/project/projectStore";
import ProjectBudgetCard from "@/components/company/projectinfo/ProjectBudgetCard";
import ProjectDetailsInfoCard from "@/components/company/projectinfo/ProjectDetailsInfoCard";
import { useProjectProfileQuery } from "@/hooks/admin/admin";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatCurrency = (value: number) =>
  `$${value?.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function ProjectInfoRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: apiProject,
    isLoading,
    refetch,
  } = useProjectProfileQuery(id as string);
  const project = useProjectData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // When API responds, push data into the store
  useEffect(() => {
    if (apiProject) {
      saveProject(mapApiToProjectData(apiProject));
    }
  }, [apiProject]);

  if (isLoading) {
    return (
      <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1] items-center justify-center">
        <ActivityIndicator size="large" color="#1F506D" />
      </SafeAreaView>
    );
  }

  const budgetNumber =
    Number((project.budget || "").replace(/[^\d.]/g, "")) || 0;
  const showBudgetCards = project.budgetEnabled && budgetNumber > 0;
  const spentAmount = apiProject?.spent ?? 0;
  const remainingAmount = apiProject?.remaining ?? 0;
  const usagePercent =
    budgetNumber > 0 ? (spentAmount / budgetNumber) * 100 : 0;

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1F506D"]}
          />
        }
      >
        <BackTitleHeader title="Project Details" onBack={() => router.back()} />

        <View className="mt-5 px-5">
          {showBudgetCards ? (
            <ProjectBudgetCard
              title="Total Budget"
              amount={formatCurrency(budgetNumber)}
              amountColor="#1F506D"
            />
          ) : null}
          <ProjectBudgetCard
            title="Spent"
            amount={formatCurrency(spentAmount)}
            amountColor="#F24800"
            usagePercent={usagePercent}
            usageLabel={`${usagePercent.toFixed(1)}% of budget used`}
          />
          {showBudgetCards ? (
            <ProjectBudgetCard
              title="Remaining"
              amount={formatCurrency(remainingAmount)}
              amountColor="#0DA33D"
            />
          ) : null}

          <ProjectDetailsInfoCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
