import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type ApplyDiscountModalProps = {
  visible: boolean;
  value: string;
  onChangeValue: (value: string) => void;
  discountAmountLabel: string;
  onClose: () => void;
  onApply: () => void;
};

export default function ApplyDiscountModal({
  visible,
  value,
  onChangeValue,
  discountAmountLabel,
  onClose,
  onApply,
}: ApplyDiscountModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/35 px-6">
        <View className="w-full max-w-[360px] rounded-[16px] bg-white p-4">
          <Text className="text-[16px] font-semibold text-[#1F2937]">
            Apply Discount
          </Text>

          <Text className="mt-4 text-[12px] font-medium text-[#66707B]">
            Discount Percentage
          </Text>
          <View className="mt-2 h-[46px] flex-row items-center rounded-[10px] border border-[#D5DEE8] bg-[#F6F8FB] px-4">
            <TextInput
              value={value}
              onChangeText={onChangeValue}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor="#98A2B3"
              className="flex-1 text-[14px] text-[#1F2937]"
            />
            <Text className="text-[14px] text-[#98A2B3]">%</Text>
          </View>

          <Text className="mt-3 text-[12px] text-[#66707B]">
            Discount amount: {discountAmountLabel}
          </Text>

          <View className="mt-5 flex-row justify-end gap-3">
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onClose}
              className="h-[40px] min-w-[96px] items-center justify-center rounded-[10px] border border-[#D6DCE3] bg-white px-4"
            >
              <Text className="text-[14px] font-medium text-[#2B2B2B]">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onApply}
              className="h-[40px] min-w-[96px] items-center justify-center rounded-[10px] bg-[#1F5577] px-4"
            >
              <Text className="text-[14px] font-medium text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
