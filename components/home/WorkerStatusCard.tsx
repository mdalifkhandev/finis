import React from "react";
import { Pressable, Text, View } from "react-native";

type WorkerStatusCardProps = {
  isClockedIn: boolean;
  time?: string;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  isCheckingIn?: boolean;
  isCheckingOut?: boolean;
};

export default function WorkerStatusCard({
  isClockedIn,
  time,
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
}: WorkerStatusCardProps) {
  return (
    <View
      className={`relative mx-5 my-2 flex-row items-center justify-between rounded-xl px-4 py-3 pb-16 ${
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
      <View className="absolute -bottom-14 left-0 right-0 flex-row gap-3">
        <Pressable
          onPress={onCheckIn}
          disabled={isClockedIn || isCheckingIn}
          className={`flex-1 rounded-xl px-4 py-3 ${
            isClockedIn ? "bg-slate-200" : "bg-[#1f3d5c]"
          }`}
        >
          <Text className="text-center text-sm font-semibold text-white">
            {isCheckingIn ? "Logging In..." : "Login"}
          </Text>
        </Pressable>
        <Pressable
          onPress={onCheckOut}
          disabled={!isClockedIn || isCheckingOut}
          className={`flex-1 rounded-xl px-4 py-3 ${
            !isClockedIn ? "bg-slate-200" : "bg-[#D97706]"
          }`}
        >
          <Text className="text-center text-sm font-semibold text-white">
            {isCheckingOut ? "Logging Out..." : "Logout"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
