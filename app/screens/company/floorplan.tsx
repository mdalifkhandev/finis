import BackTitleHeader from "@/components/common/BackTitleHeader";
import AddFloorModal from "@/components/company/floorplan/AddFloorModal";
import AddRoomRangeModal from "@/components/company/floorplan/AddRoomRangeModal";
import UpdateFloorModal, { UpdateFloorPayload } from "@/components/company/floorplan/UpdateFloorModal";
import UpdateRoomModal, { UpdateRoomPayload } from "@/components/company/floorplan/UpdateRoomModal";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import FloorSetupCard, {
  RoomInfo,
} from "@/components/company/floorplan/FloorSetupCard";
import { FloorStatus } from "@/components/company/floorplan/FloorStatusBadge";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { useProjectFloorPlanQuery, useCreateFloorMutation, useCreateFloorRoomsMutation, useUpdateFloorMutation, useUpdateRoomMutation, useDeleteFloorMutation, useDeleteRoomMutation } from "@/hooks/company/company";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roomRangePattern = /^([A-Za-z]+)(\d+)$/;

type FloorStats = {
  completed: number;
  inProgress: number;
  notStarted: number;
};

type FloorInfo = {
  id: string;
  floorName: string;
  status: FloorStatus;
  progress?: number;
  rooms: RoomInfo[];
  allowRoomManagement: boolean;
  fixedRoomCount?: number;
  fixedStats?: FloorStats;
};

const buildStatsFromRooms = (rooms: RoomInfo[]): FloorStats => ({
  completed: rooms.filter((room) => room.status === "Completed").length,
  inProgress: rooms.filter((room) => room.status === "In Progress").length,
  notStarted: rooms.filter((room) => room.status === "Not Started").length,
});

function normalizeStatus(value?: string): FloorStatus {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "completed") return "Completed";
  if (normalized === "in_progress" || normalized === "in progress") {
    return "In Progress";
  }
  if (normalized === "pending") return "Pending";
  return "Not Started";
}

import type { ProjectFloorPlanRoom } from "@/types/company.types";

function toRoomInfo(
  room: ProjectFloorPlanRoom,
  index: number,
  floorId: string,
): RoomInfo {
  const details = `${room.type ?? "Utility"}${room.sizeSqft ? ` • ${room.sizeSqft} sq ft` : ""
    }`;

  return {
    id: room.id,
    floorId,
    roomNumber: room.name?.replace(/^Room\s*/i, "") || String(index + 1),
    rawName: room.name,
    details,
    status: normalizeStatus(room.status),
    type: room.type || "",
    sizeSqft: room.sizeSqft || 0,
    progress: room.progress || 0,
  };
}

