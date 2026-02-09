import React from "react";
import { Text, View } from "react-native";

type TaskInventoryRowProps = {
  label: string;
  quantity: string;
};

export default function TaskInventoryRow({ label, quantity }: TaskInventoryRowProps) {
  return (
    <View className="mt-2.5 flex-row items-center justify-between rounded-[14px] border border-[#DCE1E8] bg-[#F8FAFC] px-4 py-3">
      <Text className="text-[15px] text-[#162236]">{label}</Text>
      <View className="rounded-md bg-[#EEF2F7] px-2.5 py-1.5">
        <Text className="text-[15px] font-semibold text-[#111827]">{quantity}</Text>
      </View>
    </View>
  );
}
