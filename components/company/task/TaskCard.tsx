import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskItem } from "./types";

type TaskCardProps = {
  task: TaskItem;
  onPress?: () => void;
  onPressUpdateStatus?: () => void;
  onPressAssignWorker?: () => void;
  subTaskCount?: number;
  completedTaskCount?: number;
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
  subTaskCount = 1,
  completedTaskCount = 0,
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

      {/* Task progress summary */}
      <View className="mt-3 flex-row gap-2.5">
        <View className="flex-1 flex-row items-center rounded-[10px] border border-[#DCE4EC] bg-[#F0F4F8] px-3 py-2.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-[#E2EAF3]">
            <Ionicons name="list-outline" size={18} color="#1E5371" />
          </View>
          <View className="ml-2.5">
            <Text className="text-[11px] text-[#667085]">Subtasks</Text>
            <Text className="text-[16px] font-semibold text-[#26313E]">{subTaskCount}</Text>
          </View>
        </View>

        <View className="flex-1 flex-row items-center rounded-[10px] border border-[#D8E9DF] bg-[#EFF8F2] px-3 py-2.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-[#DDF2E5]">
            <Ionicons name="checkmark-circle-outline" size={19} color="#168044" />
          </View>
          <View className="ml-2.5">
            <Text className="text-[11px] text-[#667085]">Completed</Text>
            <Text className="text-[16px] font-semibold text-[#168044]">{completedTaskCount}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="mt-3 mb-3 h-[0.5px] bg-black/10" />

      {/* ── Footer ── */}
      <View className="flex-row items-center justify-between gap-4">
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
