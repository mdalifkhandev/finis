import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AddCustomQuoteItemModalProps = {
  visible: boolean;
  title: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  onChangeTitle: (value: string) => void;
  onChangeQuantity: (value: string) => void;
  onChangeUnit: (value: string) => void;
  onChangeUnitPrice: (value: string) => void;
  onClose: () => void;
  onAdd: () => void;
};

export default function AddCustomQuoteItemModal({
  visible,
  title,
  quantity,
  unit,
  unitPrice,
  onChangeTitle,
  onChangeQuantity,
  onChangeUnit,
  onChangeUnitPrice,
  onClose,
  onAdd,
}: AddCustomQuoteItemModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/30 px-6"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior="padding"
          className="w-full"
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-[340px] max-h-[100%] self-center rounded-[16px] bg-white p-4 shadow-lg"
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <Text className="text-[16px] font-semibold text-[#1F2937]">
                Add Custom Item
              </Text>
              <Text className="mt-1 text-[13px] leading-5 text-[#66707B]">
                Add a manual service if it does not exist in the selected catalog.
              </Text>

              <View className="mt-4">
                <Text className="mb-2 text-[12px] text-[#66707B]">
                  Service Name
                </Text>
                <TextInput
                  value={title}
                  onChangeText={onChangeTitle}
                  placeholder="Custom service name"
                  placeholderTextColor="#98A2B3"
                  className="h-[42px] rounded-[10px] border border-[#D9E1E8] bg-[#F7F9FB] px-3 text-[13px] text-[#1F2937]"
                />
              </View>

              <View className="mt-3">
                <Text className="mb-2 text-[12px] text-[#66707B]">Quantity</Text>
                <TextInput
                  value={quantity}
                  onChangeText={onChangeQuantity}
                  keyboardType="decimal-pad"
                  placeholder="1"
                  placeholderTextColor="#98A2B3"
                  className="h-[42px] rounded-[10px] border border-[#D9E1E8] bg-[#F7F9FB] px-3 text-[13px] text-[#1F2937]"
                />
              </View>

              <View className="mt-3">
                <Text className="mb-2 text-[12px] text-[#66707B]">
                  Unit of Measurement
                </Text>
                <TextInput
                  value={unit}
                  onChangeText={onChangeUnit}
                  placeholder="pcs / ft / sqm / meter"
                  placeholderTextColor="#98A2B3"
                  className="h-[42px] rounded-[10px] border border-[#D9E1E8] bg-[#F7F9FB] px-3 text-[13px] text-[#1F2937]"
                />
              </View>

              <View className="mt-3">
                <Text className="mb-2 text-[12px] text-[#66707B]">Unit Price</Text>
                <View className="h-[42px] flex-row items-center rounded-[10px] border border-[#D9E1E8] bg-[#F7F9FB] px-3">
                  <Text className="mr-2 text-[13px] text-[#98A2B3]">$</Text>
                  <TextInput
                    value={unitPrice}
                    onChangeText={onChangeUnitPrice}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#98A2B3"
                    className="flex-1 text-[13px] text-[#1F2937]"
                  />
                </View>
              </View>

              <View className="mt-4 flex-row gap-3">
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onClose}
                  className="h-[42px] flex-1 items-center justify-center rounded-[10px] border border-[#D5DDE6] bg-white"
                >
                  <Text className="text-[13px] font-medium text-[#344054]">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onAdd}
                  className="h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#1F5577]"
                >
                  <Text className="text-[13px] font-medium text-white">
                    Add Item
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
