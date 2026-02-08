import React from "react";
import { Text, View } from "react-native";

type FloorStatsRowProps = {
  completed: number;
  inProgress: number;
  notStarted: number;
};

export default function FloorStatsRow({
  completed,
  inProgress,
  notStarted,
}: FloorStatsRowProps) {
  return (
    <View className="mt-5 flex-row items-start justify-between">
      <View className="flex-1 items-center">
        <Text className="text-[16px] font-medium text-[#12A04D]">{completed}</Text>
        <Text className="mt-0.5 text-[14px] text-[#4C596C]">Completed</Text>
      </View>

      <View className="flex-1 items-center">
        <Text className="text-[16px] font-medium text-[#1F5EFF]">{inProgress}</Text>
        <Text className="mt-0.5 text-[14px] text-[#4C596C]">In Progress</Text>
      </View>

      <View className="flex-1 items-center">
        <Text className="text-[16px] font-medium text-[#5C6675]">{notStarted}</Text>
        <Text className="mt-0.5 text-[14px] text-[#4C596C]">Not Started</Text>
      </View>
    </View>
  );
}
