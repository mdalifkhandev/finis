import React from "react";
import { Text, View } from "react-native";

type WorkerStatusCardProps = {
  isClockedIn: boolean;
  time?: string;
};

export default function WorkerStatusCard({
  isClockedIn,
  time,
}: WorkerStatusCardProps) {
  return (
    <View
      className={`mx-5 my-2 flex-row items-center justify-between rounded-xl px-4 py-3 ${
        isClockedIn ? "bg-[#D1F0FF]" : "bg-[#D1F0FF]/50"
      }`}
    >
      <View className="flex-row items-center">
        <View
          className={`h-2.5 w-2.5 rounded-full ${
            isClockedIn ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        <Text className="ml-2 text-sm font-medium text-slate-700">
          {isClockedIn ? "Clocked In" : "Not Clocked In"}
        </Text>
      </View>
      <Text className="text-sm font-bold text-slate-900">
        {isClockedIn ? time : "-- : --"}
      </Text>
    </View>
  );
}
