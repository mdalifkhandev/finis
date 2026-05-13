import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TaskItem, TaskStatus } from "../task/types";
import TaskDetailMetaItem from "./TaskDetailMetaItem";
import TaskExpensesCard, { TaskExpenseDocument } from "./TaskExpensesCard";
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
  const [reviewDescription, setReviewDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<TaskExpenseDocument[]>([]);

  const handleUploadFile = async () => {
    try {
      const DocumentPicker = await import("expo-document-picker");
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      setUploadedFiles((previous) => {
        const existing = new Set(previous.map((file) => file.id));
        const nextFiles = result.assets
          .map((asset) => ({
            id: `${asset.name}-${asset.size ?? 0}-${asset.uri}`,
            name: asset.name,
            uri: asset.uri,
            size: asset.size,
            mimeType: asset.mimeType,
          }))
          .filter((file) => !existing.has(file.id));

        return [...previous, ...nextFiles];
      });
    } catch {
      Alert.alert("Upload failed", "Unable to pick files right now.");
    }
  };

  const handleRemoveDocument = (id: string) => {
    setUploadedFiles((previous) => previous.filter((file) => file.id !== id));
  };

  return (
    <View className="mt-5 px-5 pb-8">
      <View className="rounded-[16px] border border-[#DADFE5] bg-white p-3.5">
        <Text className="text-[15px] font-semibold text-[#1F2937]">
          Task Details
        </Text>
        <Text className="mt-4 text-[13px] leading-[26px] text-[#5B6472]">
          {description}
        </Text>

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

      <View className="mt-5 rounded-[16px] border border-[#DADFE5] bg-white p-4">
        <Text className="text-[15px] font-semibold text-[#1F2937]">
          Task Report Summary
        </Text>
        <Text className="mt-5 text-[13px] leading-[24px] text-[#737B88]">
          &quot;{preset.reportSummary}&quot;
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-[12px] font-medium uppercase tracking-[1.8px] text-[#8B9BB5]">
          Inventory Used
        </Text>

        <View className="mt-3 gap-3">
          {preset.inventory.map((item) => (
            <TaskInventoryRow
              key={item.label}
              label={item.label}
              quantity={item.quantity}
            />
          ))}
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-[15px] font-semibold text-[#1F2937]">
          Task Expenses
        </Text>
        <TaskExpensesCard
          documents={uploadedFiles}
          onRemoveDocument={handleRemoveDocument}
        />
      </View>

      <View className="mt-6">
        <Text className="text-[15px] font-semibold text-[#1F2937]">
          Review & Decision
        </Text>

        <View className="mt-3">
          <Text className="text-[13px] text-[#374151]">Description</Text>
          <TextInput
            value={reviewDescription}
            onChangeText={setReviewDescription}
            placeholder="Review description"
            placeholderTextColor="#A0A8B5"
            multiline
            textAlignVertical="top"
            className="mt-2 h-[112px] rounded-[12px] border border-[#D7DEE7] bg-white px-4 py-3 text-[15px] text-[#111827]"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleUploadFile}
          className="mt-4 h-[52px] flex-row items-center justify-center rounded-[12px] bg-[#1E5371]"
        >
          <Ionicons name="cloud-upload-outline" size={20} color="#F3F7FA" />
          <Text className="ml-2 text-[16px] font-medium text-[#F3F7FA]">
            Upload File
          </Text>
        </TouchableOpacity>

        {uploadedFiles.length ? (
          <Text className="mt-2 text-[12px] text-[#6B7280]">
            {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""}{" "}
            selected
          </Text>
        ) : null}
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.9}
          className="h-[52px] w-[47.5%] items-center justify-center rounded-[12px] border border-[#D6DDE5] bg-white"
        >
          <Text className="text-[16px] font-medium text-[#1E1E1E]">
            Reject Task
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          className="h-[52px] w-[47.5%] items-center justify-center rounded-[12px] bg-[#1E5371]"
        >
          <Text className="text-[16px] font-medium text-[#F3F7FA]">
            Approve Work
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
