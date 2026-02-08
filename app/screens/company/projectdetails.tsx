import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectDetailsMenu from "@/components/company/projectdetails/ProjectDetailsMenu";
import ProjectOverviewCard from "@/components/company/projectdetails/ProjectOverviewCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectDetailsRoute() {
  const handlePressMenuItem = (item: string) => {
    if (item === "Project details") {
      router.push("/screens/company/projectinfo");
      return;
    }

    if (item === "Project Analysis") {
      router.push("/screens/company/projectanalysis");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <BackTitleHeader title="Projects details" onBack={() => router.back()} />
        <ProjectOverviewCard
          onPressFloorPlan={() => router.push("/screens/company/floorplan")}
        />
        <ProjectDetailsMenu onPressItem={handlePressMenuItem} />
      </ScrollView>
    </SafeAreaView>
  );
}
