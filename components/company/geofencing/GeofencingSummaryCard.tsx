import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type GeofencingSummaryCardProps = {
  onAddNewZonePress?: () => void;
  onProjectPress?: () => void;
  name?: string;
  hideProjectSelector?: boolean;
};

export default function GeofencingSummaryCard({
  onAddNewZonePress,
  onProjectPress,
  name,
  hideProjectSelector = false,
}: GeofencingSummaryCardProps) {
  return (
    <View className="mt-6 px-5">
      <View className="rounded-3xl border border-[#E3E8ED] bg-[#F7F9FB] p-4">
        <View className="flex-row">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-[#1D5677]">
            <Ionicons name="map-outline" size={20} color="#FFFFFF" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[17px] font-semibold text-[#1F2937]">
              Geofencing & Location
            </Text>
            <Text className="mt-1 text-[14px] leading-6 text-[#667085]">
              Define project boundaries and monitor worker presence
            </Text>
          </View>
        </View>

  

        {hideProjectSelector ? (
          <View className="mt-3 h-12 flex-row items-center justify-center rounded-[14px] border border-[#D6DCE3] bg-[#F6F8FA]">
            <Text className="text-[16px] text-[#1F2937]">
              {name || "Project"}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={onProjectPress}
            className="mt-3 h-12 flex-row items-center justify-center rounded-[14px] border border-[#D6DCE3] bg-[#F6F8FA]"
          >
            <Text className="text-[16px] text-[#1F2937]">{name || "Select Project"}</Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#111827"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
