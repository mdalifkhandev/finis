import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEFAULT_AVATAR_URL } from "@/api/auth/auth.constants";
import { useAuthMeQuery } from "@/hooks/auth/useAuthMeQuery";
import { useAuthStore } from "@/store/auth.store";
import HomeHeader from "../../components/home/HomeHeader";
import SectionHeader from "../../components/home/SectionHeader";
import StatCard from "../../components/home/StatCard";
import WeeklyActivityItem from "../../components/home/WeeklyActivityItem";
import WorkerStatusCard from "../../components/home/WorkerStatusCard";
import WorkerTaskCard from "../../components/home/WorkerTaskCard";

const MOCK_TASKS = [
  {
    id: "1",
    title: "Electrical rough-in",
    location: "Riverside Tower",
    priority: "MEDIUM" as const,
    assignedAvatars: [
      "https://i.pravatar.cc/150?u=1",
      "https://i.pravatar.cc/150?u=2",
      "https://i.pravatar.cc/150?u=3",
      "https://i.pravatar.cc/150?u=4",
      "https://i.pravatar.cc/150?u=5",
    ],
    commentsCount: 2,
  },
  {
    id: "2",
    title: "Electrical rough-in",
    location: "Riverside Tower",
    priority: "HIGH" as const,
    assignedAvatars: [
      "https://i.pravatar.cc/150?u=6",
      "https://i.pravatar.cc/150?u=7",
      "https://i.pravatar.cc/150?u=8",
      "https://i.pravatar.cc/150?u=9",
      "https://i.pravatar.cc/150?u=10",
    ],
    commentsCount: 2,
  },
];

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
  useAuthMeQuery();
  const user = useAuthStore((state) => state.user);
  const avatarUrl = user?.avatarUrl ?? DEFAULT_AVATAR_URL;
  const displayName = user?.fullName?.trim() || "Welcome Back";
  const subtitle = user?.role ? `${user.role}!` : "Electrician!";

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <HomeHeader
          name={displayName}
          subtitle={subtitle}
          avatarUrl={avatarUrl}
          onPressAvatar={() => router.push("/screens/profile")}
        />

        <View className="flex-row justify-between px-5 mt-6">
          <StatCard icon="trending-up" value="3" label="Today's Tasks" />
          <StatCard icon="people" value="3" label="Completed" />
        </View>

        <View className="mt-4">
          <WorkerStatusCard isClockedIn={false} />
          <WorkerStatusCard isClockedIn={true} time="05 : 12" />
        </View>

        <View className="mt-6">
          <SectionHeader
            title="Today's Tasks"
            actionLabel="View All"
            onPressAction={() => {}}
          />
          <View className="mt-2">
            {MOCK_TASKS.map((task) => (
              <WorkerTaskCard
                key={task.id}
                priority={task.priority}
                title={task.title}
                location={task.location}
                assignedAvatars={task.assignedAvatars}
                commentsCount={task.commentsCount}
                onPress={() => router.push("/screens/worker/viewtask")}
              />
            ))}
          </View>
        </View>

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
