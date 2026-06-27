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
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const { data: rooms, isLoading: isRoomsLoading } = useFloorRoomsQuery(
    projectId,
    selectedFloor?.id
  );

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
    setSelectedFloor(floor);
    setSelectedRoom(null); // Reset room when floor changes
    setShowFloorSheet(false);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomSheet(false);
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
    if (!selectedFloor) {
      toast.error("Please select a floor");
      return;
    }

    if (!selectedRoom) {
      toast.error("Please select a room");
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
    <SafeAreaView className="flex-1 bg-[#E9EDF1]" edges={['left','right',"top",'bottom']}>
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
              <TaskFormField
                label="Floor"
                placeholder={selectedFloor ? selectedFloor.name : "Select Floor"}
                value={selectedFloor?.name || ""}
                onPress={() => setShowFloorSheet(true)}
                onChangeText={() => { }}
              />
            </View>

            {selectedFloor && (
              <View className="mt-4">
              <TaskFormField
                label="Unit"
                placeholder={
                  selectedRoom
                      ? selectedRoom.name
                      : "Select Unit"
                  }
                  value={selectedRoom?.name || ""}
                  onPress={() => setShowRoomSheet(true)}
                  onChangeText={() => { }}
                />
              </View>
            )}

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
                floors.map((floor) => (
                  <TouchableOpacity
                    key={floor.id}
                    onPress={() => handleFloorSelect(floor)}
                    className={`p-4 rounded-xl mb-3 flex-row items-center justify-between border ${selectedFloor?.id === floor.id
                      ? "border-[#1E5371] bg-[#1E5371]/5"
                      : "border-[#E5E7EB]"
                      }`}
                  >
                    <Text className="text-[16px] font-medium text-[#374151]">
                      {floor.name}
                    </Text>
                    {selectedFloor?.id === floor.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#1E5371" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-center text-[#6B7280] my-6">
                  No floors available for this project.
                </Text>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Unit Selection Modal */}
      <Modal
        visible={showRoomSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoomSheet(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowRoomSheet(false)}
        >
          <Pressable className="bg-white rounded-t-[24px] p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[18px] font-semibold text-[#1A212B]">
                Select Unit
              </Text>
              <TouchableOpacity onPress={() => setShowRoomSheet(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {isRoomsLoading ? (
                <ActivityIndicator size="large" color="#1E5371" className="my-6" />
              ) : rooms?.length ? (
                rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <TouchableOpacity
                      key={room.id}
                      onPress={() => handleRoomSelect(room)}
                      className={`p-4 rounded-xl mb-3 flex-row items-center justify-between border ${isSelected
                        ? "border-[#1E5371] bg-[#1E5371]/5"
                        : "border-[#E5E7EB]"
                        }`}
                    >
                      <Text className="text-[16px] font-medium text-[#374151]">
                        {room.name} {room.type ? `(${room.type})` : ""}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={24} color="#1E5371" />
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text className="text-center text-[#6B7280] my-6">
                No units available for this floor.
              </Text>
              )}
            </ScrollView>
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
