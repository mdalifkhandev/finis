import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import TaskCard from "./TaskCard";
import TaskFilterTabs, { TaskFilter } from "./TaskFilterTabs";
import { updateTaskStatus, useTaskItems } from "./taskStore";
import type { TaskItem, TaskStatus } from "./types";
import UpdateTaskStatusModal from "./UpdateTaskStatusModal";

export default function TaskScreen() {
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [searchText, setSearchText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const tasks = useTaskItems();

  const selectedTask = useMemo<TaskItem | null>(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const filteredTasks = useMemo(() => {
    const byFilter = tasks.filter((task) => {
      if (filter === "All") return true;
      if (filter === "Progress") return task.status === "In Progress";
      return task.status === filter;
    });

    const query = searchText.trim().toLowerCase();
    if (!query) return byFilter;

    return byFilter.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.location.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query),
    );
  }, [filter, searchText, tasks]);

  const handleSelectStatus = (status: TaskStatus) => {
    if (!selectedTaskId) return;
    updateTaskStatus(selectedTaskId, status);
    setSelectedTaskId(null);
  };

  return (
    <View className="mt-6 px-5">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/screens/company/createtask")}
        className="h-[52px] flex-row items-center justify-center rounded-[10px] bg-[#1E5371]"
      >
        <Ionicons name="add" size={22} color="#F4F8FA" />
        <Text className="ml-2 text-[16px] font-medium text-[#F4F8FA]">
          Create New Task
        </Text>
      </TouchableOpacity>

      <View className="mt-3.5 h-[48px] flex-row items-center rounded-[13px] border border-[#CDD4DB] bg-[#F5F7F9] px-3">
        <Ionicons name="search-outline" size={24} color="#7C8594" />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search......"
          placeholderTextColor="#A0A8B5"
          className="ml-2 flex-1 text-[15px] text-[#26313E]"
        />
      </View>

      <TaskFilterTabs value={filter} onChange={setFilter} />

      <View className="mt-2">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() =>
              router.push({
                pathname: "/screens/company/taskdetails",
                params: { taskId: task.id },
              })
            }
            onPressUpdateStatus={() => setSelectedTaskId(task.id)}
          />
        ))}
      </View>

      <UpdateTaskStatusModal
        visible={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onSelectStatus={handleSelectStatus}
      />
    </View>
  );
}
