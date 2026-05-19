import React from "react";
import { Text, View } from "react-native";

type PriorityBadgeProps = {
  level: "MEDIUM" | "HIGH" | "LOW" | string | undefined;
};

const stylesByPriority = {
  MEDIUM: {
    container: "bg-[rgba(255,246,216,0.5)]",
    text: "text-[#FFD33C]",
  },
  HIGH: {
    container: "bg-[rgba(255,233,233,0.6)]",
    text: "text-[#ee4747]",
  },
  LOW: {
    container: "bg-[rgba(226,245,236,0.7)]",
    text: "text-[#43b77f]",
  },
} as const;

export default function PriorityBadge({ level }: PriorityBadgeProps) {
  const normalizedLevel = (level ?? "").toUpperCase();
  const safeLevel =
    normalizedLevel === "HIGH"
      ? "HIGH"
      : normalizedLevel === "LOW"
        ? "LOW"
        : "MEDIUM";
  const styles = stylesByPriority[safeLevel];

  return (
    <View
      className={`flex-row items-start gap-2 rounded px-4 py-1 ${styles.container}`}
    >
      <Text
        className={`text-[12px] font-semibold leading-[18px] ${styles.text}`}
      >
        {safeLevel}
      </Text>
    </View>
  );
}
