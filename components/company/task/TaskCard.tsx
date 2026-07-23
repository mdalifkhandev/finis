import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/store/auth.store";
import { TaskItem } from "./types";

type TaskCardProps = {
  task: TaskItem;
  onPress?: () => void;
  onPressUpdateStatus?: () => void;
  onPressAssignWorker?: () => void;
  onPressSubtaskAction?: () => void;
  subTaskCount?: number;
  completedTaskCount?: number;
  isActionLoading?: boolean;
  subtaskActionLabel?: string;
  subtaskActionDisabled?: boolean;
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
  inactive: { label: "Inactive", bg: "#F2F4F7", text: "#667085" },
  completed: { label: "Completed", bg: "#EAF3DE", text: "#3B6D11" },
  "in progress": { label: "In Progress", bg: "#E6F1FB", text: "#185FA5" },
  review: { label: "Review", bg: "#F1EDFF", text: "#6941C6" },
  revision: { label: "Revision", bg: "#FFEDD5", text: "#C2410C" },
};

export default function TaskCard({
  task,
  onPress,
  onPressUpdateStatus,
  onPressAssignWorker,
  onPressSubtaskAction,
  subTaskCount = 0,
  completedTaskCount = 0,
  isActionLoading = false,
  subtaskActionLabel,
  subtaskActionDisabled = true,
}: TaskCardProps) {
  const currentUserRole = useAuthStore((state) => state.user?.role);
  const priorityKey = task.priority?.toLowerCase() || "low";
  const priorityStyle = PRIORITY_CONFIG[priorityKey] || PRIORITY_CONFIG.low;

  const statusKey = task.status?.toLowerCase() || "pending";
  const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const isAdminRole = currentUserRole === "admin";
  const isManagerRole = currentUserRole === "manager";
  const isMainTaskCard =
    (isAdminRole || isManagerRole) && Boolean(onPressAssignWorker || onPressUpdateStatus);
  const isSubtaskCard = Boolean(subtaskActionLabel);
  const hasApprovedSubtasks =
    subTaskCount > 0 && completedTaskCount > 0 && completedTaskCount === subTaskCount;

  let actionLabel = "Update Status";
  let actionDisabled = isActionLoading;
  let actionVariant = "primary";

  if (task.completionDecision === "approved" || task.status === "Completed") {
    actionLabel = "Complete Task";
    actionDisabled = true;
    actionVariant = "muted";
  } else if (task.approvalDecision !== "approved") {
    actionLabel = "Activate Task";
  } else if (hasApprovedSubtasks && task.rawStatus?.toLowerCase() === "review") {
    actionLabel = "Approve ";
  } else if (task.approvalDecision === "approved") {
    actionLabel = "Activated";
    actionDisabled = true;
    actionVariant = "muted";
  }

  const shouldShowAssignWorkerButton = isAdminRole;
  const shouldDisableManagerAction = isManagerRole && actionLabel === "Activate Task";
  const resolvedActionDisabled = actionDisabled || shouldDisableManagerAction;

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
          <Text className="ml-1.5 text-[14px] text-[#4C596C] max-w-[210px]" numberOfLines={2}>
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
            {task.assignee ?? "Assigned Worker 0"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#4C596C" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {task.dueDate}
          </Text>
        </View>
      </View>
      
      {/* Subtask progress */}
      {isMainTaskCard&&<View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="list-outline" size={17} color="#536174" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            Subtasks
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="checkmark-done-outline" size={17} color="#168044" />
          <Text className="ml-1.5 text-[14px] text-[#4C596C]">
            {completedTaskCount} of {subTaskCount} completed
          </Text>
        </View>
      </View>}

      {/* Divider */}
      {isMainTaskCard || isSubtaskCard ? <View className="mt-3 mb-3 h-[0.5px] bg-black/10" /> : null}

      {isMainTaskCard ? (
        <View className="flex-row items-center justify-between gap-4">
          {shouldShowAssignWorkerButton ? (
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
          ) : null}

          <TouchableOpacity
            disabled={resolvedActionDisabled}
            className={`rounded-lg px-3 py-1.5 ${
              shouldShowAssignWorkerButton ? "flex-1" : "w-full"
            } ${
              actionVariant === "muted" ? "bg-[#B7C4CE]" : "bg-[#1E5371]"
            } ${resolvedActionDisabled && actionVariant !== "muted" ? "opacity-70" : ""}`}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              onPressUpdateStatus?.();
            }}
          >
            <Text className="text-[13px] font-medium text-white text-center">
              {actionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {isSubtaskCard ? (
        <TouchableOpacity
          disabled={subtaskActionDisabled || isActionLoading}
          className={`h-[40px] items-center justify-center rounded-lg ${
            subtaskActionDisabled || isActionLoading ? "bg-[#B7C4CE]" : "bg-[#1E5371]"
          }`}
          activeOpacity={0.85}
          onPress={(e) => {
            e.stopPropagation();
            onPressSubtaskAction?.();
          }}
        >
          <Text className="text-[13px] font-medium text-white text-center">
            {subtaskActionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* </View> */}
    </TouchableOpacity>
  );
}
