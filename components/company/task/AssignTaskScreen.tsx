import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import AssignWorkerCard, { WorkerItem } from "./AssignWorkerCard";
import { addTask, clearTaskDraft, getTaskDraft } from "./taskStore";

const workers: WorkerItem[] = [
  {
    id: "mike",
    name: "Mike Johnson",
    role: "Electrician",
    initial: "M",
    available: true,
  },
  {
    id: "sarah",
    name: "Sarah Davis",
    role: "Plumber",
    initial: "S",
    available: true,
  },
  {
    id: "tom",
    name: "Tom Wilson",
    role: "Carpenter",
    initial: "T",
    available: false,
  },
  {
    id: "john",
    name: "John Smith",
    role: "Painter",
    initial: "J",
    available: true,
  },
  {
    id: "robert",
    name: "Robert Brown",
    role: "HVAC Technician",
    initial: "R",
    available: true,
  },
];

export default function AssignTaskScreen({ projectId, taskId }: { projectId?: string; taskId?: string }) {
  const [searchText, setSearchText] = useState("");
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  const filteredWorkers = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return workers;
    return workers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(query) ||
        worker.role.toLowerCase().includes(query),
    );
  }, [searchText]);

  const handleToggleAssign = (workerId: string) => {
    setAssignedIds((previous) =>
      previous.includes(workerId)
        ? previous.filter((id) => id !== workerId)
        : [...previous, workerId],
    );
  };

  const handleConfirmAssignment = () => {
    const draft = getTaskDraft();
    if (!draft) {
      router.replace({
        pathname: "/screens/company/task",
        params: { id: projectId }
      });
      return;
    }

    if (assignedIds.length === 0) {
      Alert.alert("Assign worker", "Please assign at least one worker.");
      return;
    }

    const assignedWorkers = workers.filter((worker) =>
      assignedIds.includes(worker.id),
    );

    const assignee =
      assignedWorkers.length > 1
        ? `${assignedWorkers[0].name} +${assignedWorkers.length - 1}`
        : assignedWorkers[0].name;

    addTask({
      title: draft.title,
      location: draft.location,
      assignee,
      dueDate: draft.dueDate,
      status: "Pending",
      description: draft.description,
      priority: draft.priority,
    });

    clearTaskDraft();
    router.replace({
      pathname: "/screens/company/task",
      params: { id: projectId }
    });
  };

  return (
    <View className="mt-6 px-5">
      <View className="h-[48px] flex-row items-center rounded-[13px] border border-[#CDD4DB] bg-[#F5F7F9] px-3">
        <Ionicons name="search-outline" size={23} color="#7C8594" />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search workers"
          placeholderTextColor="#A0A8B5"
          className="ml-2 flex-1 text-[15px] text-[#26313E]"
        />
      </View>

      <Text className="mt-4 text-[18px] font-medium text-[#334155]">
        Available Workers
      </Text>

      <View className="mt-1">
        {filteredWorkers.map((worker) => (
          <AssignWorkerCard
            key={worker.id}
            worker={worker}
            assigned={assignedIds.includes(worker.id)}
            onAssign={() => handleToggleAssign(worker.id)}
          />
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleConfirmAssignment}
        className="mt-6 h-[52px] items-center justify-center rounded-[10px] bg-[#1E5371]"
      >
        <Text className="text-[16px] font-medium text-[#F4F8FA]">
          Confirm Assignment
        </Text>
      </TouchableOpacity>
    </View>
  );
}
