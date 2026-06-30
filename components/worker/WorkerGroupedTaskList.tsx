import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type WorkerGroupedTaskItem = {
  id: string;
  title?: string;
  description?: string | null;
  priority?: string;
  status?: string;
  dueDate?: string;
  project?: { id?: string; name?: string } | null;
  floor?: { id?: string; name?: string; floorNumber?: number } | null;
  room?: { id?: string; name?: string; roomNumber?: number } | null;
};

export const WORKER_TASK_MOCK_DATA: WorkerGroupedTaskItem[] = [
  {
    id: "mock-clean-mirrors",
    title: "Bathroom Cleaning",
    description: "Clean mirrors",
    priority: "medium",
    status: "pending",
    project: { id: "mock-project", name: "Morning Shift" },
    floor: { id: "mock-floor-1", name: "Floor 1", floorNumber: 1 },
    room: { id: "mock-unit-101", name: "Unit 101", roomNumber: 101 },
  },
  {
    id: "mock-sanitize-floor",
    title: "Bathroom Cleaning",
    description: "Sanitize floor",
    priority: "medium",
    status: "pending",
    project: { id: "mock-project", name: "Morning Shift" },
    floor: { id: "mock-floor-1", name: "Floor 1", floorNumber: 1 },
    room: { id: "mock-unit-101", name: "Unit 101", roomNumber: 101 },
  },
  {
    id: "mock-refill-dispensers",
    title: "Bathroom Cleaning",
    description: "Refill soap dispensers",
    priority: "medium",
    status: "in_progress",
    project: { id: "mock-project", name: "Morning Shift" },
    floor: { id: "mock-floor-1", name: "Floor 1", floorNumber: 1 },
    room: { id: "mock-unit-102", name: "Unit 102", roomNumber: 102 },
  },
  {
    id: "mock-deep-clean",
    title: "Bathroom Cleaning",
    description: "Full deep clean",
    priority: "medium",
    status: "completed",
    project: { id: "mock-project", name: "Morning Shift" },
    floor: { id: "mock-floor-3", name: "Floor 3", floorNumber: 3 },
    room: { id: "mock-unit-103", name: "Unit 103", roomNumber: 103 },
  },
];

type TaskGroup = {
  key: string;
  title: string;
  projectName: string;
  tasks: WorkerGroupedTaskItem[];
};

const STATUS_STYLE: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "PENDING", bg: "#EEF1F4", text: "#536174", dot: "#AAB4C0" },
  in_progress: { label: "IN PROGRESS", bg: "#FFF0D5", text: "#9A5B00", dot: "#D99A2B" },
  completed: { label: "COMPLETED", bg: "#DDF1F7", text: "#17617D", dot: "#1E708E" },
};

function normalizeStatus(status?: string) {
  return (status ?? "pending").toLowerCase().replace(/\s+/g, "_");
}

function normalizeTaskTitle(task: WorkerGroupedTaskItem) {
  return task.title?.trim() || task.description?.trim() || "Task";
}

