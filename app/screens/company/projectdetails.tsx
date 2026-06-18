import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectDetailsMenu from "@/components/company/projectdetails/ProjectDetailsMenu";
import ProjectOverviewCard from "@/components/company/projectdetails/ProjectOverviewCard";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { useProjectProfileQuery } from "@/hooks/company/company";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth.store";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ROUTES: Record<
  string,
  | "/screens/company/projectinfo"
  | "/screens/company/projectanalysis"
  | "/screens/company/team"
  | "/screens/company/task"
  | "/screens/company/projectdocuments"
  | "/screens/company/managergeofencing"
> = {
  "Project details": "/screens/company/projectinfo",
  "Project Analysis": "/screens/company/projectanalysis",
  Team: "/screens/company/team",
  Task: "/screens/company/task",
  Document: "/screens/company/projectdocuments",
  Geofencing: "/screens/company/managergeofencing",
};

export default function ProjectDetailsRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const projectId = typeof id === "string" ? id : undefined;
  const role = useAuthStore((state) => state.user?.role);
  const { data, isLoading } = useProjectProfileQuery(projectId);
  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    if (!projectId) return;
    await queryClient.invalidateQueries({ queryKey: ["project", "profile", projectId] });
  });
  const menuItems = React.useMemo(
    () =>
      role === "manager"
        ? ["Project details", "Project Analysis", "Team", "Task", "Document", "Geofencing"]
        : ["Project details", "Project Analysis", "Team", "Task", "Document"],
    [role],
  );

  const formattedDateRange = data
    ? `${new Date(data.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${new Date(data.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
    : undefined;

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 34 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <BackTitleHeader
          title="Projects details"
          onBack={() => router.back()}
        />

        {isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1d4f6d" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading project details...
            </Text>
          </View>
        ) : (
          <ProjectOverviewCard
            status={data?.status}
            projectName={data?.name}
            projectCompany={data?.client.companyName}
            projectLocation={data?.location}
            dateRange={formattedDateRange}
            projectLogoUrl={data?.client.logoUrl}
            onPressFloorPlan={() =>
              projectId
                ? router.push({
                  pathname: "/screens/company/floorplan",
                  params: { id: projectId },
                })
                : router.push("/screens/company/floorplan")
            }
            onPressEditProject={() =>
              projectId
                ? router.push({
                  pathname: "/screens/company/editproject",
                  params: {
                    id: projectId,
                    companyId: data?.client.companyId,
                  },
                })
                : router.push("/screens/company/editproject")
            }
          />
        )}

        <ProjectDetailsMenu
          items={menuItems}
          onPressItem={(item) => {
            const route = MENU_ROUTES[item];
            if (route) {
              if (projectId) {
                router.push({ pathname: route, params: { id: projectId } });
              } else {
                router.push(route);
              }
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
