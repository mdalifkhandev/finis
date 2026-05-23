import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InventoryHeader from "./InventoryHeader";
import InventoryItemCard from "./InventoryItemCard";
import InventoryStatCard from "./InventoryStatCard";
import LowStockAlertsCard from "./LowStockAlertsCard";
import UpdateInventoryModal from "./UpdateInventoryModal";
import {
  useInventorySummaryQuery,
  useAllInventoryItemsQuery,
  useLowStockAlertsQuery,
  useUpdateInventoryMutation,
} from "@/hooks/inventory/inventory";

export default function InventoryScreen() {
  const { data: summary } = useInventorySummaryQuery();
  const { data: alerts = [], isLoading: isLoadingAlerts } = useLowStockAlertsQuery();
  const { data: items = [], isLoading } = useAllInventoryItemsQuery();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateInventoryMutation();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editedQuantity, setEditedQuantity] = useState("");
  const [editedUnit, setEditedUnit] = useState("");

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  const handleOpenUpdate = (itemId: string) => {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;

    setSelectedItemId(item.id);
    setEditedQuantity(String(item.currentQty));
    setEditedUnit(item.unit);
  };

  const handleCloseUpdate = () => {
    setSelectedItemId(null);
    setEditedQuantity("");
    setEditedUnit("");
  };

  const handleSaveUpdate = () => {
    if (!selectedItem) return;

    const quantity = Number(editedQuantity);
    if (!Number.isFinite(quantity) || quantity < 0) {
      Alert.alert("Invalid Quantity", "Enter a valid stock quantity.");
      return;
    }

    if (!selectedItem.projectId) {
      Alert.alert("Error", "Project ID is missing for this item.");
      return;
    }

    updateItem({
      projectId: selectedItem.projectId,
      itemId: selectedItem.id,
      currentQty: quantity,
      unit: editedUnit,
    }, {
      onSuccess: () => {
        handleCloseUpdate();
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <InventoryHeader
          title="Inventory"
          onBack={() => router.back()}
          showAddButton
          onPressAdd={() => router.push("/screens/inventory/add")}
        />

        <View className="mt-5 flex-row justify-between px-5">
          <InventoryStatCard
            value={String(summary?.totalProducts || 0)}
            label="Total Items"
          />
          <InventoryStatCard
            value={String(summary?.lowStockAlerts || 0)}
            label="Low Stock"
          />
        </View>

        <View className="mt-5 px-5">
          <Text className="text-[18px] font-medium text-[#111827]">
            Low Stock Alerts
          </Text>
          {isLoadingAlerts ? (
            <View className="mt-4 items-center justify-center">
              <Text className="text-[#697487]">Loading alerts...</Text>
            </View>
          ) : (
            <LowStockAlertsCard alerts={alerts} />
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            className="mt-4 h-11 self-start rounded-full bg-[#1D5478] px-6"
          >
            <Text className="pt-2.5 text-[16px] font-medium text-white">
              All Items
            </Text>
          </TouchableOpacity>

          {isLoading ? (
            <View className="mt-8 items-center justify-center">
              <Text className="text-[#697487]">Loading items...</Text>
            </View>
          ) : (
            <View className="mt-2">
              {items.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onPressUpdate={() => handleOpenUpdate(item.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <UpdateInventoryModal
        visible={Boolean(selectedItem)}
        item={selectedItem}
        quantity={editedQuantity}
        unit={editedUnit}
        onChangeQuantity={setEditedQuantity}
        onChangeUnit={setEditedUnit}
        onClose={handleCloseUpdate}
        onSave={handleSaveUpdate}
        isSaving={isUpdating}
      />
    </SafeAreaView>
  );
}
