import React from "react";
import { Text, View } from "react-native";

type InventoryStatCardProps = {
  value: string;
  label: string;
};

export default function InventoryStatCard({ value, label }: InventoryStatCardProps) {
  return (
    <View className="w-[48.6%] rounded-3xl border border-[#DEE4EA] bg-[#F7F9FB] px-4 py-4 shadow-sm">
      <Text className="text-[40px] font-semibold leading-[48px] text-[#1D5478]">{value}</Text>
      <Text className="mt-1 text-[16px] text-[#6B7280]">{label}</Text>
    </View>
  );
}
