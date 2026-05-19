import BackTitleHeader from "@/components/common/BackTitleHeader";
import AssignedProjectCard from "@/components/company/assignedprojects/AssignedProjectCard";
import { useCompanyProjectsQuery } from "@/hooks/company/company";
import { API_BASE_URL } from "@/lib/config";
import type { CompanyProjectTeamMember } from "@/types/company.types";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fallbackAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=256&auto=format&fit=crop",
];

function resolveAvatarUrl(avatarUrl: string | null) {
  if (!avatarUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(avatarUrl)) {
    return avatarUrl;
  }

  return `${API_BASE_URL}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPriority(value?: string): "MEDIUM" | "HIGH" | "LOW" {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "high" || normalized === "active") return "HIGH";
  if (
    normalized === "medium" ||
    normalized === "meduim" ||
    normalized === "pending"
  )
    return "MEDIUM";
  if (normalized === "low") return "LOW";
  return "LOW";
}

export default function AssignedProjectsRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const companyId = typeof id === "string" ? id : undefined;
  const { data, isLoading } = useCompanyProjectsQuery(companyId);

  return (
    <SafeAreaView className="flex-1 bg-[#e9edf1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <BackTitleHeader
          title="Assigned Projects"
          onBack={() => router.back()}
        />

        {isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1d4f6d" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading projects...
            </Text>
          </View>
        ) : Array.isArray(data) && data.length > 0 ? (
          <View className="mt-6 px-5">
            {data.map((project) => {
              const avatars = project.teamMembers
                .map((member: CompanyProjectTeamMember) =>
                  resolveAvatarUrl(member.user.avatarUrl),
                )
                .filter((avatar: string | null): avatar is string =>
                  Boolean(avatar),
                );

              return (
                <AssignedProjectCard
                  key={project.id}
                  priority={getPriority(project.priority ?? project.status)}
                  title={project.name}
                  site={project.location}
                  date={formatDate(project.startDate)}
                  checklist={`0/${project._count.tasks}`}
                  links={String(project._count.tasks)}
                  extraMembers={`${project._count.teamMembers}+`}
                  avatars={avatars.length ? avatars : fallbackAvatars}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/company/projectdetails",
                      params: { id: project.id },
                    })
                  }
                />
              );
            })}
          </View>
        ) : (
          <View className="mt-10 items-center px-5">
            <Text className="text-sm text-slate-500">No projects found.</Text>
          </View>
        )}

        <View className="mt-7 px-5">
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() =>
              companyId
                ? router.push({
                    pathname: "/screens/company/createproject",
                    params: { id: companyId },
                  })
                : router.push("/screens/company/createproject")
            }
            className="h-[52px] w-full flex-row items-center justify-center gap-2 rounded-[12px] bg-[#1D4F6D] px-8 py-3"
            style={styles.buttonChrome}
          >
            <Text className="text-center text-[16px] font-medium leading-6 text-[#EAEFE9]">
              Create Project & Setup Floors
            </Text>
          </TouchableOpacity>
        </View>
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
