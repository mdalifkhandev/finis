import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ProjectAnalysisTaskCardProps = {
  title: string;
  subtitle: string;
  units: string;
  date: string;
  status: "Completed" | "Pending" | "Not Started" | "In Progress";
  onPressCheck?: () => void;
};

export default function ProjectAnalysisTaskCard({
  title,
  subtitle,
  units,
  date,
  status,
  onPressCheck,
}: ProjectAnalysisTaskCardProps) {
  const isCompleted = status === "Completed";
  const accentColor =
    status === "Completed"
      ? "#5C61F0"
      : status === "Pending"
        ? "#F4B501"
        : "#BFC1C5";

  return (
    <View className="mt-2.5 flex-row items-center">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressCheck}
        className={`h-6 w-6 items-center justify-center rounded-full ${
          isCompleted
            ? "bg-[#5C61F0]"
            : "border-2 border-[#8F8F8F] bg-transparent"
        }`}
      >
        {isCompleted ? (
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        ) : null}
      </TouchableOpacity>

      <View
        className={`ml-2.5 flex-1 overflow-hidden rounded-xl border px-4 py-3 ${
          isCompleted
            ? "border-[#D7D9F2] bg-[#E6E7F7]"
            : "border-[#D5D9DF] bg-[#F7F9FB]"
        }`}
      >
        <View
          className="absolute bottom-0 left-0 top-0 w-[4px]"
          style={{ backgroundColor: accentColor }}
        />

        <Text className="text-[16px] font-medium text-[#15171C]">{title}</Text>
        <Text className="mt-0.5 text-[14px] text-[#6F7785]">{subtitle}</Text>

        <View className="mt-2 flex-row items-center">
          <Text className="text-[12px] font-medium text-[#131820]">
            {units}
          </Text>
          <Text className="mx-2 text-[12px] text-[#131820]">•</Text>
          <Ionicons name="calendar-outline" size={12} color="#131820" />
          <Text className="ml-1 text-[12px] text-[#131820]">{date}</Text>
        </View>
      </View>
    </View>
  );
}
