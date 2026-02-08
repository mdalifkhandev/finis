import AddFloorModal from "@/components/company/floorplan/AddFloorModal";
import BackTitleHeader from "@/components/common/BackTitleHeader";
import AddRoomRangeModal from "@/components/company/floorplan/AddRoomRangeModal";
import FloorSetupCard, {
  RoomInfo,
} from "@/components/company/floorplan/FloorSetupCard";
import { FloorStatus } from "@/components/company/floorplan/FloorStatusBadge";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const groundFloorRooms: RoomInfo[] = [
  {
    id: "1",
    roomNumber: "1",
    details: "Common • 450 sq ft",
    status: "Completed",
  },
  {
    id: "2",
    roomNumber: "2",
    details: "Office • 120 sq ft",
    status: "Completed",
  },
  {
    id: "3",
    roomNumber: "3",
    details: "Common • 200 sq ft",
    status: "Completed",
  },
  {
    id: "4",
    roomNumber: "4",
    details: "Common • 80 sq ft",
    status: "Completed",
  },
  {
    id: "5",
    roomNumber: "5",
    details: "Utility • 60 sq ft",
    status: "Completed",
  },
  {
    id: "6",
    roomNumber: "6",
    details: "Utility • 60 sq ft",
    status: "In Progress",
  },
  {
    id: "7",
    roomNumber: "7",
    details: "Utility • 100 sq ft",
    status: "Not Started",
  },
  {
    id: "8",
    roomNumber: "8",
    details: "Utility • 90 sq ft",
    status: "Completed",
  },
];

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
  rooms: RoomInfo[];
  allowRoomManagement: boolean;
  fixedRoomCount?: number;
  fixedStats?: FloorStats;
};

const initialFloors: FloorInfo[] = [
  {
    id: "ground-1",
    floorName: "Ground Floor",
    status: "Completed",
    rooms: groundFloorRooms,
    allowRoomManagement: true,
  },
  {
    id: "ground-2",
    floorName: "Ground Floor",
    status: "In Progress",
    rooms: [],
    allowRoomManagement: false,
    fixedRoomCount: 8,
    fixedStats: { completed: 8, inProgress: 0, notStarted: 0 },
  },
];

const buildStatsFromRooms = (rooms: RoomInfo[]): FloorStats => ({
  completed: rooms.filter((room) => room.status === "Completed").length,
  inProgress: rooms.filter((room) => room.status === "In Progress").length,
  notStarted: rooms.filter((room) => room.status === "Not Started").length,
});

export default function FloorPlanRoute() {
  const [floors, setFloors] = useState<FloorInfo[]>(initialFloors);
  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [roomDetailsVisibleByFloorId, setRoomDetailsVisibleByFloorId] = useState<
    Record<string, boolean>
  >({});
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  const handleAddFloor = (floorName: string) => {
    const newFloor: FloorInfo = {
      id: `floor-${Date.now()}`,
      floorName,
      status: "Not Started",
      rooms: [],
      allowRoomManagement: true,
    };

    setFloors((previous) => [...previous, newFloor]);
    setShowAddFloorModal(false);
  };

  const handleAddRoomRange = (fromCode: string, toCode: string) => {
    const targetFloorId = activeFloorId;
    const targetFloor = floors.find((floor) => floor.id === targetFloorId);

    if (!targetFloor || !targetFloor.allowRoomManagement) {
      setShowAddRoomModal(false);
      return;
    }

    const fromMatch = fromCode.match(roomRangePattern);
    const toMatch = toCode.match(roomRangePattern);

    if (!fromMatch || !toMatch) {
      Alert.alert("Invalid input", "Use format like A100 to A106.");
      return;
    }

    const fromPrefix = fromMatch[1].toUpperCase();
    const toPrefix = toMatch[1].toUpperCase();
    const fromNumber = Number(fromMatch[2]);
    const toNumber = Number(toMatch[2]);

    if (fromPrefix !== toPrefix) {
      Alert.alert(
        "Invalid range",
        "Both values must use the same letter prefix.",
      );
      return;
    }

    if (toNumber <= fromNumber) {
      Alert.alert(
        "Invalid range",
        "Second value must be greater than the first value.",
      );
      return;
    }

    const numberOfRoomsToCreate = toNumber - fromNumber;
    const newRooms: RoomInfo[] = Array.from(
      { length: numberOfRoomsToCreate },
      (_, index) => ({
        id: `${Date.now()}-${index}`,
        roomNumber: `${fromPrefix}${fromNumber + index}`,
        details: "Utility • 60 sq ft",
        status: "Completed",
      }),
    );

    setFloors((previous) =>
      previous.map((floor) =>
        floor.id === targetFloorId
          ? { ...floor, rooms: [...floor.rooms, ...newRooms] }
          : floor,
      ),
    );
    setShowAddRoomModal(false);
    setActiveFloorId(null);
  };

  const handleDeleteFloor = (floorId: string) => {
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
  };

  const handleDeleteRoom = (floorId: string, roomId: string) => {
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
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 44 }}
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
              Add Floor
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 px-5">
          {floors.map((floor) => {
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
                onDeleteRoom={(roomId) => handleDeleteRoom(floor.id, roomId)}
                roomDetailsVisible={Boolean(roomDetailsVisibleByFloorId[floor.id])}
                onToggleRoomDetails={() =>
                  setRoomDetailsVisibleByFloorId((previous) => ({
                    ...previous,
                    [floor.id]: !previous[floor.id],
                  }))
                }
              />
            );
          })}
        </View>
      </ScrollView>

      <AddFloorModal
        visible={showAddFloorModal}
        onClose={() => setShowAddFloorModal(false)}
        onSubmit={handleAddFloor}
      />

      <AddRoomRangeModal
        visible={showAddRoomModal}
        onClose={() => {
          setShowAddRoomModal(false);
          setActiveFloorId(null);
        }}
        onSubmit={handleAddRoomRange}
      />
    </SafeAreaView>
  );
}
