import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectDetailsMenu from "@/components/company/projectdetails/ProjectDetailsMenu";
import ProjectOverviewCard from "@/components/company/projectdetails/ProjectOverviewCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ROUTES: Record<
  string,
  | "/screens/company/projectinfo"
  | "/screens/company/projectanalysis"
  | "/screens/company/team"
  | "/screens/company/task"
  | "/screens/company/projectdocuments"
> = {
  "Project details": "/screens/company/projectinfo",
  "Project Analysis": "/screens/company/projectanalysis",
  Team: "/screens/company/team",
  Task: "/screens/company/task",
  Document: "/screens/company/projectdocuments",
};

export default function ProjectDetailsRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 34 }}
      >
        <BackTitleHeader
          title="Projects details"
          onBack={() => router.back()}
        />

        <ProjectOverviewCard
          onPressFloorPlan={() => router.push("/screens/company/floorplan")}
          onPressEditProject={() => router.push("/screens/company/editproject")}
        />

        <ProjectDetailsMenu
          onPressItem={(item) => {
            const route = MENU_ROUTES[item];
            if (route) {
              router.push(route);
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
