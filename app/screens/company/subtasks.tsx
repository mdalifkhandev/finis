import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskCard from "@/components/company/task/TaskCard";
import TaskFilterTabs, { TaskFilter } from "@/components/company/task/TaskFilterTabs";
import UpdateTaskStatusModal from "@/components/company/task/UpdateTaskStatusModal";
import type { TaskItem, TaskStatus } from "@/components/company/task/types";
import { useTasksQuery, useUpdateTaskStatusMutation } from "@/hooks/company/company";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function mapStatus(status: string): TaskStatus {
  const normalized = status.toLowerCase();
  if (normalized === "in_progress") return "In Progress";
  if (normalized === "completed") return "Completed";
  return "Pending";
}

function mapStatusToApi(status: TaskStatus) {
  if (status === "In Progress") return "in_progress";
  if (status === "Completed") return "completed";
  return "pending";
}

export default function SubtasksRoute() {
  const params = useLocalSearchParams<{
    parentTaskId?: string;
    projectId?: string;
    title?: string;
  }>();
  const projectId = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId;
  const parentTaskId = Array.isArray(params.parentTaskId)
    ? params.parentTaskId[0]
    : params.parentTaskId;
  const taskTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("All");

  const tasksQuery = useTasksQuery({
    page: 1,
    limit: 100,
    projectId,
    search: taskTitle,
  });
  const updateStatusMutation = useUpdateTaskStatusMutation();

  const subtasks = useMemo<TaskItem[]>(() => {
    return (tasksQuery.data?.data ?? [])
      .filter((task) => !taskTitle || task.title === taskTitle)
      .map((task) => ({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        location: `${task.floor?.name || "Floor"} - ${task.room?.name || "Unit"}`,
        assignee: task.assignee?.fullName || "Unassigned",
        startDate: new Date(task.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        dueDate: new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        status: mapStatus(task.status),
        description: task.description,
        priority: task.priority,
      }));
  }, [taskTitle, tasksQuery.data]);

  const filteredSubtasks = useMemo(() => {
    if (filter === "All") return subtasks;
    if (filter === "Progress") {
      return subtasks.filter((task) => task.status === "In Progress");
    }
    return subtasks.filter((task) => task.status === filter);
  }, [filter, subtasks]);

  const handleCreateSubtask = () => {
    if (!projectId) return;
    router.push({
      pathname: "/screens/company/createsubtask",
      params: {
        projectId,
        parentTaskId,
        parentTaskTitle: taskTitle,
      },
    });
  };

  const handleUpdateStatus = (status: TaskStatus) => {
    if (!selectedTask) return;
    updateStatusMutation.mutate(
      { id: selectedTask.id, status: mapStatusToApi(status) },
      {
        onSuccess: () => {
          setSelectedTask(null);
          void tasksQuery.refetch();
        },
      },
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
        refreshControl={
          <RefreshControl
            refreshing={tasksQuery.isRefetching}
            onRefresh={() => void tasksQuery.refetch()}
            tintColor="#1E5371"
            colors={["#1E5371"]}
          />
        }
      >
        <BackTitleHeader title="Subtasks" onBack={() => router.back()} />

        <View className="px-5 pt-5">
          <View className="mb-4 rounded-[14px] border border-[#D7DEE7] bg-[#F7F9FB] px-4 py-3">
            <Text className="text-[12px] text-[#667085]">Parent Task</Text>
            <Text className="mt-1 text-[17px] font-semibold text-[#26313E]">
              {taskTitle || "Task"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCreateSubtask}
            disabled={!projectId}
            className={`h-[52px] flex-row items-center justify-center rounded-[10px] ${
              projectId ? "bg-[#1E5371]" : "bg-[#AAB7C2]"
            }`}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
            <Text className="ml-2 text-[16px] font-medium text-white">Create Subtask</Text>
          </TouchableOpacity>

          <TaskFilterTabs value={filter} onChange={setFilter} />

          {tasksQuery.isLoading ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color="#1E5371" />
            </View>
          ) : filteredSubtasks.length ? (
            <View className="mt-3">
              {filteredSubtasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/company/taskdetails",
                      params: { taskId: task.id },
                    })
                  }
                  onPressAssignWorker={() =>
                    router.push({
                      pathname: "/screens/company/assigntask",
                      params: { taskId: task.id, projectId },
                    })
                  }
                  onPressUpdateStatus={() => setSelectedTask(task)}
                />
              ))}
            </View>
          ) : (
            <View className="items-center py-16">
              <Ionicons name="list-outline" size={34} color="#98A2B3" />
              <Text className="mt-3 text-[15px] text-[#667085]">
                No {filter === "All" ? "subtasks" : filter.toLowerCase() + " subtasks"} found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <UpdateTaskStatusModal
        visible={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSelectStatus={handleUpdateStatus}
      />
    </SafeAreaView>
  );
}
