import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import InventoryFormField from "./InventoryFormField";
import { InventoryItem } from "./types";

type UpdateInventoryModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  quantity: string;
  unit: string;
  onChangeQuantity: (value: string) => void;
  onChangeUnit: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function UpdateInventoryModal({
  visible,
  item,
  quantity,
  unit,
  onChangeQuantity,
  onChangeUnit,
  onClose,
  onSave,
}: UpdateInventoryModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center bg-black/35 px-5">
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View className="rounded-[24px] border border-[#DCE3EA] bg-white p-5">
                <Text className="text-[22px] font-semibold text-[#2B2B2B]">
                  Update Stock
                </Text>
                {item ? (
                  <Text className="mt-2 text-[15px] text-[#667085]">
                    {item.name}
                  </Text>
                ) : null}

                <InventoryFormField
                  label="Quantity"
                  value={quantity}
                  onChangeText={onChangeQuantity}
                  placeholder="0"
                  keyboardType="decimal-pad"
                />

                <InventoryFormField
                  label="Unit"
                  value={unit}
                  onChangeText={onChangeUnit}
                  placeholder="pcs"
                />

                <View className="mt-8 flex-row items-center justify-between gap-3">
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={onClose}
                    className="h-[54px] flex-1 items-center justify-center rounded-[14px] border border-[#D3D9E2] bg-[#F7F9FB]"
                  >
                    <Text className="text-[16px] font-medium text-[#1F2937]">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={onSave}
                    className="h-[54px] flex-1 items-center justify-center rounded-[14px] bg-[#1D5478]"
                  >
                    <Text className="text-[16px] font-medium text-white">
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
