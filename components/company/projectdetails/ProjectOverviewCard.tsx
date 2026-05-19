import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useProjectData } from "../project/projectStore";

const avatarUrl =
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop";

type ProjectOverviewCardProps = {
  projectName?: string;
  projectCompany?: string;
  projectLocation?: string;
  dateRange?: string;
  projectLogoUrl?: string | null;
  onPressFloorPlan?: () => void;
  onPressEditProject?: () => void;
};

export default function ProjectOverviewCard({
  projectName,
  projectCompany,
  projectLocation,
  dateRange,
  projectLogoUrl,
  onPressFloorPlan,
  onPressEditProject,
}: ProjectOverviewCardProps) {
  const project = useProjectData();
  const resolvedProjectName = projectName || project.projectName || "Riverside Tower";
  const resolvedProjectCompany = projectCompany || project.company || "Horizon Builders Inc.";
  const resolvedProjectLocation =
    projectLocation || project.location || "123 Construction Blvd, Toronto, ON";
  const resolvedDateRange =
    dateRange || `${project.startDate || "2025-08-01"} - ${project.endDate || "Ongoing"}`;
  const resolvedAvatar = projectLogoUrl || avatarUrl;

  return (
    <View className="mx-5 mt-6 overflow-hidden rounded-[14px] bg-[#225879] p-3">
      <View className="absolute -left-20 top-9 h-64 w-64 rounded-full border-[10px] border-[rgba(131,177,205,0.2)]" />
      <View className="absolute -right-16 -top-10 h-56 w-56 rounded-full border-[10px] border-[rgba(131,177,205,0.22)]" />
      <View className="absolute -right-20 bottom-0 h-64 w-64 rounded-full border-[10px] border-[rgba(131,177,205,0.18)]" />

      <View className="flex-row items-center">
        <Image source={{ uri: resolvedAvatar }} className="h-14 w-14 rounded-full" />
        <View className="ml-3">
          <Text className="text-[16px] font-semibold text-white">
            {resolvedProjectName}
          </Text>
          <Text className="mt-1 text-[14px] text-[#9BD9B4]">@maya.louis</Text>
        </View>
      </View>

      <View className="mt-3 rounded-xl bg-[rgba(136,175,201,0.45)] px-3.5 py-3">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#EAF2F8" />
          <Text className="ml-3 flex-1 text-[14px] text-white">
            {resolvedProjectLocation}
          </Text>
        </View>

        <View className="mt-2.5 flex-row items-center">
          <Ionicons name="business-outline" size={16} color="#EAF2F8" />
          <Text className="ml-3 text-[14px] text-white">{resolvedProjectCompany}</Text>
        </View>

        <View className="mt-2.5 flex-row items-center">
          <Ionicons name="globe-outline" size={16} color="#EAF2F8" />
          <Text className="ml-3 text-[14px] text-white">{resolvedDateRange}</Text>
        </View>
      </View>

      <View className="mt-3 flex-row justify-between">
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={onPressFloorPlan}
          className="h-10 w-[48.5%] items-center justify-center rounded-[10px] bg-[#BBDCED]"
        >
          <Text className="text-[16px] font-medium text-[#111827]">
            Floor plan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={onPressEditProject}
          className="h-10 w-[48.5%] items-center justify-center rounded-[10px] bg-[#F2F4F6]"
        >
          <Text className="text-[16px] font-medium text-[#111827]">
            Edit Project
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
