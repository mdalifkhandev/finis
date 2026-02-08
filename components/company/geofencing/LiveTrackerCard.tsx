import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function LiveTrackerCard() {
  return (
    <View className="mt-4 px-5">
      <View className="overflow-hidden rounded-3xl bg-[#0B1733] px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="locate-outline" size={20} color="#22C55E" />
            <Text className="ml-2 text-[17px] font-semibold text-white">
              Live Tracker
            </Text>
          </View>
          <View className="rounded-md bg-[#14532D] px-2 py-1">
            <Text className="text-[12px] text-[#86EFAC]">Live</Text>
          </View>
        </View>

        <View className="mt-3 flex-row justify-between">
          <Text className="text-[14px] text-[#B8C1D1]">Workers on Site</Text>
          <Text className="text-[24px] font-semibold text-white">12</Text>
        </View>
        <View className="mt-1 flex-row justify-between">
          <Text className="text-[14px] text-[#B8C1D1]">Outside Zone</Text>
          <Text className="text-[24px] font-semibold text-[#FACC15]">0</Text>
        </View>

        <View className="mt-4 h-2 rounded-full bg-[#1F2A44]">
          <View className="h-2 w-full rounded-full bg-[#22C55E]" />
        </View>
      </View>
    </View>
  );
}
