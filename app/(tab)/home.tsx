import InviteButton from "@/components/home/InviteButton";
import ProjectCard from "@/components/home/ProjectCard";
import SectionHeader from "@/components/home/SectionHeader";
import StatCard from "@/components/home/StatCard";
import WorkerCard from "@/components/home/WorkerCard";
import { DEFAULT_AVATAR_URL } from "@/features/auth/auth.constants";
import { useAuthMeQuery } from "@/features/auth/useAuthMeQuery";
import { useAuthStore } from "@/stores/auth-store";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "../../components/home/HomeHeader";

const stats = [
  { icon: "trending-up-outline", value: "56", label: "Active Projects" },
  { icon: "people-outline", value: "85", label: "Active Orders" },
  { icon: "cash-outline", value: "$24.5K", label: "Payroll Pending" },
  { icon: "alert-circle-outline", value: "85", label: "Inventory Alerts" },
] as const;

const projects = [
  {
    title: "Riverside Tower",
    status: "On Track" as const,
    workers: "15 workers",
    progress: 75,
  },
  {
    title: "Riverside Tower",
    status: "Delayed" as const,
    workers: "15 workers",
    progress: 75,
  },
];

const workers = [
  {
    name: "John Smith",
    role: "Electrician",
    location: "Riverside Tower",
    status: "Active" as const,
  },
  {
    name: "John Smith",
    role: "Electrician",
    location: "Riverside Tower",
    status: "Active" as const,
  },
  {
    name: "John Smith",
    role: "Electrician",
    location: "Riverside Tower",
    status: "Active" as const,
  },
];

export default function Home() {
  useAuthMeQuery();
  const user = useAuthStore((state) => state.user);
  const avatarUrl = user?.avatarUrl || DEFAULT_AVATAR_URL;
  const displayName = user?.fullName?.trim() || "Welcome Back";
  const subtitle = user?.role ? `${user.role}!` : "Admin!!";

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
              avatarUrl={avatarUrl}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
