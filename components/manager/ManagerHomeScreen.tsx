import HomeHeader from "@/components/home/HomeHeader";
import ProjectCard from "@/components/home/ProjectCard";
import SectionHeader from "@/components/home/SectionHeader";
import StatCard from "@/components/home/StatCard";
import WorkerCard from "@/components/home/WorkerCard";
import { DEFAULT_AVATAR_URL } from "@/features/auth/auth.constants";
import { useAuthMeQuery } from "@/features/auth/useAuthMeQuery";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ManagerStat = {
  icon: React.ComponentProps<typeof StatCard>["icon"];
  value: string;
  label: string;
};

type ManagerProject = {
  title: string;
  status: "On Track" | "Delayed";
  workers: string;
  progress: number;
};

type SiteWorker = {
  name: string;
  role: string;
  location: string;
  status: "Active" | "Inactive";
  avatarUrl: string;
};

const stats: ManagerStat[] = [
  { icon: "trending-up", value: "56", label: "Active Projects" },
  { icon: "people", value: "85", label: "Active Orders" },
  { icon: "cash", value: "$24.5K", label: "Payroll Pending" },
  { icon: "warning-outline", value: "85", label: "Inventory Alerts" },
];

const projects: ManagerProject[] = [
  {
    title: "Riverside Tower",
    status: "On Track",
    workers: "15 workers",
    progress: 75,
  },
  {
    title: "Riverside Tower",
    status: "Delayed",
    workers: "15 workers",
    progress: 75,
  },
];

const workersOnSite: SiteWorker[] = [
  {
    name: "John Smith",
    role: "Electrician",
    location: "Riverside Tower",
    status: "Active",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
  },
  {
    name: "John Smith",
    role: "Electrician",
    location: "Riverside Tower",
    status: "Active",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
  },
  {
    name: "John Smith",
    role: "Electrician",
    location: "Riverside Tower",
    status: "Active",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
  },
];

export default function ManagerHomeScreen() {
  useAuthMeQuery();
  const user = useAuthStore((state) => state.user);
  const avatarUrl = user?.avatarUrl || DEFAULT_AVATAR_URL;
  const displayName = user?.fullName?.trim() || "Welcome Back";
  const subtitle = user?.role ? `${user.role}!` : "Manager!!";

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <HomeHeader
          name={displayName}
          subtitle={subtitle}
          avatarUrl={avatarUrl}
          onPressAvatar={() => router.push("/screens/profile")}
        />

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
          <SectionHeader title="Active Projects" actionLabel="View All" />
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${project.status}-${index}`}
              title={project.title}
              status={project.status}
              workers={project.workers}
              progress={project.progress}
            />
          ))}
        </View>

        <View className="mt-6 pb-2">
          <SectionHeader title="Workers On Site" actionLabel="View All" />
          {workersOnSite.map((worker, index) => (
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
