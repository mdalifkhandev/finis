import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskFormField from "@/components/company/task/TaskFormField";
import { setTaskDraft } from "@/components/company/task/taskStore";
import {
  useCreateTaskMutation,
  useFloorRoomsQuery,
  useProjectFloorsQuery,
  useProjectProfileQuery
} from "@/hooks/company/company";
import type { Floor, Room } from "@/types/company.types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

function FloorUnitSelector({
  projectId,
  floor,
  selectedUnitIds,
  onToggleUnit,
}: {
  projectId?: string;
  floor: Floor;
  selectedUnitIds: string[];
  onToggleUnit: (floorId: string, unit: Room) => void;
}) {
  const { data: units, isLoading } = useFloorRoomsQuery(projectId, floor.id);

  return (
    <View className="border-b border-[#E3E7ED] px-4 py-4 last:border-b-0">
      <View className="self-start rounded-[6px] bg-[#F1F5FF] px-2.5 py-1">
        <Text className="text-[14px] font-medium text-[#2662F4]">{floor.name}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#2662F4" className="mt-4" />
      ) : units?.length ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {units.map((unit) => {
            const isSelected = selectedUnitIds.includes(unit.id);
            return (
              <TouchableOpacity
                key={unit.id}
                activeOpacity={0.8}
                onPress={() => onToggleUnit(floor.id, unit)}
                className={`flex-row items-center rounded-[9px] border px-3 py-2.5 ${
                  isSelected
                    ? "border-[#2662F4] bg-[#F5F7FF]"
                    : "border-[#CDD4DE] bg-white"
                }`}
              >
                <Ionicons
                  name={isSelected ? "checkbox" : "square-outline"}
                  size={19}
                  color={isSelected ? "#2662F4" : "#98A2B3"}
                />
                <Text className="ml-2 text-[14px] text-[#1F2937]">{unit.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text className="mt-3 text-[13px] text-[#6B7280]">
          No units available for this floor.
        </Text>
      )}
    </View>
  );
}

function formatDate(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreateTaskRoute() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  const { data: projectProfile, isLoading: isProjectLoading } = useProjectProfileQuery(projectId);
  const { data: floors, isLoading: isFloorsLoading } = useProjectFloorsQuery(projectId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [showPrioritySheet, setShowPrioritySheet] = useState(false);

  const [dueDate, setDueDate] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [dueDateValue, setDueDateValue] = useState(new Date());

  const [showFloorSheet, setShowFloorSheet] = useState(false);
  const [selectedFloors, setSelectedFloors] = useState<Floor[]>([]);
  const [selectedUnitsByFloor, setSelectedUnitsByFloor] = useState<Record<string, Room[]>>({});

  const createTaskMutation = useCreateTaskMutation();

  const handleDueDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      setShowDueDatePicker(false);
      return;
    }

    if (selectedDate) {
      setDueDateValue(selectedDate);
      setDueDate(formatDate(selectedDate));
    }
    setShowDueDatePicker(false);
  };

  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloors((current) => {
      const isSelected = current.some((item) => item.id === floor.id);
      if (isSelected) {
        setSelectedUnitsByFloor((units) => {
          const next = { ...units };
          delete next[floor.id];
          return next;
        });
        return current.filter((item) => item.id !== floor.id);
      }
      return [...current, floor];
    });
  };

  const handleUnitToggle = (floorId: string, unit: Room) => {
    setSelectedUnitsByFloor((current) => {
      const floorUnits = current[floorId] ?? [];
      const isSelected = floorUnits.some((item) => item.id === unit.id);
      return {
        ...current,
        [floorId]: isSelected
          ? floorUnits.filter((item) => item.id !== unit.id)
          : [...floorUnits, unit],
      };
    });
  };

  const handleNext = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    if (!selectedFloors.length) {
      toast.error("Please select at least one floor");
      return;
    }

    const selectedFloor = selectedFloors.find(
      (floor) => (selectedUnitsByFloor[floor.id]?.length ?? 0) > 0,
    );
    const selectedRoom = selectedFloor
      ? selectedUnitsByFloor[selectedFloor.id]?.[0]
      : undefined;

    if (!selectedFloor || !selectedRoom) {
      toast.error("Please select at least one unit");
      return;
    }

    try {
      const response = await createTaskMutation.mutateAsync({
        projectId,
        title: title.trim(),
        description: description.trim(),
        priority: priority.toLowerCase(),
        dueDate: dueDate.trim() || formatDate(new Date()),
        floorId: selectedFloor.id,
        roomId: selectedRoom.id,
      });

      toast.success("Task created successfully!");
      // Send task details to draft so AssignTaskScreen can use it or pass taskId directly
      setTaskDraft({
        title: title.trim(),
        location: `${projectProfile?.name || "Project"} - ${selectedFloor.name}`,
        description: description.trim(),
        priority: priority,
        dueDate: dueDate.trim() || formatDate(new Date()),
      });

      // You can pass the newly created taskId to the next screen if needed
      router.push({
        pathname: "/screens/company/task",
        params: { taskId: response.id, projectId },
      });
    } catch (error: any) {
      // Error handled by mutation
    }
  };

  const projectName = projectProfile?.name || "";

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]" edges={['top','left',"right"]}>
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
                placeholder={isProjectLoading ? "Loading..." : "Project title"}
                value={projectName}
                onChangeText={() => { }} // Read-only based on project context
              />
            </View>

            <View className="mt-4">
              <Text className="mb-2 text-[14px] font-medium text-[#4D596A]">
                Select Floors
              </Text>
              <View className="min-h-[62px] flex-row flex-wrap items-center gap-2 rounded-[16px] border border-[#D8DEE5] bg-[#F7F9FB] px-3 py-3">
                {selectedFloors.map((floor) => (
                  <View
                    key={floor.id}
                    className="h-9 flex-row items-center rounded-full bg-[#EAF0FF] px-3"
                  >
                    <Text className="text-[14px] font-medium text-[#2662F4]">{floor.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleFloorSelect(floor)}
                      className="ml-1.5"
                    >
                      <Ionicons name="close" size={17} color="#2662F4" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowFloorSheet(true)}
                  className="h-9 w-9 items-center justify-center rounded-full bg-[#EAF0FF]"
                >
                  <Ionicons name="add" size={24} color="#2662F4" />
                </TouchableOpacity>
                {!selectedFloors.length ? (
                  <Text className="text-[14px] text-[#98A2B3]">Select floors</Text>
                ) : null}
              </View>
            </View>

            {selectedFloors.length ? (
              <View className="mt-5">
                <Text className="mb-2 text-[14px] font-medium text-[#4D596A]">
                  Select Units
                </Text>
                <View className="overflow-hidden rounded-[16px] border border-[#C9D1DC] bg-[#F9FAFC]">
                  {selectedFloors.map((floor) => (
                    <FloorUnitSelector
                      key={floor.id}
                      projectId={projectId}
                      floor={floor}
                      selectedUnitIds={(selectedUnitsByFloor[floor.id] ?? []).map((unit) => unit.id)}
                      onToggleUnit={handleUnitToggle}
                    />
                  ))}
                </View>
              </View>
            ) : null}

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
                  onPress={() => setShowPrioritySheet(true)}
                  onChangeText={() => { }}
                />
              </View>
              <View className="flex-1">
                <TaskFormField
                  label="Due Date"
                  placeholder="YYYY-MM-DD"
                  value={dueDate}
                  onChangeText={setDueDate}
                  onPress={() => setShowDueDatePicker(true)}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNext}
              disabled={createTaskMutation.isPending}
              className={`mt-5 h-[56px] items-center justify-center rounded-[10px] ${createTaskMutation.isPending ? "bg-[#1E5371]/70" : "bg-[#1E5371]"
                }`}
            >
              {createTaskMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-[16px] font-medium text-[#F4F8FA]">
                  Create Task 
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        {showDueDatePicker ? (
          <DateTimePicker
            value={dueDateValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDueDateChange}
          />
        ) : null}
      </KeyboardAvoidingView>

      {/* Floor Selection Modal */}
      <Modal
        visible={showFloorSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFloorSheet(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowFloorSheet(false)}
        >
          <Pressable className="bg-white rounded-t-[24px] p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[18px] font-semibold text-[#1A212B]">
                Select Floor
              </Text>
              <TouchableOpacity onPress={() => setShowFloorSheet(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {isFloorsLoading ? (
                <ActivityIndicator size="large" color="#1E5371" className="my-6" />
              ) : floors?.length ? (
                floors.map((floor) => {
                  const isSelected = selectedFloors.some((item) => item.id === floor.id);
                  return (
                  <TouchableOpacity
                    key={floor.id}
                    onPress={() => handleFloorSelect(floor)}
                    className={`p-4 rounded-xl mb-3 flex-row items-center justify-between border ${isSelected
                      ? "border-[#1E5371] bg-[#1E5371]/5"
                      : "border-[#E5E7EB]"
                      }`}
                  >
                    <Text className="text-[16px] font-medium text-[#374151]">
                      {floor.name}
                    </Text>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={24}
                      color={isSelected ? "#1E5371" : "#98A2B3"}
                    />
                  </TouchableOpacity>
                  );
                })
              ) : (
                <Text className="text-center text-[#6B7280] my-6">
                  No floors available for this project.
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowFloorSheet(false)}
              className="mt-2 h-[48px] items-center justify-center rounded-[12px] bg-[#1E5371]"
            >
              <Text className="text-[15px] font-semibold text-white">Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Priority Selection Modal */}
      <Modal
        visible={showPrioritySheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrioritySheet(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-center items-center p-5"
          onPress={() => setShowPrioritySheet(false)}
        >
          <Pressable className="bg-white w-full rounded-2xl p-6">
            <Text className="text-[18px] font-semibold text-[#1A212B] mb-5 text-center">
              Select Priority
            </Text>

            {(["LOW", "MEDIUM", "HIGH"] as const).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => {
                  setPriority(level);
                  setShowPrioritySheet(false);
                }}
                className={`py-4 rounded-xl mb-3 items-center border ${priority === level
                  ? "border-[#1E5371] bg-[#1E5371]/10"
                  : "border-[#E5E7EB]"
                  }`}
              >
                <Text className={`text-[16px] font-medium ${priority === level ? "text-[#1E5371]" : "text-[#4B5563]"
                  }`}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}
