import AssignedProjectCard from "@/components/company/assignedprojects/AssignedProjectCard";
import { useAdminProjectsQuery } from "@/hooks/admin/admin";
import { router } from "expo-router";
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

export default function ManagerProjectsScreen() {
  const { data: projects, isLoading } = useAdminProjectsQuery();


  const visibleProjects = (projects ?? []).map((project) => ({
    priority:
      (project.priority?.toUpperCase() as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM",
    title: project.name,
    site: project.location || project.company.name,
    date: new Date(project.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    checklist: `${project._count.tasks}/${project._count.floors}`,
    links: String(project._count.teamMembers),
    extraMembers:
      project.teamMembers.length > 0 ? `${project.teamMembers.length}+` : "0+",
    teamMembers: project.teamMembers,
    id: project.id,
  }));

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-5 pt-8">
          <Text className="text-[28px] font-semibold text-[#1F2328]">
            Projects
          </Text>
          <Text className="mt-1 text-[15px] text-[#66707B]">
            Track active project execution and setup.
          </Text>
        </View>

        <View className="mt-5 px-5">
          {isLoading ? (
            <View className="mt-10 items-center">
              <ActivityIndicator size="small" color="#1D4F6D" />
            </View>
          ) : (
            visibleProjects.map((project) => (
              <AssignedProjectCard
                key={project.id}
                priority={project.priority}
                title={project.title}
                site={project.site}
                date={project.date}
                checklist={project.checklist}
                links={project.links}
                extraMembers={project.extraMembers}
                avatars={project.teamMembers.map((member) => member.user.avatarUrl)}
                onPress={() =>
                  router.push({
                    pathname: "/screens/company/projectdetails",
                    params: { id: project.id },
                  })
                }
              />
            ))
          )}
        </View>

        <View className="mt-7 px-5">
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => router.push("/screens/company/createproject")}
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