export default function FloorPlanRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const projectId = typeof id === "string" ? id : undefined;
  const { data, isLoading } = useProjectFloorPlanQuery(projectId);
  const createFloorMutation = useCreateFloorMutation(projectId);
  const createFloorRoomsMutation = useCreateFloorRoomsMutation(projectId);
  const updateFloorMutation = useUpdateFloorMutation(projectId);
  const updateRoomMutation = useUpdateRoomMutation(projectId);
  const deleteFloorMutation = useDeleteFloorMutation(projectId);
  const deleteRoomMutation = useDeleteRoomMutation(projectId);
  const { refreshing, onRefresh } = usePullToRefresh();
  const [floors, setFloors] = useState<FloorInfo[]>([]);
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [roomDetailsVisibleByFloorId, setRoomDetailsVisibleByFloorId] =
    useState<Record<string, boolean>>({});
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [editingFloor, setEditingFloor] = useState<FloorInfo | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomInfo | null>(null);
  const [deletingFloorId, setDeletingFloorId] = useState<string | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<{ floorId: string; roomId: string } | null>(null);

  useEffect(() => {
    if (!data) return;

    const nextFloors: FloorInfo[] = data.map((floor) => ({
      id: floor.id,
      floorName: floor.name,
      status: normalizeStatus(floor.status),
      progress: floor.progress,
      rooms: floor.rooms.map((room, index) => toRoomInfo(room, index, floor.id)),
      allowRoomManagement: true,
      fixedRoomCount: floor.totalRooms,
      fixedStats: {
        completed: floor.taskCounts.completed,
        inProgress: floor.taskCounts.inProgress,
        notStarted: floor.taskCounts.notStarted,
      },
    }));

    setFloors(nextFloors);
  }, [data]);

  const handleAddFloor = (floorName: string) => {
    createFloorMutation.mutate({ name: floorName });
    setShowAddFloorModal(false);
  };

  const handleUpdateFloorSubmit = (payload: UpdateFloorPayload) => {
    if (!editingFloor) return;
    updateFloorMutation.mutate({ floorId: editingFloor.id, payload });
    setEditingFloor(null);
  };

  const handleUpdateRoomSubmit = (payload: UpdateRoomPayload) => {
    if (!editingRoom) return;
    updateRoomMutation.mutate({ roomId: editingRoom.id, payload });
    setEditingRoom(null);
  };


  const handleAddRoomRange = (fromCode: string, toCode: string) => {
    const targetFloorId = activeFloorId;
    if (!targetFloorId) {
      setShowAddRoomModal(false);
      return;
    }

    const startRoomNumber = fromCode.trim();
    const endRoomNumber = toCode.trim();

    if (!startRoomNumber || !endRoomNumber) {
      Alert.alert("Invalid input", "Please enter start and end room numbers.");
      return;
    }

    createFloorRoomsMutation.mutate({
      floorId: targetFloorId,
      startRoomNumber,
      endRoomNumber,
    });

    setShowAddRoomModal(false);
    setActiveFloorId(null);
  };

  const handleDeleteFloor = (floorId: string) => {
    setDeletingFloorId(floorId);
  };

  const confirmDeleteFloor = () => {
    if (!deletingFloorId) return;
    const floorId = deletingFloorId;
    deleteFloorMutation.mutate(floorId);
    setFloors((previous) => previous.filter((floor) => floor.id !== floorId));
    setRoomDetailsVisibleByFloorId((previous) => {
      const updated = { ...previous };
      delete updated[floorId];
      return updated;
    });
    if (activeFloorId === floorId) {
      setActiveFloorId(null);
      setShowAddRoomModal(false);
    }
    setDeletingFloorId(null);
  };

  const handleDeleteRoom = (floorId: string, roomId: string) => {
    setDeletingRoom({ floorId, roomId });
  };

  const confirmDeleteRoom = () => {
    if (!deletingRoom) return;
    const { floorId, roomId } = deletingRoom;
    deleteRoomMutation.mutate(roomId);
    setFloors((previous) =>
      previous.map((floor) =>
        floor.id === floorId
          ? {
            ...floor,
            rooms: floor.rooms.filter((room) => room.id !== roomId),
          }
          : floor,
      ),
    );
    setDeletingRoom(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 44 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <BackTitleHeader
          title="Floor & Room Setup"
          onBack={() => router.back()}
        />

        <View className="mt-8 flex-row items-center justify-between px-5">
          <Text className="text-[16px] font-semibold text-[#25313D]">
            Floors ({floors.length})
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowAddFloorModal(true)}
            className="h-[44px] min-w-[132px] flex-row items-center justify-center rounded-[12px] border border-[#CDD3DB] bg-[#F8FAFC] px-4"
          >
            <Ionicons name="add" size={20} color="#1F252E" />
            <Text className="ml-1.5 text-[16px] font-semibold text-[#1F252E]">
              Add Floors
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 px-5">
          {isLoading ? (
            <View className="mt-6 items-center">
              <ActivityIndicator size="small" color="#1d4f6d" />
              <Text className="mt-2 text-xs text-slate-500">
                Loading floor plan...
              </Text>
            </View>
          ) : floors.length === 0 ? (
            <View className="mt-6 items-center">
              <Text className="text-sm text-slate-500">No floors found.</Text>
            </View>
          ) : (
            floors.map((floor) => {
              const stats = floor.allowRoomManagement
                ? buildStatsFromRooms(floor.rooms)
                : (floor.fixedStats ?? buildStatsFromRooms(floor.rooms));
              const roomCount = floor.allowRoomManagement
                ? floor.rooms.length
                : (floor.fixedRoomCount ?? floor.rooms.length);

              return (
                <FloorSetupCard
                  key={floor.id}
                  floorName={floor.floorName}
                  roomCount={roomCount}
                  status={floor.status}
                  completed={stats.completed}
                  inProgress={stats.inProgress}
                  notStarted={stats.notStarted}
                  rooms={floor.allowRoomManagement ? floor.rooms : undefined}
                  onPressAddRoom={
                    floor.allowRoomManagement
                      ? () => {
                        setActiveFloorId(floor.id);
                        setShowAddRoomModal(true);
                      }
                      : undefined
                  }
                  onDeleteFloor={() => handleDeleteFloor(floor.id)}
                  onEditFloor={() => setEditingFloor(floor)}
                  onEditRoom={(room) => setEditingRoom(room)}
                  onDeleteRoom={(roomId) => handleDeleteRoom(floor.id, roomId)}
                  roomDetailsVisible={Boolean(
                    roomDetailsVisibleByFloorId[floor.id],
                  )}
                  onToggleRoomDetails={() =>
                    setRoomDetailsVisibleByFloorId((previous) => ({
                      ...previous,
                      [floor.id]: !previous[floor.id],
                    }))
                  }
                />
              );
            }))}
        </View>
      </ScrollView>

      <AddFloorModal
        visible={showAddFloorModal}
        onClose={() => setShowAddFloorModal(false)}
        onSubmit={handleAddFloor}
      />

      <UpdateFloorModal
        visible={!!editingFloor}
        initialName={editingFloor?.floorName || ""}
        initialStatus={editingFloor?.status || "Not Started"}
        initialProgress={editingFloor?.progress || 0}
        onClose={() => setEditingFloor(null)}
        onSubmit={handleUpdateFloorSubmit}
      />

      <UpdateRoomModal
        visible={!!editingRoom}
        initialName={editingRoom?.rawName || editingRoom?.roomNumber || ""}
        initialType={editingRoom?.type || ""}
        initialSizeSqft={editingRoom?.sizeSqft || 0}
        initialStatus={editingRoom?.status || "Not Started"}
        initialProgress={editingRoom?.progress || 0}
        onClose={() => setEditingRoom(null)}
        onSubmit={handleUpdateRoomSubmit}
      />

      <AddRoomRangeModal
        visible={showAddRoomModal}
        onClose={() => {
          setShowAddRoomModal(false);
          setActiveFloorId(null);
        }}
        onSubmit={handleAddRoomRange}
      />

      <DeleteConfirmationModal
        visible={!!deletingFloorId}
        title="Delete Floor"
        description="Are you sure you want to delete this floor? This action cannot be undone."
        onClose={() => setDeletingFloorId(null)}
        onConfirm={confirmDeleteFloor}
      />

      <DeleteConfirmationModal
        visible={!!deletingRoom}
        title="Delete Room"
        description="Are you sure you want to delete this room? This action cannot be undone."
        onClose={() => setDeletingRoom(null)}
        onConfirm={confirmDeleteRoom}
      />
    </SafeAreaView>
  );
}
