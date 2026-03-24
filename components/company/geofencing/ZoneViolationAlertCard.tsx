import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ZoneViolationAlertCard() {
  return (
    <View className="mt-4 px-5">
      <View className="flex-row rounded-3xl border-2 border-[#EAB308] bg-[#FFFDF2] px-4 py-4">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F9EDB7]">
          <Ionicons name="warning-outline" size={20} color="#A16207" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[17px] font-semibold text-[#1F2937]">
            Zone Violation Alert
          </Text>
          <Text className="mt-1 text-[14px] leading-6 text-[#4B5563]">
            Worker <Text className="font-semibold">Mike Wilson</Text> was
            detected 50m outside
          </Text>
          <Text className="-mt-1 text-[14px] leading-6 text-[#4B5563]">
            the designated zone at 09:45 AM.
          </Text>
          <TouchableOpacity activeOpacity={0.85} className="mt-2">
            <Text className="text-[16px] font-medium text-[#2563EB]">
              View Incident Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
