import { DEFAULT_AVATAR_URL } from "@/api/auth/auth.constants";
import { useAdminDashboardQuery } from "@/hooks/admin/admin";
import { useAuthMeQuery } from "@/hooks/auth/auth";
import { API_BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "@/components/home/HomeHeader";
import InviteButton from "@/components/home/InviteButton";
import ProjectCard from "@/components/home/ProjectCard";
import SectionHeader from "@/components/home/SectionHeader";
import StatCard from "@/components/home/StatCard";
import WorkerCard from "@/components/home/WorkerCard";

function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl) {
    return DEFAULT_AVATAR_URL;
  }
  return avatarUrl;
}

export default function ManagerHomeScreen() {
  const { data: profile, isLoading: isProfileLoading, refetch: refetchProfile } =
    useAuthMeQuery();
  const dashboardQuery = useAdminDashboardQuery();
  const dashboard = dashboardQuery.data;
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const avatarUrl = resolveAvatarUrl(profile?.avatarUrl);
  const displayName = profile?.fullName?.trim().split(" ")[0] || "Welcome Back";
  const subtitle = profile?.role ? `${profile.role}!` : "Manager!!";

  const handleRefresh = async () => {
    await Promise.all([refetchProfile(), dashboardQuery.refetch()]);
  };

  const refreshing = isProfileLoading || dashboardQuery.isRefetching;

  const stats = [
    {
      icon: "trending-up-outline" as const,
      value: String(dashboard?.stats.activeProjects ?? 0),
      label: "Active Projects",
    },
    {
      icon: "people-outline" as const,
      value: String(dashboard?.stats.workersOnSite ?? 0),
      label: "Active Worker",
    },
    {
      icon: "cash-outline" as const,
      value: String(dashboard?.stats.payrollPending ?? 0),
      label: "Payroll Pending",
    },
    {
      icon: "alert-circle-outline" as const,
      value: String(dashboard?.stats.inventoryAlerts ?? 0),
      label: "Inventory Alerts",
    },
  ];

  const projects = (dashboard?.activeProjects.data ?? []).map((project) => ({
    projectId: project.id,
    title: project.name || "Project",
    status: (project.status?.toLowerCase() === "delayed"
      ? "Delayed"
      : "On Track") as "On Track" | "Delayed",
    workers: `${project.teamCount ?? 0} workers`,
    progress: Number(project.progress ?? 0),
  }));

  const workers = (dashboard?.workersOnSite.data ?? []).map((worker) => ({
    workerId: worker.id,
    name: worker.fullName || "Worker",
    role: worker.role || "Worker",
    location: "On Site",
    status: "Active" as const,
    avatarUrl: worker.avatarUrl || DEFAULT_AVATAR_URL,
  }));

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <HomeHeader
          name={displayName}
          subtitle={subtitle}
          avatarUrl={avatarUrl}
          onPressBell={() => router.push("/screens/notifications")}
          onPressAvatar={() => router.push("/screens/profile")}
        />

        {((dashboardQuery.isLoading || isProfileLoading) && !dashboard) || !isHydrated ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1f3d5c" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading dashboard...
            </Text>
          </View>
        ) : null}

        <View className="mt-6 flex-row flex-wrap justify-between gap-y-4 px-5">
          {stats.map((item) => (
            <StatCard
              key={item.label}
              icon={item.icon}
              value={item.value}
              label={item.label}
            />
          ))}
        </View>

   

        <View className="mt-6">
          <SectionHeader
            title="Active Projects"
            actionLabel="View All"
            onPressAction={() => router.push("/screens/home/projects")}
          />
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              projectId={project.projectId}
              title={project.title}
              status={project.status}
              workers={project.workers}
              progress={project.progress}
            />
          ))}
        </View>

        <View className="mt-6">
          <SectionHeader
            title="Workers On Site"
            actionLabel="View All"
            onPressAction={() => router.push("/screens/home/workers")}
          />
          {workers.map((worker, index) => (
            <WorkerCard
              key={`${worker.name}-${index}`}
              workerId={worker.workerId}
              name={worker.name}
              role={worker.role}
              location={worker.location}
              status={worker.status}
              avatarUrl={worker.avatarUrl}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
