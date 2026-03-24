import React from "react";
import { Text, View } from "react-native";

type TaskInventoryRowProps = {
  label: string;
  quantity: string;
};

export default function TaskInventoryRow({
  label,
  quantity,
}: TaskInventoryRowProps) {
  return (
    <View className="flex-row items-center justify-between rounded-[14px] border border-[#DDE3EA] bg-white px-4 py-3 shadow-sm">
      <Text className="text-[14px] text-[#162236]">{label}</Text>
      <View className="rounded-[6px] bg-[#F3F6FA] px-2.5 py-1">
        <Text className="text-[14px] font-semibold text-[#111827]">
          {quantity}
        </Text>
      </View>
    </View>
  );
}
