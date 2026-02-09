import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TaskItem, TaskStatus } from "../task/types";
import TaskDetailMetaItem from "./TaskDetailMetaItem";
import TaskInventoryRow from "./TaskInventoryRow";
import TaskPhotoCard from "./TaskPhotoCard";
import { getTaskDetailsPreset } from "./taskDetailsPreset";

type TaskDetailsScreenProps = {
  task?: TaskItem;
};

const PHOTO_URL =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop";

function toStatusBadge(status: TaskStatus | undefined) {
  if (!status) return "PENDING";
  if (status === "In Progress") return "IN PROGRESS";
  return status.toUpperCase();
}

export default function TaskDetailsScreen({ task }: TaskDetailsScreenProps) {
  const preset = getTaskDetailsPreset(task?.status);
  const description = task?.description?.trim() || preset.description;

  return (
    <View className="mt-6 px-5 pb-8">
      <View className="rounded-[16px] border border-[#D6DCE3] bg-[#F7F9FB] p-4">
        <Text className="text-[16px] font-semibold text-[#1F2937]">Task Details</Text>
        <Text className="mt-3 text-[14px] leading-6 text-[#5B6472]">{description}</Text>

        <TaskDetailMetaItem
          icon="location-outline"
          label="Project"
          value={task?.location || preset.project}
          statusBadgeText={toStatusBadge(task?.status)}
        />
        <TaskDetailMetaItem
          icon="person-outline"
          label="Assigned To"
          value={task?.assignee || preset.assignedTo}
        />
        <TaskDetailMetaItem
          icon="calendar-outline"
          label="Due Date"
          value={task?.dueDate || preset.dueDate}
        />
        <TaskDetailMetaItem
          icon="time-outline"
          label="Estimated Time"
          value={preset.estimatedTime}
        />
      </View>

      <TaskPhotoCard title="Before Photo" imageUrl={PHOTO_URL} />
      <TaskPhotoCard title="After Photo" imageUrl={PHOTO_URL} />

      <View className="mt-5 rounded-[16px] border border-[#D6DCE3] bg-[#F7F9FB] p-4">
        <Text className="text-[16px] font-semibold text-[#1F2937]">Task Report Summary</Text>
        <Text className="mt-5 text-[15px] leading-8 text-[#6B7280]">
          &quot;{preset.reportSummary}&quot;
        </Text>
      </View>

      <View className="mt-6 rounded-[16px] bg-[#EEF2F6] p-3">
        <Text className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#8194AE]">
          Inventory Used
        </Text>

        <View className="mt-2">
          {preset.inventory.map((item) => (
            <TaskInventoryRow key={item.label} label={item.label} quantity={item.quantity} />
          ))}
        </View>
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.9}
          className="h-[52px] w-[47.8%] items-center justify-center rounded-[12px] border border-[#CCD4DD] bg-[#F7F9FB]"
        >
          <Text className="text-[16px] font-medium text-[#1E1E1E]">Reject Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          className="h-[52px] w-[47.8%] items-center justify-center rounded-[12px] bg-[#1E5371]"
        >
          <Text className="text-[16px] font-medium text-[#F3F7FA]">Approve Work</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
