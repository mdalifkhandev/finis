import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type WorkerItem = {
  id: string;
  name: string;
  role: string;
  initial: string;
  available: boolean;
};

type AssignWorkerCardProps = {
  worker: WorkerItem;
  assigned: boolean;
  onAssign: () => void;
};

export default function AssignWorkerCard({
  worker,
  assigned,
  onAssign,
}: AssignWorkerCardProps) {
  return (
    <View className="mt-2.5 rounded-xl border border-[#D6DBE2] bg-[#F7F9FB] px-3 py-3">
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#24577A]">
          <Text className="text-[22px] font-medium text-white">
            {worker.initial}
          </Text>
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-[19px] font-medium text-[#1F2937]">
            {worker.name}
          </Text>
          <Text className="text-[15px] text-[#6B7280]">{worker.role}</Text>
        </View>

        {worker.available ? (
          <View className="mr-2 rounded-md bg-[#D0EDD6] px-3 py-1">
            <Text className="text-[15px] text-[#138C42]">Available</Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAssign}
          className={`h-10 min-w-[82px] items-center justify-center rounded-md border ${
            assigned
              ? "border-[#1E5B80] bg-[#1E5B80]"
              : "border-[#2F6287] bg-transparent"
          }`}
        >
          <Text
            className={`text-[17px] ${assigned ? "text-white" : "text-[#1E5B80]"}`}
          >
            {assigned ? "Assigned" : "Assign"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
