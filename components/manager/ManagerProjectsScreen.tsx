import AssignedProjectCard from "@/components/company/assignedprojects/AssignedProjectCard";
import { useAdminDashboardQuery, useAdminProjectsQuery } from "@/hooks/admin/admin";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const avatars = [null, null, null];

export default function ManagerProjectsScreen() {
  const { data: dashboard, isLoading, refetch } = useAdminDashboardQuery();
  const { data: adminProjects } = useAdminProjectsQuery();
  const role = useAuthStore((state) => state.user?.role);
  const canCreateProject = role === "admin";
  const assignedProjects = dashboard?.activeProjects.data ?? [];
  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await refetch();
  });

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <View className="px-5 pt-8">
          <Text className="text-[28px] font-semibold text-[#1F2328]">
            Projects
          </Text>
          <Text className="mt-1 text-[15px] text-[#66707B]">
            Track active project execution and setup.
          </Text>
        </View>

        <View className="mt-5 px-5">
          {isLoading ? (
            <View className="mt-10 items-center">
              <ActivityIndicator size="small" color="#1d4f6d" />
            </View>
          ) : (
            assignedProjects.map((project) => (
              <AssignedProjectCard
                key={project.id}
                priority={
                  (project.progress ?? 0) >= 70
                    ? "HIGH"
                    : (project.progress ?? 0) >= 35
                      ? "MEDIUM"
                      : "LOW"
                }
                title={project.name}
                site={project.companyName}
                date={new Date(project.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                checklist={`0/${project.teamCount ?? 0}`}
                links="0"
                extraMembers={`${project.teamCount ?? 0}+`}
                avatars={avatars}
                onPress={() =>
                  router.push({
                    pathname: "/screens/company/projectdetails",
                    params: { id: project.id },
                  })
                }
              />
            ))
          )}
        </View>

        {canCreateProject ? (
          <View className="mt-7 px-5">
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={() => {
                const companyId =
                  adminProjects?.[0]?.company?.id ??
                  (assignedProjects as Array<{ companyId?: string }>)[0]?.companyId;

                if (!companyId) {
                  router.push("/screens/company/createproject");
                  return;
                }

                router.push({
                  pathname: "/screens/company/createproject",
                  params: { id: companyId },
                });
              }}
              className="h-[52px] w-full flex-row items-center justify-center gap-2 rounded-[12px] bg-[#1D4F6D] px-8 py-3"
              style={styles.buttonChrome}
            >
              <Text className="text-center text-[16px] font-medium leading-6 text-[#EAEFE9]">
                Create Project & Setup Floors
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonChrome: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    borderBottomWidth: 1,
    borderBottomColor: "#1D4F6D",
  },
});
