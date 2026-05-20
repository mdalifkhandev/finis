import React from "react";
import { Text, View } from "react-native";

export type FloorStatus = "Completed" | "In Progress" | "Not Started" | "Pending";

type FloorStatusBadgeProps = {
  status: FloorStatus;
};

const toneByStatus: Record<FloorStatus, { bg: string; text: string }> = {
  Completed: { bg: "#D1F1DC", text: "#0E984D" },
  "In Progress": { bg: "#D8E6FF", text: "#1F5EFF" },
  "Not Started": { bg: "#ECEFF3", text: "#596579" },
  Pending: { bg: "#FBE8D2", text: "#E58B18" },
};

export default function FloorStatusBadge({ status }: FloorStatusBadgeProps) {
  const tone = toneByStatus[status];

  return (
    <View
      className="rounded-lg px-3 py-1.5"
      style={{ backgroundColor: tone.bg }}
    >
      <Text className="text-[12px] font-medium" style={{ color: tone.text }}>
        {status}
      </Text>
    </View>
  );
}
