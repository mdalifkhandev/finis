import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FloorStatusBadge, { FloorStatus } from "./FloorStatusBadge";

type FloorRoomItemProps = {
  name: string;
  details: string;
  status: FloorStatus;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function FloorRoomItem({
  name,
  details,
  status,
  onEdit,
  onDelete,
}: FloorRoomItemProps) {
  return (
    <View className="mt-3.5 flex-row items-center justify-between rounded-[10px] bg-[#EFF1F4] px-3 py-3.5">
      <View className="pr-3">
        <Text className="text-[16px] font-medium text-[#1C2026]">{name}</Text>
        <Text className="text-[14px] text-[#536173]">{details}</Text>
      </View>

      <View className="flex-row items-center">
        <FloorStatusBadge status={status} />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onEdit}
          className="ml-3 h-7 w-7 items-center justify-center"
        >
          <Ionicons name="pencil-outline" size={18} color="#2A5F83" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDelete}
          className="ml-1 h-7 w-7 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
