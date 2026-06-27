import BackTitleHeader from "@/components/common/BackTitleHeader";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import AddFloorModal from "@/components/company/floorplan/AddFloorModal";
import AddRoomRangeModal from "@/components/company/floorplan/AddRoomRangeModal";
import FloorSetupCard, {
  RoomInfo,
} from "@/components/company/floorplan/FloorSetupCard";
import { FloorStatus } from "@/components/company/floorplan/FloorStatusBadge";
import UpdateFloorModal, {
  UpdateFloorPayload,
} from "@/components/company/floorplan/UpdateFloorModal";
import UpdateRoomModal, {
  UpdateRoomPayload,
} from "@/components/company/floorplan/UpdateRoomModal";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import {
  useCreateFloorMutation,
  useCreateFloorRoomsMutation,
  useDeleteFloorMutation,
  useDeleteRoomMutation,
  useProjectFloorPlanQuery,
  useUpdateFloorMutation,
  useUpdateRoomMutation,
} from "@/hooks/company/company";
import { queryClient } from "@/lib/query-client";
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

type FloorStats = {
  completed: number;
  inProgress: number;
  pending: number;
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
  pending: rooms.filter((room) => room.status === "Pending").length,
});

function normalizeStatus(value?: string): FloorStatus {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "completed") return "Completed";
  if (normalized === "in_progress" || normalized === "in progress") {
    return "In Progress";
  }
  // The backend uses pending, we map everything else to Pending
  if (normalized === "pending" || normalized === "not started" || normalized === "not_started") return "Pending";
  return "Pending";
}

import type { ProjectFloorPlanRoom } from "@/types/company.types";

function getFloorRooms(floor: {
  rooms?: ProjectFloorPlanRoom[];
  units?: ProjectFloorPlanRoom[];
}) {
  return floor.rooms ?? floor.units ?? [];
}

function toRoomInfo(
  room: ProjectFloorPlanRoom,
  index: number,
  floorId: string,
): RoomInfo {
  const details = `${room.type ?? "Utility"}${
    room.sizeSqft ? ` • ${room.sizeSqft} sq ft` : ""
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
  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    if (!projectId) return;
    await queryClient.invalidateQueries({
      queryKey: ["project", "floor-plan", projectId],
    });
  });
  const [floors, setFloors] = useState<FloorInfo[]>([]);
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [roomDetailsVisibleByFloorId, setRoomDetailsVisibleByFloorId] =
    useState<Record<string, boolean>>({});
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [editingFloor, setEditingFloor] = useState<FloorInfo | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomInfo | null>(null);
  const [deletingFloorId, setDeletingFloorId] = useState<string | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<{
    floorId: string;
    roomId: string;
  } | null>(null);

  useEffect(() => {
    if (!data) return;

    const nextFloors: FloorInfo[] = data.map((floor) => ({
      id: floor.id,
      floorName: floor.name,
      status: normalizeStatus(floor.status),
      progress: floor.progress,
      rooms: getFloorRooms(floor).map((room, index) =>
        toRoomInfo(room, index, floor.id),
      ),
      allowRoomManagement: true,
      fixedRoomCount: floor.totalRooms ?? floor.totalUnits ?? getFloorRooms(floor).length,
      fixedStats: {
        completed: floor.taskCounts?.completed || 0,
        inProgress: floor.taskCounts?.inProgress || 0,
        pending: (floor.taskCounts as any)?.pending || floor.taskCounts?.notStarted || 0,
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
          title="Floor & Unit Setup"
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
              const floorRooms = floor.rooms ?? [];
              const stats = floor.allowRoomManagement
                ? buildStatsFromRooms(floorRooms)
                : (floor.fixedStats ?? buildStatsFromRooms(floorRooms));
              const roomCount = floor.allowRoomManagement
                ? floorRooms.length
                : (floor.fixedRoomCount ?? floorRooms.length);

              return (
                <FloorSetupCard
                  key={floor.id}
                  floorName={floor.floorName}
                  roomCount={roomCount}
                  status={floor.status}
                  completed={stats.completed}
                  inProgress={stats.inProgress}
                  pending={stats.pending}
                  rooms={floor.allowRoomManagement ? floorRooms : undefined}
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
            })
          )}
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
        title="Delete Unit"
        description="Are you sure you want to delete this room? This action cannot be undone."
        onClose={() => setDeletingRoom(null)}
        onConfirm={confirmDeleteRoom}
      />
    </SafeAreaView>
  );
}
