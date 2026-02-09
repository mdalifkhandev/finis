import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskFormField from "@/components/company/task/TaskFormField";
import { setTaskDraft } from "@/components/company/task/taskStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateTaskRoute() {
  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleNext = () => {
    setTaskDraft({
      title: title.trim() || "Untitled Task",
      location: projectName.trim() || "Riverside Tower",
      description: description.trim(),
      priority: priority.trim() || "Medium",
      dueDate: dueDate.trim() || "Today",
    });

    router.push("/screens/company/assigntask");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={14}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 36 }}
        >
          <BackTitleHeader
            title="Create New Task"
            onBack={() => router.back()}
          />

          <View className="mt-8 px-5">
            <TaskFormField
              label="Task Title"
              placeholder="Enter task title"
              value={title}
              onChangeText={setTitle}
            />

            <View className="mt-4">
              <TaskFormField
                label="Project"
                placeholder="Enter Project title"
                value={projectName}
                onChangeText={setProjectName}
              />
            </View>

            <View className="mt-4">
              <TaskFormField
                label="Description"
                placeholder="Task description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <TaskFormField
                  label="Priority"
                  value={priority}
                  onChangeText={setPriority}
                />
              </View>
              <View className="flex-1">
                <TaskFormField
                  label="Due Date"
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNext}
              className="mt-5 h-[56px] items-center justify-center rounded-[10px] bg-[#1E5371]"
            >
              <Text className="text-[16px] font-medium text-[#F4F8FA]">
                Next: Assign Task
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
