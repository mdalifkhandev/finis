import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FloorRoomItem from "./FloorRoomItem";
import FloorStatsRow from "./FloorStatsRow";
import FloorStatusBadge, { FloorStatus } from "./FloorStatusBadge";

export type RoomInfo = {
  id: string;
  floorId: string;
  roomNumber?: string;
  rawName?: string;
  details: string;
  status: FloorStatus;
  type?: string;
  sizeSqft?: number;
  progress?: number;
};

type FloorSetupCardProps = {
  floorName: string;
  roomCount: number;
  status: FloorStatus;
  completed: number;
  inProgress: number;
  notStarted: number;
  rooms?: RoomInfo[];
  onPressAddRoom?: () => void;
  onEditFloor?: () => void;
  onDeleteFloor?: () => void;
  onEditRoom?: (room: RoomInfo) => void;
  onDeleteRoom?: (roomId: string) => void;
  roomDetailsVisible?: boolean;
  onToggleRoomDetails?: () => void;
};

export default function FloorSetupCard({
  floorName,
  roomCount,
  status,
  completed,
  inProgress,
  notStarted,
  rooms,
  onPressAddRoom,
  onEditFloor,
  onDeleteFloor,
  onEditRoom,
  onDeleteRoom,
  roomDetailsVisible = false,
  onToggleRoomDetails,
}: FloorSetupCardProps) {
  const roomList = rooms ?? [];
  const hasRoomSectionContent = Boolean(onPressAddRoom) || roomList.length > 0;
  const showRoomSection = roomDetailsVisible && hasRoomSectionContent;

  return (
    <View className="mt-4 rounded-[14px] border border-[#CCD2D8] bg-[#F4F6F8] p-4">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-[16px] font-semibold text-[#1C2026]">
            {floorName}
          </Text>
          <Text className="mt-0.5 text-[14px] text-[#4E5B6D]">
            {roomCount} rooms
          </Text>
        </View>

        <View className="flex-row items-center pt-1">
          <FloorStatusBadge status={status} />
          {/* <TouchableOpacity
            activeOpacity={0.85}
            onPress={onEditFloor}
            className="ml-3 h-7 w-7 items-center justify-center"
          >
            <Ionicons name="pencil-outline" size={18} color="#2A5F83" />
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onDeleteFloor}
            className="ml-3 h-7 w-7 items-center justify-center"
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <FloorStatsRow
        completed={completed}
        inProgress={inProgress}
        notStarted={notStarted}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggleRoomDetails}
        className="mt-4 self-start"
      >
        <Text className="text-[16px] font-medium text-[#245E7D]">
          View Room Details
        </Text>
      </TouchableOpacity>

      {showRoomSection ? (
        <View className="mt-4">
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={onPressAddRoom}
            className="h-12 flex-row items-center justify-center rounded-xl bg-[#BBDCED]"
          >
            <Ionicons name="add" size={22} color="#1F252E" />
            <Text className="ml-1.5 text-[16px] font-semibold text-[#1F252E]">
              Add New Room
            </Text>
          </TouchableOpacity>

          {roomList.map((room, index) => (
            <FloorRoomItem
              key={room.id}
              name={`Room : ${room.roomNumber ?? index + 1}`}
              details={room.details}
              status={room.status}
              onEdit={() => onEditRoom?.(room)}
              onDelete={() => onDeleteRoom?.(room.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
