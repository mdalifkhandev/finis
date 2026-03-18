import React from "react";
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-6" onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()} className="w-full max-w-[320px] rounded-[12px] bg-white p-4 shadow-lg">
          <Text className="text-[16px] font-semibold text-[#1F2937]">Apply Discount</Text>

          <View className="mt-4">
            <Text className="mb-2 text-[12px] text-[#66707B]">Discount Percentage</Text>
            <View className="h-[42px] flex-row items-center rounded-[8px] border border-[#D5DDE6] bg-white px-3">
              <TextInput
                value={value}
                onChangeText={onChangeValue}
                keyboardType="decimal-pad"
                className="flex-1 text-[14px] text-[#1F2937]"
                placeholder="0"
                placeholderTextColor="#98A2B3"
              />
              <Text className="text-[14px] text-[#98A2B3]">%</Text>
            </View>
          </View>

          <Text className="mt-3 text-[12px] text-[#66707B]">Discount amount: {discountAmountLabel}</Text>

          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity activeOpacity={0.85} onPress={onClose} className="h-[40px] flex-1 items-center justify-center rounded-[8px] border border-[#D5DDE6] bg-white">
              <Text className="text-[13px] font-medium text-[#344054]">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} onPress={onApply} className="h-[40px] flex-1 items-center justify-center rounded-[8px] bg-[#1F5577]">
              <Text className="text-[13px] font-medium text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
