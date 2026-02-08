import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LocationLog } from "./types";

type LocationLogsCardProps = {
  logs: LocationLog[];
};

export default function LocationLogsCard({ logs }: LocationLogsCardProps) {
  return (
    <View className="mt-4 px-5">
      <View className="rounded-3xl border border-[#E2E8EE] bg-[#F7F9FB]">
        <View className="flex-row items-center border-b border-[#D8DEE6] px-4 py-4">
          <Ionicons name="navigate-outline" size={19} color="#111827" />
          <Text className="ml-2 text-[17px] font-semibold text-[#111827]">
            Location Logs
          </Text>
        </View>

        {logs.map((log, index) => (
          <View
            key={`${log.name}-${index}`}
            className={`px-4 py-3 ${index !== logs.length - 1 ? "border-b border-[#E5EAF0]" : ""}`}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-semibold text-[#111827]">
                {log.name}
              </Text>
              <View className="rounded-full border border-[#D3DAE2] bg-[#F8FAFC] px-3 py-1">
                <Text className="text-[11px] font-semibold text-[#111827]">
                  {log.status}
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-[14px] text-[#6B7280]">
              {log.time} {"\u2022"} {log.location}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          activeOpacity={0.85}
          className="items-center border-t border-[#D8DEE6] py-4"
        >
          <Text className="text-[16px] font-medium text-[#2563EB]">
            View Full History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
