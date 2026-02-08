import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectBudgetCard from "@/components/company/projectinfo/ProjectBudgetCard";
import ProjectDetailsInfoCard from "@/components/company/projectinfo/ProjectDetailsInfoCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectInfoRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <BackTitleHeader title="Project Details" onBack={() => router.back()} />

        <View className="mt-5 px-5">
          <ProjectBudgetCard
            title="Total Budget"
            amount="$2,500,000"
            amountColor="#1F506D"
          />
          <ProjectBudgetCard
            title="Spent"
            amount="$1,875,000"
            amountColor="#F24800"
            usagePercent={75}
            usageLabel="75.0% of budget used"
          />
          <ProjectBudgetCard
            title="Remaining"
            amount="$625,000"
            amountColor="#0DA33D"
          />

          <ProjectDetailsInfoCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

