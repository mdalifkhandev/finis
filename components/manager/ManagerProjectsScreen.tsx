import AssignedProjectCard from "@/components/company/assignedprojects/AssignedProjectCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=256&auto=format&fit=crop",
];

const assignedProjects = [
  {
    priority: "MEDIUM" as const,
    title: "Electrical rough-in",
    site: "Riverside Tower",
    date: "Sept 18,  2024",
    checklist: "0/3",
    links: "2",
    extraMembers: "3+",
  },
  {
    priority: "HIGH" as const,
    title: "Facade alignment",
    site: "Lakeside Plaza",
    date: "Oct 04,  2024",
    checklist: "1/4",
    links: "5",
    extraMembers: "6+",
  },
];

export default function ManagerProjectsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-8">
          <Text className="text-[28px] font-semibold text-[#1F2328]">Projects</Text>
          <Text className="mt-1 text-[15px] text-[#66707B]">Track active project execution and setup.</Text>
        </View>

        <View className="mt-5 px-5">
          {assignedProjects.map((project, index) => (
            <AssignedProjectCard
              key={`${project.priority}-${index}`}
              priority={project.priority}
              title={project.title}
              site={project.site}
              date={project.date}
              checklist={project.checklist}
              links={project.links}
              extraMembers={project.extraMembers}
              avatars={avatars}
              onPress={() => router.push("/screens/company/projectdetails")}
            />
          ))}
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
