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
  scheduledLabel?: string | null;
  project?: { id?: string; name?: string } | null;
  floor?: { id?: string; name?: string; floorNumber?: number } | null;
  room?: { id?: string; name?: string; roomNumber?: number } | null;
  floors?: Array<{
    id: string;
    name: string;
    floorNumber?: number;
    units: Array<{
      id: string;
      name: string;
      status?: string;
      approvalDecision?: string | null;
      canCreateSubTask?: boolean;
      subTasks: Array<{
        id: string;
        title?: string;
        status?: string;
        approvalDecision?: string | null;
        action?: string | null;
        reportCount?: number;
      }>;
    }>;
  }>;
};

type TaskGroup = {
  key: string;
  title: string;
  subtitle: string;
  floors: Array<{
    id: string;
    name: string;
    units: Array<{
      id: string;
      name: string;
      status?: string;
      canCreateSubTask?: boolean;
      subTasks: Array<{
        id: string;
        title: string;
        status?: string;
        action?: string | null;
      }>;
      sourceTask?: WorkerGroupedTaskItem;
    }>;
  }>;
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

function normalizeActionLabel(action?: string | null, status?: string) {
  const normalizedAction = (action ?? "").toLowerCase();
  if (normalizedAction === "continue") return "Continue";
  if (normalizedAction === "view") return "View";
  if (normalizedAction === "start") return "Start";

  const normalizedStatus = normalizeStatus(status);
  if (normalizedStatus === "completed") return "View";
  if (normalizedStatus === "in_progress") return "Continue";
  return "Start";
}

function WorkerTaskGroupCard({
  group,
  onPressTask,
  onPressCreateSubtask,
}: {
  group: TaskGroup;
  onPressTask: (task: WorkerGroupedTaskItem) => void;
  onPressCreateSubtask?: (
    task: WorkerGroupedTaskItem,
    context: { floorId: string; unitId: string },
  ) => void;
}) {
  const [expanded, setExpanded] = useState(true);

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
            {group.subtitle}
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
          {group.floors.map((floor, floorIndex) => {
            return (
              <View key={`${floor.id}-${floorIndex}`} className={floorIndex ? "mt-4" : ""}>
                <View className="mb-2 flex-row items-center">
                  <MaterialCommunityIcons name="layers-outline" size={14} color="#1E5371" />
                  <Text className="ml-1.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">
                    {floor.name}
                  </Text>
                </View>

                {floor.units.map((unit, unitIndex) => {
                  const unitStatus = normalizeStatus(unit.status);
                  const style = STATUS_STYLE[unitStatus] ?? STATUS_STYLE.pending;

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

                      {unit.canCreateSubTask ? (
                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() =>
                            unit.sourceTask &&
                            onPressCreateSubtask?.(unit.sourceTask, {
                              floorId: floor.id,
                              unitId: unit.id,
                            })
                          }
                          className="flex-row items-center border-b border-[#E2E7EC] px-3 py-2"
                        >
                          <Ionicons name="add-circle-outline" size={16} color="#1E5371" />
                          <Text className="ml-1.5 text-[11px] font-medium text-[#1E5371]">
                            Create Sub-Task
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {unit.subTasks.map((task, taskIndex) => {
                        const status = normalizeStatus(task.status);
                        const actionLabel = normalizeActionLabel(task.action, task.status);
                        return (
                          <View
                            key={`${unit.id}-${task.id}-${taskIndex}`}
                            className={`flex-row items-center px-3 py-2.5 ${taskIndex ? "border-t border-[#E7EBEF]" : ""}`}
                          >
                            <Text className={`flex-1 pr-3 text-[12px] ${status === "completed" ? "text-[#7C8794]" : "text-[#374151]"}`}>
                              {task.title}
                            </Text>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() =>
                                onPressTask({
                                  id: task.id,
                                  title: task.title,
                                  status: task.status,
                                  floor: { id: floor.id, name: floor.name },
                                  room: { id: unit.id, name: unit.name },
                                  project: group.floors[0]?.units[0]?.sourceTask?.project ?? null,
                                })
                              }
                              className={`min-w-[54px] items-center rounded-[5px] px-2.5 py-1.5 ${
                                actionLabel === "Continue"
                                  ? "bg-[#8A5205]"
                                  : actionLabel === "View"
                                    ? "bg-[#E3EBEF]"
                                    : "bg-[#EEF1F4]"
                              }`}
                            >
                              <Text className={`text-[10px] font-semibold ${actionLabel === "Continue" ? "text-white" : "text-[#40505F]"}`}>
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
  onPressCreateSubtask?: (
    task: WorkerGroupedTaskItem,
    context: { floorId: string; unitId: string },
  ) => void;
}) {
  const groups = useMemo<TaskGroup[]>(() => {
    const groupMap = new Map<string, TaskGroup>();
    tasks.forEach((task) => {
      const normalizedTitle = normalizeTaskTitle(task);
      const key = `${task.project?.id ?? "project"}:${normalizedTitle.toLowerCase()}`;
      if (task.floors?.length) {
        groupMap.set(key, {
          key,
          title: normalizedTitle,
          subtitle: `Scheduled: ${task.scheduledLabel || task.project?.name || "Project"}`,
          floors: task.floors.map((floor) => ({
            id: floor.id,
            name: floor.name,
            units: floor.units.map((unit) => ({
              id: unit.id,
              name: `Unit ${unit.name}`,
              status: unit.status,
              canCreateSubTask: unit.canCreateSubTask,
              subTasks: (unit.subTasks ?? []).map((subTask) => ({
                id: subTask.id,
                title: subTask.title?.trim() || "Sub Task",
                status: subTask.status,
                action: subTask.action,
              })),
              sourceTask: task,
            })),
          })),
        });
        return;
      }

      const currentGroup = groupMap.get(key) ?? {
        key,
        title: normalizedTitle,
        subtitle: `Scheduled: ${task.scheduledLabel || task.project?.name || "Project"}`,
        floors: [],
      };

      const floorId = task.floor?.id ?? "no-floor";
      let floor = currentGroup.floors.find((item) => item.id === floorId);
      if (!floor) {
        floor = {
          id: floorId,
          name: task.floor?.name ?? "Floor",
          units: [],
        };
        currentGroup.floors.push(floor);
      }

      const unitId = task.room?.id ?? "no-unit";
      let unit = floor.units.find((item) => item.id === unitId);
      if (!unit) {
        unit = {
          id: unitId,
          name: task.room?.name ? `Unit ${task.room.name}` : "Unit",
          status: task.status,
          canCreateSubTask: true,
          subTasks: [],
          sourceTask: task,
        };
        floor.units.push(unit);
      }

      unit.subTasks.push({
        id: task.id,
        title: task.description?.trim() || normalizedTitle,
        status: task.status,
        action: undefined,
      });

      groupMap.set(key, currentGroup);
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
