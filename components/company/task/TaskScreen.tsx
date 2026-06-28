import { useTasksQuery, useUpdateTaskStatusMutation } from "@/hooks/company/company";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import TaskCard from "./TaskCard";
import TaskFilterTabs, { TaskFilter } from "./TaskFilterTabs";
import { setTasks, updateTaskStatus, useTaskItems } from "./taskStore";
import type { TaskItem, TaskStatus } from "./types";
import UpdateTaskStatusModal from "./UpdateTaskStatusModal";

function mapFilterToStatus(filter: TaskFilter): string | undefined {
  if (filter === "Progress") return "in_progress";
  if (filter === "Pending") return "pending";
  if (filter === "Completed") return "completed";
  return undefined;
}

function mapStatus(status: string): TaskStatus {
  const s = status.toLowerCase();
  if (s === "in_progress") return "In Progress";
  if (s === "completed") return "Completed";
  return "Pending";
}

function mapStatusToApi(status: TaskStatus): string {
  if (status === "In Progress") return "in_progress";
  if (status === "Completed") return "completed";
  return "pending";
}


type TaskScreenProps = {
  projectId?: string;
  onCreateTaskPress?: () => void;
};

export default function TaskScreen({ projectId, onCreateTaskPress }: TaskScreenProps) {
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [searchText, setSearchText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskGroup, setTaskGroup] = useState<TaskItem[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useTasksQuery({
    page,
    limit,
    status: mapFilterToStatus(filter),
    search: searchText.trim() || undefined,
    projectId,
  });

  const tasks = useTaskItems();

  useEffect(() => {
    if (data?.data) {
      const mapped = data.data.map((task) => ({
        id: task.id,
        title: task.title,
        location: `${task.project?.name || ""} - ${task.floor?.name || ""}`,
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
        projectId: task.projectId,
        floorId: task.floorId,
        floorName: task.floor?.name,
        unitId: task.roomId,
        unitName: task.room?.name,
      }));
      setTasks(mapped);
    } else if (!isLoading) {
      setTasks([]);
    }
  }, [data, isLoading]);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, searchText]);

  const selectedTask = useMemo<TaskItem | null>(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const updateStatusMutation = useUpdateTaskStatusMutation();

  const handleSelectStatus = (status: TaskStatus) => {
    if (!selectedTaskId) return;
    updateTaskStatus(selectedTaskId, status);
    updateStatusMutation.mutate({
      id: selectedTaskId,
      status: mapStatusToApi(status),
    });
    setSelectedTaskId(null);
  };


  const totalPages = data?.meta?.totalPages || 1;

  const openTaskLocationSheet = (task: TaskItem) => {
    const relatedTasks = tasks.filter(
      (item) => item.projectId === task.projectId && item.title === task.title,
    );
    setTaskGroup(relatedTasks.length ? relatedTasks : [task]);
    setSelectedFloorId(null);
  };

  const taskFloors = useMemo(() => {
    const uniqueFloors = new Map<string, string>();
    taskGroup.forEach((task) => {
      if (task.floorId) {
        uniqueFloors.set(task.floorId, task.floorName || "Floor");
      }
    });
    return Array.from(uniqueFloors, ([id, name]) => ({ id, name }));
  }, [taskGroup]);

  const floorUnits = useMemo(
    () => taskGroup.filter((task) => task.floorId === selectedFloorId && task.unitId),
    [selectedFloorId, taskGroup],
  );

  const closeTaskLocationSheet = () => {
    setTaskGroup([]);
    setSelectedFloorId(null);
  };

  return (
    <View className="mt-6 px-5">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onCreateTaskPress}
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

      {isLoading ? (
        <View className="mt-10 items-center justify-center">
          <ActivityIndicator size="large" color="#1E5371" />
        </View>
      ) : (
        <View className="mt-2">
          {tasks.length === 0 ? (
            <View className="mt-10 items-center justify-center">
              <Text className="text-[16px] font-medium text-[#536174]">
                No tasks found
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                subTaskCount={tasks.filter(
                  (item) => item.projectId === task.projectId && item.title === task.title,
                ).length}
                completedTaskCount={tasks.filter(
                  (item) =>
                    item.projectId === task.projectId &&
                    item.title === task.title &&
                    item.status === "Completed",
                ).length}
                onPress={() => openTaskLocationSheet(task)}
                onPressUpdateStatus={() => setSelectedTaskId(task.id)}
                onPressAssignWorker={() => {
                  router.push({
                    pathname: "/screens/company/assigntask",
                    params: { taskId: task.id, projectId },
                  });
                }}
              />
            ))
          )}
        </View>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <View className="mt-6 flex-row items-center justify-between pb-6">
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            className={`h-10 items-center justify-center rounded-[9px] border px-4 ${page === 1
                ? "border-[#D2DAE1] bg-[#DFE6EA]/50 opacity-50"
                : "border-[#1F5777] bg-[#1F5777]"
              }`}
          >
            <Text
              className={`text-[15px] font-medium ${page === 1 ? "text-[#3E4B59]" : "text-white"
                }`}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <Text className="text-[15px] font-medium text-[#3E4B59]">
            Page {page} of {totalPages}
          </Text>

          <TouchableOpacity
            disabled={page === totalPages}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`h-10 items-center justify-center rounded-[9px] border px-4 ${page === totalPages
                ? "border-[#D2DAE1] bg-[#DFE6EA]/50 opacity-50"
                : "border-[#1F5777] bg-[#1F5777]"
              }`}
          >
            <Text
              className={`text-[15px] font-medium ${page === totalPages ? "text-[#3E4B59]" : "text-white"
                }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <UpdateTaskStatusModal
        visible={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onSelectStatus={handleSelectStatus}
      />

      <Modal
        visible={taskGroup.length > 0}
        transparent
        animationType="slide"
        onRequestClose={closeTaskLocationSheet}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={closeTaskLocationSheet}
        >
          <Pressable
            className="max-h-[78%] rounded-t-[24px] bg-white px-5 pb-7 pt-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-[#D8DEE5]" />
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[18px] font-semibold text-[#1F2937]">
                  {selectedFloorId ? "Select Unit" : "Select Floor"}
                </Text>
                <Text className="mt-1 text-[13px] text-[#667085]" numberOfLines={1}>
                  {taskGroup[0]?.title}
                </Text>
              </View>
              <TouchableOpacity onPress={closeTaskLocationSheet}>
                <Ionicons name="close" size={24} color="#667085" />
              </TouchableOpacity>
            </View>

            {selectedFloorId ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedFloorId(null)}
                className="mb-3 self-start flex-row items-center rounded-full bg-[#EEF3F7] px-3 py-2"
              >
                <Ionicons name="arrow-back" size={17} color="#1E5371" />
                <Text className="ml-1.5 text-[13px] font-medium text-[#1E5371]">
                  Floors
                </Text>
              </TouchableOpacity>
            ) : null}

            <ScrollView showsVerticalScrollIndicator={false}>
              {!selectedFloorId ? (
                taskFloors.length ? (
                  taskFloors.map((floor) => {
                    const unitCount = taskGroup.filter((task) => task.floorId === floor.id).length;
                    return (
                      <TouchableOpacity
                        key={floor.id}
                        activeOpacity={0.82}
                        onPress={() => setSelectedFloorId(floor.id)}
                        className="mb-3 flex-row items-center rounded-[14px] border border-[#D8DEE5] bg-[#F8FAFC] px-4 py-4"
                      >
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#E7EFF5]">
                          <Ionicons name="layers-outline" size={21} color="#1E5371" />
                        </View>
                        <View className="ml-3 flex-1">
                          <Text className="text-[16px] font-semibold text-[#26313E]">{floor.name}</Text>
                          <Text className="mt-0.5 text-[12px] text-[#667085]">
                            {unitCount} {unitCount === 1 ? "unit" : "units"}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#98A2B3" />
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text className="py-8 text-center text-[14px] text-[#667085]">
                    No floor found for this task.
                  </Text>
                )
              ) : floorUnits.length ? (
                floorUnits.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    activeOpacity={0.82}
                    onPress={() => {
                      closeTaskLocationSheet();
                      router.push({
                        pathname: "/screens/company/taskdetails",
                        params: { taskId: task.id },
                      });
                    }}
                    className="mb-3 flex-row items-center rounded-[14px] border border-[#D8DEE5] bg-[#F8FAFC] px-4 py-4"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF]">
                      <Ionicons name="business-outline" size={20} color="#3F5FE7" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-[16px] font-semibold text-[#26313E]">
                        {task.unitName || "Unit"}
                      </Text>
                      <Text className="mt-0.5 text-[12px] text-[#667085]">{task.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#98A2B3" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="py-8 text-center text-[14px] text-[#667085]">
                  No units found for this floor.
                </Text>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
