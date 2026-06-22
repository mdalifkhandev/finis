import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskItem } from "./types";

type TaskCardProps = {
  task: TaskItem;
  onPress?: () => void;
  onPressUpdateStatus?: () => void;
  onPressAssignWorker?: () => void;
};

const PRIORITY_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  low: { label: "Low", bg: "#EAF3DE", text: "#3B6D11" },
  medium: { label: "Medium", bg: "#FAEEDA", text: "#854F0B" },
  high: { label: "High", bg: "#FCEBEB", text: "#A32D2D" },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "#FAEEDA", text: "#854F0B" },
  completed: { label: "Completed", bg: "#EAF3DE", text: "#3B6D11" },
  "in progress": { label: "In Progress", bg: "#E6F1FB", text: "#185FA5" },
};

export default function TaskCard({
  task,
  onPress,
  onPressUpdateStatus,
  onPressAssignWorker,
}: TaskCardProps) {
  const priorityKey = task.priority?.toLowerCase() || "low";
  const priorityStyle = PRIORITY_CONFIG[priorityKey] || PRIORITY_CONFIG.low;

  const statusKey = task.status?.toLowerCase() || "pending";
  const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="mt-2.5 rounded-xl border border-[#D6DBE2] bg-[#F7F9FB] px-3.5 py-3.5"
    >
      {/* Title row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#2A66FF"
          />
          <Text className="ml-2 text-[16px] text-[#2A313B] w-[200px]" numberOfLines={1}>{task.title}</Text>
        </View>
        <View
          className="self-start rounded-full px-2.5 py-0.5"
          style={{ backgroundColor: statusStyle.bg }}
        >
          <Text
            className="text-[11px] font-medium"
            style={{ color: statusStyle.text }}
          >
            {statusStyle.label}
          </Text>
        </View>
      </View>

      {/* Location + Created date */}
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#536174" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C] max-w-[210px]">
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

      {/* Assignee + Due date */}
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="person-outline" size={16} color="#536174" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {task.assignee ?? "Unassigned"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#4C596C" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {task.dueDate}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="mt-3 mb-3 h-[0.5px] bg-black/10" />

      {/* ── Footer ── */}
      <View className="flex-row items-center justify-between gap-4">
        {/* Left — status + priority stacked badges */}
        {/* <View className="gap-y-1.5"> */}
        {/* <View
            className="self-start rounded-full px-2.5 py-0.5"
            style={{ backgroundColor: statusStyle.bg }}
          >
            <Text className="text-[11px] font-medium" style={{ color: statusStyle.text }}>
              {statusStyle.label}
            </Text>
          </View> */}

        {/* <View
            className="self-start rounded-full px-2.5 py-0.5"
            style={{ backgroundColor: priorityStyle.bg }}
          >
            <Text className="text-[11px] font-medium" style={{ color: priorityStyle.text }}>
              {priorityStyle.label}
            </Text>
          </View> */}
        {/* </View> */}

        {/* Right — action buttons side by side */}
        {/* <View className="flex-row items-center gap-x-2"> */}
        <TouchableOpacity
          className="rounded-lg border border-black/20 px-3 py-1.5 flex-1"
          activeOpacity={0.7}
          onPress={(e) => {
            e.stopPropagation();
            onPressAssignWorker?.();
          }}
        >
          <Text className="text-[13px] font-medium text-[#2A313B] text-center">
            Assign Worker
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-lg bg-[#1E5371] px-3 py-1.5 flex-1"
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            onPressUpdateStatus?.();
          }}
        >
          <Text className="text-[13px] font-medium text-white text-center">
            Update Status
          </Text>
        </TouchableOpacity>
      </View>

      {/* </View> */}
    </TouchableOpacity>
  );
}
