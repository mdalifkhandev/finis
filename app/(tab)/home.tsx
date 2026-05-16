import InviteButton from "@/components/home/InviteButton";
import ProjectCard from "@/components/home/ProjectCard";
import SectionHeader from "@/components/home/SectionHeader";
import StatCard from "@/components/home/StatCard";
import WorkerCard from "@/components/home/WorkerCard";
import { useAdminDashboardQuery } from "@/hooks/admin/admin";
import { DEFAULT_AVATAR_URL } from "@/api/auth/auth.constants";
import { useAuthMeQuery } from "@/hooks/auth/auth";
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
import HomeHeader from "../../components/home/HomeHeader";

export default function Home() {
  const authMeQuery = useAuthMeQuery();
  const dashboardQuery = useAdminDashboardQuery();
  const dashboard = dashboardQuery.data;
  const user = useAuthStore((state) => state.user);
  const avatarUrl = user?.avatarUrl ?? DEFAULT_AVATAR_URL;
  const displayName = user?.fullName?.trim() || "Welcome Back";
  const subtitle = user?.role ? `${user.role}!` : "Admin!!";
  const handleRefresh = async () => {
    await Promise.all([authMeQuery.refetch(), dashboardQuery.refetch()]);
  };
  const refreshing = authMeQuery.isRefetching || dashboardQuery.isRefetching;
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
    title: project.name || "Project",
    status: (project.status?.toLowerCase() === "delayed"
      ? "Delayed"
      : "On Track") as
      | "On Track"
      | "Delayed",
    workers: `${project.teamCount ?? 0} workers`,
    progress: Number(project.progress ?? 0),
  }));
  const workers = (dashboard?.workersOnSite.data ?? []).map((worker) => ({
    name: worker.fullName || "Worker",
    role: worker.role || "Worker",
    location: "On Site",
    status: "Active" as const,
    avatarUrl: worker.avatarUrl || DEFAULT_AVATAR_URL,
  }));

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
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
          onPressAvatar={() => router.push("/screens/profile")}
        />

        {(dashboardQuery.isLoading || authMeQuery.isLoading) && !dashboard ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1f3d5c" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading dashboard...
            </Text>
          </View>
        ) : null}

        {/* Temporary Developer Toggle to Switch Roles */}
        {/* <View className="px-5 mt-4">
          <TouchableOpacity
            onPress={() => router.replace("/worker/home")}
            className="flex-row items-center justify-center bg-slate-900 h-12 rounded-xl border border-slate-700 shadow-sm"
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal" size={18} color="white" className="mr-2" />
            <Text className="text-white font-semibold ml-2">Switch to Worker View (Dev)</Text>
          </TouchableOpacity>
        </View> */}

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

        <InviteButton />

        <View className="mt-6">
          <SectionHeader title="Active Projects" actionLabel="View All" />
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              title={project.title}
              status={project.status}
              workers={project.workers}
              progress={project.progress}
            />
          ))}
        </View>

        <View className="mt-6">
          <SectionHeader title="Workers On Site" actionLabel="View All" />
          {workers.map((worker, index) => (
            <WorkerCard
              key={`${worker.name}-${index}`}
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
