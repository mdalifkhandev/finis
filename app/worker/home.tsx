import { router } from "expo-router";
import React from "react";
import { ScrollView, View, ActivityIndicator, RefreshControl, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEFAULT_AVATAR_URL } from "@/api/auth/auth.constants";
import { API_BASE_URL } from "@/lib/config";
import { useWorkerProfileQuery } from "@/hooks/profile/profile";
import { useWorkerDashboardQuery } from "@/hooks/worker/dashboard";
import { WorkerDashboardTask } from "@/api/worker/dashboard.api";

function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl) {
    return DEFAULT_AVATAR_URL;
  }
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://") || avatarUrl.startsWith("file://")) {
    return avatarUrl;
  }
  return `${API_BASE_URL}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
}
import HomeHeader from "../../components/home/HomeHeader";
import SectionHeader from "../../components/home/SectionHeader";
import StatCard from "../../components/home/StatCard";
import WeeklyActivityItem from "../../components/home/WeeklyActivityItem";
import WorkerStatusCard from "../../components/home/WorkerStatusCard";
import WorkerTaskCard from "../../components/home/WorkerTaskCard";

const WEEKLY_ACTIVITY = [
  { day: "Monday", status: "8 hours", type: "completed" as const },
  {
    day: "Tuesday",
    status: "2h 34m (In Progress)",
    type: "in-progress" as const,
  },
  { day: "Wednesday", status: "Scheduled", type: "scheduled" as const },
];

export default function WorkerHome() {
  const { data: profile } = useWorkerProfileQuery();
  const { data: dashboard, isLoading, refetch, isRefetching } = useWorkerDashboardQuery();
  
  const avatarUrl = resolveAvatarUrl(profile?.avatarUrl);
  const displayName = profile?.fullName?.trim().split(" ")[0] || "Welcome Back";
  const subtitle = profile?.role ? `${profile.role}!` : "Worker!";

  const todayTasksCount = dashboard?.stats?.todayTasksCount ?? 0;
  const completedToday = dashboard?.stats?.completedToday ?? 0;
  const isClockedIn = dashboard?.stats?.clockStatus === "clocked_in";

  const getClockInTime = () => {
    if (!isClockedIn || !dashboard?.stats?.clockInTime) return undefined;
    return new Date(dashboard.stats.clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#1f3d5c" colors={["#1f3d5c"]} />
        }
      >
        <HomeHeader
          name={displayName}
          subtitle={subtitle}
          avatarUrl={avatarUrl}
          onPressAvatar={() => router.push("/worker/profile")}
        />

        {isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1f3d5c" />
            <Text className="mt-2 text-xs text-slate-500">Loading dashboard...</Text>
          </View>
        ) : (
          <>
            <View className="flex-row justify-between px-5 mt-6">
              <StatCard icon="trending-up" value={String(todayTasksCount)} label="Today`s Tasks" />
              <StatCard icon="people" value={String(completedToday)} label="Completed" />
            </View>

            <View className="mt-4">
              <WorkerStatusCard isClockedIn={isClockedIn} time={getClockInTime()} />
            </View>

            <View className="mt-6">
              <SectionHeader
                title="Today`s Tasks"
                actionLabel="View All"
                onPressAction={() => {}}
              />
              <View className="mt-2">
                {dashboard?.todayTasks?.length ? (
                  dashboard.todayTasks.map((task: WorkerDashboardTask) => (
                    <WorkerTaskCard
                      key={task.id}
                      priority={task.priority?.toUpperCase() as any}
                      title={task.title}
                      location={`${task.project?.name || "Project"}${task.floor?.name ? " - " + task.floor.name : ""}`}
                      assignedAvatars={[]}
                      commentsCount={task._count?.reports || 0}
                      onPress={() => router.push("/screens/worker/viewtask")}
                    />
                  ))
                ) : (
                  <View className="items-center py-4">
                    <Text className="text-slate-500 text-sm">No tasks for today.</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        <View className="mt-4 pb-10">
          <SectionHeader
            title="This Week"
            actionLabel="View All"
            onPressAction={() => {}}
          />
          <View className="mx-5 mt-2 rounded-3xl bg-white p-5 border border-slate-100 shadow-sm">
            {WEEKLY_ACTIVITY.map((item, index) => (
              <WeeklyActivityItem
                key={index}
                day={item.day}
                status={item.status}
                type={item.type}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

