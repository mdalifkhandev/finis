import InviteButton from "@/components/home/InviteButton";
import ProjectCard from "@/components/home/ProjectCard";
import SectionHeader from "@/components/home/SectionHeader";
import StatCard from "@/components/home/StatCard";
import WorkerCard from "@/components/home/WorkerCard";
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

const avatarUrl =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <HomeHeader
          name="Welcome Back"
          subtitle="Admin!!"
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

