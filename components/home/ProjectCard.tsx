import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cardShadow } from "./styles";
import ProgressBar from "./ProgressBar";

type ProjectCardProps = {
  title: string;
  workers: string;
  progress: number;
  status: "On Track" | "Delayed";
};

const statusStyles = {
  "On Track": {
    badge: "bg-emerald-100",
    text: "text-emerald-700",
  },
  Delayed: {
    badge: "bg-orange-100",
    text: "text-orange-700",
  },
};

export default function ProjectCard({
  title,
  workers,
  progress,
  status,
}: ProjectCardProps) {
  const styles = statusStyles[status];

  return (
    <View className="mx-5 mt-4 rounded-2xl bg-white p-4" style={cardShadow}>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-slate-900">{title}</Text>
        <View className={`rounded-full px-2 py-1 ${styles.badge}`}>
          <Text className={`text-[10px] font-semibold ${styles.text}`}>
            {status}
          </Text>
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={14} color="#64748b" />
          <Text className="ml-2 text-xs text-slate-500">{workers}</Text>
        </View>
        <Text className="text-xs text-slate-500">{progress}% complete</Text>
      </View>
      <ProgressBar value={progress} />
    </View>
  );
}
