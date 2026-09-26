import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProjectCard from "@/components/home/ProjectCard";
import { useActiveProjectsQuery } from "@/hooks/admin/admin";

export default function ProjectsScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching } = useActiveProjectsQuery(page, limit);

  const projects = (data ?? []).map((project) => ({
    projectId: project.id,
    title: project.name || "Project",
    status: (project.status?.toLowerCase() === "delayed"
      ? "Delayed"
      : "On Track") as "On Track" | "Delayed",
    workers: `${project.teamCount ?? 0} workers`,
    progress: Number(project.progress ?? 0),
  }));
  const hasMoreProjects = projects.length === limit;

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="ml-3 text-lg font-semibold text-slate-900">
          Active Projects
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {(isLoading || isFetching) && !projects.length ? (
          <View className="mt-10 items-center px-5">
            <ActivityIndicator size="small" color="#1f3d5c" />
            <Text className="mt-2 text-sm text-slate-500">
              Loading projects...
            </Text>
          </View>
        ) : projects.length ? (
          projects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              projectId={project.projectId}
              title={project.title}
              status={project.status}
              workers={project.workers}
              progress={project.progress}
            />
          ))
        ) : (
          <View className="mt-10 items-center px-5">
            <Text className="text-sm text-slate-500">No projects found.</Text>
          </View>
        )}

        <View className="mt-6 flex-row items-center justify-between px-5">
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => setPage((current) => Math.max(1, current - 1))}
            className={`rounded-full px-4 py-2 ${
              page === 1 ? "bg-slate-200" : "bg-slate-900"
            }`}
            activeOpacity={0.85}
          >
            <Text className={`text-xs font-semibold ${page === 1 ? "text-slate-400" : "text-white"}`}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text className="text-xs text-slate-500">Page {page}</Text>

          <TouchableOpacity
            disabled={!hasMoreProjects || isFetching}
            onPress={() => setPage((current) => current + 1)}
            className={`rounded-full px-4 py-2 ${!hasMoreProjects || isFetching ? "bg-slate-300" : "bg-slate-900"}`}
            activeOpacity={0.85}
          >
            <Text className={`text-xs font-semibold ${!hasMoreProjects || isFetching ? "text-slate-500" : "text-white"}`}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
