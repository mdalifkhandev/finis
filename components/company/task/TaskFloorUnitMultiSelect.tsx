import { useFloorRoomsQuery } from "@/hooks/company/company";
import type { Floor, Room } from "@/types/company.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type TaskFloorUnitSelection = {
  floor: Floor;
  unit: Room;
};

type FloorUnitsProps = {
  projectId?: string;
  floor: Floor;
  unitsOverride?: Room[];
  selectedUnitIds: string[];
  onToggle: (floor: Floor, unit: Room) => void;
  onToggleAll: (floor: Floor, units: Room[]) => void;
};

function FloorUnits({
  projectId,
  floor,
  unitsOverride,
  selectedUnitIds,
  onToggle,
  onToggleAll,
}: FloorUnitsProps) {
  const shouldFetchUnits = !unitsOverride;
  const { data: fetchedUnits, isLoading } = useFloorRoomsQuery(
    shouldFetchUnits ? projectId : undefined,
    shouldFetchUnits ? floor.id : undefined,
  );
  const units = unitsOverride ?? fetchedUnits ?? [];
  const allSelected = Boolean(units.length) && selectedUnitIds.length === units.length;
  const someSelected = Boolean(units.length) && selectedUnitIds.length > 0 && !allSelected;

  return (
    <View className="border-b border-[#DCE3EA] px-4 py-4 last:border-b-0">
      <View className="flex-row items-center justify-between">
        <View className="self-start rounded-[6px] bg-[#EAF3F7] px-2.5 py-1">
          <Text className="text-[14px] font-semibold text-[#1E5371]">{floor.name}</Text>
        </View>

        {units.length ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onToggleAll(floor, units)}
            className={`h-6 w-6 items-center justify-center border ${
              allSelected
                ? "border-[#1E5371] bg-[#1E5371]"
                : someSelected
                  ? "border-[#1E5371] bg-[#EDF5F8]"
                  : "border-[#CDD4DE] bg-white"
            }`}
          >
            <Ionicons
              name={allSelected ? "checkmark" : someSelected ? "remove" : "checkmark"}
              size={18}
              color={allSelected ? "#FFFFFF" : "#1E5371"}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#1E5371" className="mt-4" />
      ) : units.length ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {units.map((unit) => {
            const selected = selectedUnitIds.includes(unit.id);
            return (
              <TouchableOpacity
                key={unit.id}
                activeOpacity={0.8}
                onPress={() => onToggle(floor, unit)}
                className={`flex-row items-center rounded-[9px] border px-3 py-2.5 ${
                  selected
                    ? "border-[#1E5371] bg-[#EDF5F8]"
                    : "border-[#CDD4DE] bg-white"
                }`}
              >
                <Ionicons
                  name={selected ? "checkbox" : "square-outline"}
                  size={19}
                  color={selected ? "#1E5371" : "#98A2B3"}
                />
                <Text className="ml-2 text-[14px] text-[#26313E]">{unit.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text className="mt-3 text-[13px] text-[#667085]">No units available.</Text>
      )}
    </View>
  );
}

export default function TaskFloorUnitMultiSelect({
  projectId,
  floors,
  unitsByFloor,
  isLoading,
  onChange,
}: {
  projectId?: string;
  floors?: Floor[];
  unitsByFloor?: Record<string, Room[]>;
  isLoading?: boolean;
  onChange: (selections: TaskFloorUnitSelection[]) => void;
}) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedFloors, setSelectedFloors] = useState<Floor[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<Record<string, Room[]>>({});

  useEffect(() => {
    onChange(
      selectedFloors.flatMap((floor) =>
        (selectedUnits[floor.id] ?? []).map((unit) => ({ floor, unit })),
      ),
    );
  }, [onChange, selectedFloors, selectedUnits]);

  const toggleFloor = (floor: Floor) => {
    setSelectedFloors((current) => {
      if (current.some((item) => item.id === floor.id)) {
        setSelectedUnits((units) => {
          const next = { ...units };
          delete next[floor.id];
          return next;
        });
        return current.filter((item) => item.id !== floor.id);
      }
      return [...current, floor];
    });
  };

  const toggleUnit = (floor: Floor, unit: Room) => {
    setSelectedUnits((current) => {
      const units = current[floor.id] ?? [];
      const selected = units.some((item) => item.id === unit.id);
      return {
        ...current,
        [floor.id]: selected
          ? units.filter((item) => item.id !== unit.id)
          : [...units, unit],
      };
    });
  };

  const toggleAllUnits = (floor: Floor, units: Room[]) => {
    setSelectedUnits((current) => {
      const currentUnits = current[floor.id] ?? [];
      const allSelected = units.length > 0 && currentUnits.length === units.length;

      return {
        ...current,
        [floor.id]: allSelected ? [] : [...units],
      };
    });
  };

  return (
    <>
      <View className="mt-4">
        <Text className="mb-2 text-[14px] font-medium text-[#4D596A]">Select Floors</Text>
        <View className="min-h-[62px] flex-row flex-wrap items-center gap-2 rounded-[16px] border border-[#D3DBE4] bg-[#F7F9FB] px-3 py-3">
          {selectedFloors.map((floor) => (
            <View key={floor.id} className="h-9 flex-row items-center rounded-full bg-[#E5F0F5] px-3">
              <Text className="text-[14px] font-semibold text-[#1E5371]">{floor.name}</Text>
              <TouchableOpacity onPress={() => toggleFloor(floor)} className="ml-1.5">
                <Ionicons name="close" size={17} color="#1E5371" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSheetVisible(true)}
            className="h-9 w-9 items-center justify-center rounded-full bg-[#DCEBF2]"
          >
            <Ionicons name="add" size={24} color="#1E5371" />
          </TouchableOpacity>
          {!selectedFloors.length ? (
            <Text className="text-[14px] text-[#98A2B3]">Add floors</Text>
          ) : null}
        </View>
      </View>

      {selectedFloors.length ? (
        <View className="mt-5">
          <Text className="mb-2 text-[14px] font-medium text-[#4D596A]">Select Units</Text>
          <View className="overflow-hidden rounded-[16px] border border-[#CBD4DE] bg-[#F9FAFC]">
            {selectedFloors.map((floor) => (
              <FloorUnits
                key={floor.id}
                projectId={projectId}
                floor={floor}
                unitsOverride={unitsByFloor?.[floor.id]}
                selectedUnitIds={(selectedUnits[floor.id] ?? []).map((unit) => unit.id)}
                onToggle={toggleUnit}
                onToggleAll={toggleAllUnits}
              />
            ))}
          </View>
        </View>
      ) : null}

      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setSheetVisible(false)}>
          <Pressable
            className="max-h-[75%] rounded-t-[24px] bg-white px-5 pb-6 pt-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-[#D8DEE5]" />
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-semibold text-[#26313E]">Select Floors</Text>
              <TouchableOpacity onPress={() => setSheetVisible(false)}>
                <Ionicons name="close" size={24} color="#667085" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#1E5371" className="py-8" />
              ) : floors?.length ? (
                floors.map((floor) => {
                  const selected = selectedFloors.some((item) => item.id === floor.id);
                  return (
                    <TouchableOpacity
                      key={floor.id}
                      activeOpacity={0.8}
                      onPress={() => toggleFloor(floor)}
                      className={`mb-3 flex-row items-center justify-between rounded-[12px] border px-4 py-4 ${
                        selected
                          ? "border-[#1E5371] bg-[#EDF5F8]"
                          : "border-[#D8DEE5] bg-[#F8FAFC]"
                      }`}
                    >
                      <Text className="text-[16px] font-medium text-[#26313E]">{floor.name}</Text>
                      <Ionicons
                        name={selected ? "checkbox" : "square-outline"}
                        size={23}
                        color={selected ? "#1E5371" : "#98A2B3"}
                      />
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text className="py-8 text-center text-[14px] text-[#667085]">No floors available.</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSheetVisible(false)}
              className="mt-3 h-[48px] items-center justify-center rounded-[12px] bg-[#1E5371]"
            >
              <Text className="text-[15px] font-semibold text-white">Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
