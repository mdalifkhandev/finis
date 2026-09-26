import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ZoneViolationAlertCardProps = {
  distanceM?: number;
  occurredAt?: string;
  geofenceName?: string;
  description?: string;
  onViewDetails?: () => void;
};

export default function ZoneViolationAlertCard({
  distanceM,
  occurredAt,
  geofenceName,
  description,
  onViewDetails,
}: ZoneViolationAlertCardProps) {
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
          {description ? (
            <>
              <Text className="mt-1 text-[14px] leading-6 text-[#4B5563]">
                {description}
              </Text>
              <Text className="-mt-1 text-[14px] leading-6 text-[#4B5563]">
                {geofenceName ? `the ${geofenceName} zone` : "the designated zone"} at{" "}
                {occurredAt ? new Date(occurredAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                }) : "--:--"}.
              </Text>
            </>
          ) : (
            <Text className="mt-1 text-[14px] leading-6 text-[#4B5563]">
              No active zone violations found.
            </Text>
          )}
          <TouchableOpacity activeOpacity={0.85} onPress={onViewDetails} className="mt-2">
            <Text className="text-[16px] font-medium text-[#2563EB]">
              View Incident Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
