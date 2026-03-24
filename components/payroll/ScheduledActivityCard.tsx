import React from "react";
import { Text, View } from "react-native";
import { ActivityItem } from "./types";

type ScheduledActivityCardProps = {
  activity: ActivityItem;
};

export default function ScheduledActivityCard({
  activity,
}: ScheduledActivityCardProps) {
  return (
    <View className="mt-3 rounded-[12px] border border-[#E3E6EA] bg-white px-4 py-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[14px] font-medium text-[#111827]">
          {activity.title}
        </Text>
        <Text className="text-[13px] text-[#667085]">{activity.dateLabel}</Text>
      </View>

      <View className="mt-3 self-start rounded-[4px] bg-[#DCE8FA] px-2 py-1">
        <Text className="text-[11px] text-[#1E5ADB]">
          {activity.workersLabel}
        </Text>
      </View>
    </View>
  );
}
