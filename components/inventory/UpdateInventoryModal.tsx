import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from "react-native";
import InventoryFormField from "./InventoryFormField";
import { InventoryItem } from "./types";

export type UpdateInventoryData = {
  name: string;
  category: string;
  currentQty: number;
  unit: string;
  location: string;
};

type UpdateInventoryModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (data: UpdateInventoryData) => void;
  isSaving?: boolean;
};

export default function UpdateInventoryModal({
  visible,
  item,
  onClose,
  onSave,
  isSaving,
}: UpdateInventoryModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setCategory(item.category || "");
      setQuantity(item.currentQty?.toString() || "0");
      setUnit(item.unit || "");
      setLocation(item.location || "");
    }
  }, [item]);

  const handleSave = () => {
    onSave({
      name,
      category,
      currentQty: Number(quantity) || 0,
      unit,
      location,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center bg-black/35 px-5">
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View className="rounded-[24px] border border-[#DCE3EA] bg-white p-5 max-h-[80%]">
                <Text className="text-[22px] font-semibold text-[#2B2B2B] mb-2">
                  Update Inventory
                </Text>
                
                <ScrollView showsVerticalScrollIndicator={false}>
                  <InventoryFormField
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Item name"
                  />
                  
                  <InventoryFormField
                    label="Category"
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Category"
                  />

                  <InventoryFormField
                    label="Quantity"
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="0"
                    keyboardType="decimal-pad"
                  />

                  <InventoryFormField
                    label="Unit"
                    value={unit}
                    onChangeText={setUnit}
                    placeholder="pcs"
                  />
                  
                  <InventoryFormField
                    label="Location"
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Warehouse / Shelf"
                  />

                  <View className="mt-6 flex-row items-center justify-between gap-3">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={onClose}
                      disabled={isSaving}
                      className="h-[54px] flex-1 items-center justify-center rounded-[14px] border border-[#D3D9E2] bg-[#F7F9FB]"
                    >
                      <Text className="text-[16px] font-medium text-[#1F2937]">
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleSave}
                      disabled={isSaving}
                      className="h-[54px] flex-1 items-center justify-center rounded-[14px] bg-[#1D5478]"
                    >
                      <Text className="text-[16px] font-medium text-white">
                        {isSaving ? "Saving..." : "Save"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
