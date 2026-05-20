import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import TaskStatusPill from "./TaskStatusPill";
import { TaskItem } from "./types";

type TaskCardProps = {
  task: TaskItem;
  onPress?: () => void;
  onPressUpdateStatus?: () => void;
};

export default function TaskCard({
  task,
  onPress,
  onPressUpdateStatus,
}: TaskCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="mt-2.5 rounded-xl border border-[#D6DBE2] bg-[#F7F9FB] px-3.5 py-3.5"
    >
      <View className="flex-row items-center">
        <Ionicons name="information-circle-outline" size={18} color="#2A66FF" />
        <Text className="ml-2 flex-1 text-[16px] text-[#2A313B]">
          {task.title}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#536174" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {task.location}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#4C596C" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {task.startDate}
          </Text>
        </View>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="person-outline" size={16} color="#536174" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {task.assignee}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#4C596C" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {task.dueDate}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <TaskStatusPill status={task.status} />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={(event) => {
            event.stopPropagation();
            onPressUpdateStatus?.();
          }}
        >
          <Text className="text-[16px] font-medium text-[#1B5A83]">
            Update Status
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
