import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "@/components/home/HomeHeader";
import StatCard from "@/components/home/StatCard";
import SectionHeader from "@/components/home/SectionHeader";
import ProjectCard from "@/components/home/ProjectCard";

const stats = [
  { icon: "briefcase-outline", value: "18", label: "Managed Projects" },
  { icon: "checkmark-done-outline", value: "42", label: "Open Tasks" },
  { icon: "cube-outline", value: "12", label: "Inventory Alerts" },
  { icon: "document-text-outline", value: "7", label: "Pending Quotes" },
] as const;

const projects = [
  { title: "Riverside Tower", status: "On Track" as const, workers: "12 workers", progress: 82 },
  { title: "Lakeside Plaza", status: "Delayed" as const, workers: "8 workers", progress: 56 },
];

const avatarUrl =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop";

export default function ManagerHomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <HomeHeader
          name="Welcome Back"
          subtitle="Manager!!"
          avatarUrl={avatarUrl}
          onPressAvatar={() => router.push("/screens/profile")}
        />

        <View className="mt-6 flex-row flex-wrap justify-between gap-y-4 px-5">
          {stats.map((item) => (
            <StatCard key={item.label} icon={item.icon} value={item.value} label={item.label} />
          ))}
        </View>

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

        <View className="mt-6 px-5">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/manager/quotes")}
            className="h-[52px] flex-row items-center justify-center rounded-[12px] bg-[#1E5371]"
          >
            <Ionicons name="receipt-outline" size={20} color="#F4F8FA" />
            <Text className="ml-2 text-[16px] font-medium text-[#F4F8FA]">Review Quotes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
