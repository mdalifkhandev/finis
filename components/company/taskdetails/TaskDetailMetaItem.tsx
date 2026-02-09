import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type TaskDetailMetaItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  statusBadgeText?: string;
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  "IN PROGRESS": { bg: "#DDE8FF", text: "#2051F8" },
  PENDING: { bg: "#E6EDFB", text: "#2051F8" },
  COMPLETED: { bg: "#DDF2E8", text: "#0C8F41" },
};

export default function TaskDetailMetaItem({
  icon,
  label,
  value,
  statusBadgeText,
}: TaskDetailMetaItemProps) {
  const badgeStyle = statusBadgeText
    ? STATUS_STYLES[statusBadgeText] ?? STATUS_STYLES.PENDING
    : null;

  return (
    <View className="mt-2.5 flex-row items-center justify-between rounded-[10px] border border-[#D6DCE3] bg-[#F8FAFC] px-3 py-2.5">
      <View className="flex-row items-center pr-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#D7E6F8]">
          <Ionicons name={icon} size={20} color="#5F6775" />
        </View>

        <View className="ml-3">
          <Text className="text-[14px] text-[#6B7280]">{label}</Text>
          <Text className="mt-0.5 text-[15px] font-medium text-[#111827]">{value}</Text>
        </View>
      </View>

      {badgeStyle && statusBadgeText ? (
        <View className="rounded-md px-2.5 py-1.5" style={{ backgroundColor: badgeStyle.bg }}>
          <Text className="text-[12px] font-semibold" style={{ color: badgeStyle.text }}>
            {statusBadgeText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
