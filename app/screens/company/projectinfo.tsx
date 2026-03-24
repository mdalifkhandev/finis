import BackTitleHeader from "@/components/common/BackTitleHeader";
import { useProjectData } from "@/components/company/project/projectStore";
import ProjectBudgetCard from "@/components/company/projectinfo/ProjectBudgetCard";
import ProjectDetailsInfoCard from "@/components/company/projectinfo/ProjectDetailsInfoCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function ProjectInfoRoute() {
  const project = useProjectData();
  const budgetNumber =
    Number((project.budget || "").replace(/[^\d.]/g, "")) || 0;
  const showBudgetCards = project.budgetEnabled && budgetNumber > 0;
  const spentAmount = showBudgetCards
    ? Math.round(budgetNumber * 0.75)
    : 1875000;
  const remainingAmount = Math.max(budgetNumber - spentAmount, 0);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
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
            usagePercent={75}
            usageLabel="75.0% of budget used"
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