function WorkerTaskGroupCard({
  group,
  onPressTask,
  onPressCreateSubtask,
}: {
  group: TaskGroup;
  onPressTask: (task: WorkerGroupedTaskItem) => void;
  onPressCreateSubtask?: (task: WorkerGroupedTaskItem) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const floors = useMemo(() => {
    const floorMap = new Map<string, { id: string; name: string; tasks: WorkerGroupedTaskItem[] }>();
    group.tasks.forEach((task) => {
      const id = task.floor?.id ?? "no-floor";
      const current = floorMap.get(id) ?? {
        id,
        name: task.floor?.name ?? "Floor",
        tasks: [],
      };
      current.tasks.push(task);
      floorMap.set(id, current);
    });
    return Array.from(floorMap.values());
  }, [group.tasks]);

  return (
    <View className="mb-4 overflow-hidden rounded-[14px] border border-[#CBD4DE] bg-white">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded((value) => !value)}
        className="flex-row items-center bg-[#F2F5F7] px-3 py-3"
      >
        <View className="h-9 w-9 items-center justify-center rounded-[8px] bg-[#1E5371]">
          <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#FFFFFF" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-[#192532]">{group.title}</Text>
          <Text className="mt-0.5 text-[11px] text-[#667085]" numberOfLines={1}>
            {group.projectName} · {group.tasks.length} {group.tasks.length === 1 ? "subtask" : "subtasks"}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#667085"
        />
      </TouchableOpacity>

      {expanded ? (
        <View className="px-3 pb-3 pt-2">
          {floors.map((floor, floorIndex) => {
            const units = new Map<string, { id: string; name: string; tasks: WorkerGroupedTaskItem[] }>();
            floor.tasks.forEach((task) => {
              const id = task.room?.id ?? "no-unit";
              const unit = units.get(id) ?? {
                id,
                name: task.room?.name ?? "Unit",
                tasks: [],
              };
              unit.tasks.push(task);
              units.set(id, unit);
            });

            return (
              <View key={`${floor.id}-${floorIndex}`} className={floorIndex ? "mt-4" : ""}>
                <View className="mb-2 flex-row items-center">
                  <MaterialCommunityIcons name="layers-outline" size={14} color="#1E5371" />
                  <Text className="ml-1.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">
                    {floor.name}
                  </Text>
                </View>

                {Array.from(units.values()).map((unit, unitIndex) => {
                  const unitStatus = unit.tasks.every(
                    (task) => normalizeStatus(task.status) === "completed",
                  )
                    ? "completed"
                    : unit.tasks.some((task) => normalizeStatus(task.status) === "in_progress")
                      ? "in_progress"
                      : "pending";
                  const style = STATUS_STYLE[unitStatus];

                  return (
                    <View
                      key={`${floor.id}-${unit.id}-${unitIndex}`}
                      className={`overflow-hidden rounded-[11px] border border-[#D8DEE5] bg-[#F8FAFC] ${unitIndex ? "mt-2.5" : ""}`}
                    >
                      <View className="flex-row items-center border-b border-[#E2E7EC] px-3 py-2.5">
                        <View className="h-2 w-2 rounded-full" style={{ backgroundColor: style.dot }} />
                        <Text className="ml-2 flex-1 text-[13px] font-medium text-[#26313E]">{unit.name}</Text>
                        <View className="rounded-[4px] px-2 py-1" style={{ backgroundColor: style.bg }}>
                          <Text className="text-[8px] font-bold" style={{ color: style.text }}>
                            {style.label}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => onPressCreateSubtask?.(unit.tasks[0])}
                        className="flex-row items-center border-b border-[#E2E7EC] px-3 py-2"
                      >
                        <Ionicons name="add-circle-outline" size={16} color="#1E5371" />
                        <Text className="ml-1.5 text-[11px] font-medium text-[#1E5371]">
                          Create Sub-Task
                        </Text>
                      </TouchableOpacity>

                      {unit.tasks.map((task, taskIndex) => {
                        const status = normalizeStatus(task.status);
                        const actionLabel = status === "completed" ? "View" : status === "in_progress" ? "Continue" : "Start";
                        return (
                          <View
                            key={`${unit.id}-${task.id}-${taskIndex}`}
                            className={`flex-row items-center px-3 py-2.5 ${taskIndex ? "border-t border-[#E7EBEF]" : ""}`}
                          >
                            <Text className={`flex-1 pr-3 text-[12px] ${status === "completed" ? "text-[#7C8794]" : "text-[#374151]"}`}>
                              {task.description?.trim() || normalizeTaskTitle(task)}
                            </Text>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => onPressTask(task)}
                              className={`min-w-[54px] items-center rounded-[5px] px-2.5 py-1.5 ${
                                status === "in_progress"
                                  ? "bg-[#8A5205]"
                                  : status === "completed"
                                    ? "bg-[#E3EBEF]"
                                    : "bg-[#EEF1F4]"
                              }`}
                            >
                              <Text className={`text-[10px] font-semibold ${status === "in_progress" ? "text-white" : "text-[#40505F]"}`}>
                                {actionLabel}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export default function WorkerGroupedTaskList({
  tasks,
  onPressTask,
  onPressCreateSubtask,
}: {
  tasks: WorkerGroupedTaskItem[];
  onPressTask: (task: WorkerGroupedTaskItem) => void;
  onPressCreateSubtask?: (task: WorkerGroupedTaskItem) => void;
}) {
  const groups = useMemo<TaskGroup[]>(() => {
    const groupMap = new Map<string, TaskGroup>();
    tasks.forEach((task) => {
      const normalizedTitle = normalizeTaskTitle(task);
      const key = `${task.project?.id ?? "project"}:${normalizedTitle.toLowerCase()}`;
      const group = groupMap.get(key) ?? {
        key,
        title: normalizedTitle,
        projectName: task.project?.name ?? "Project",
        tasks: [],
      };
      group.tasks.push(task);
      groupMap.set(key, group);
    });
    return Array.from(groupMap.values());
  }, [tasks]);

  return (
    <View>
      {groups.map((group, groupIndex) => (
        <WorkerTaskGroupCard
          key={`${group.key}-${groupIndex}`}
          group={group}
          onPressTask={onPressTask}
          onPressCreateSubtask={onPressCreateSubtask}
        />
      ))}
    </View>
  );
}
