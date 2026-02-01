import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cardShadow } from "./styles";

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
};

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <View className="w-[48%] rounded-2xl bg-white p-4" style={cardShadow}>
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        <Ionicons name={icon} size={18} color="#0f172a" />
      </View>
      <Text className="mt-3 text-lg font-semibold text-slate-900">{value}</Text>
      <Text className="text-xs text-slate-500">{label}</Text>
    </View>
  );
}
