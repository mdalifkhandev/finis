import React from "react";
import { Text, View } from "react-native";

export default function MapLegend() {
  return (
    <View className="rounded-2xl bg-white/95 p-3 border border-[#E5EAF0]">
      <Text className="text-[14px] font-medium text-[#6B7280]">Map Legend</Text>
      <View className="mt-2 flex-row flex-wrap items-center gap-y-2">
        <View className="mr-4 flex-row items-center">
          <View className="h-3 w-3 rounded bg-[#DDE7FA]" />
          <Text className="ml-1 text-[13px] text-[#1F2937]">Active Zone</Text>
        </View>
        <View className="mr-4 flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-[#22C55E]" />
          <Text className="ml-1 text-[13px] text-[#1F2937]">
            Worker (In Zone)
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-[#EF4444]" />
          <Text className="ml-1 text-[13px] text-[#1F2937]">
            Worker (Outside)
          </Text>
        </View>
      </View>
    </View>
  );
}
