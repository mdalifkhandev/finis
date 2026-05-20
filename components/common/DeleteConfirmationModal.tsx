import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DeleteConfirmationModalProps = {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmationModal({
  visible,
  title,
  description,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <Pressable className="flex-1 bg-black/20" onPress={onClose}>
        <View className="flex-1 justify-end">
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="rounded-t-2xl bg-white px-4 pt-3"
            style={{ paddingBottom: isIOS ? Math.max(insets.bottom, 10) + 12 : 40 }}
          >
            <View className="mb-3 items-center">
              <View className="h-1.5 w-11 rounded-full bg-[#D1D5DB]" />
            </View>

            <Text className="text-[18px] font-semibold text-center my-4 text-[#111827]">{title}</Text>

            <Text className="mt-2 text-[16px] leading-[28px] text-[#4B5563] text-center px-4">
              {description}
            </Text>

            <View className="mt-8 flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onClose}
                className="flex-1 h-12 items-center justify-center rounded-lg border border-[#D1D5DB] bg-white"
              >
                <Text className="text-[16px] font-medium text-[#4B5563]">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 h-12 items-center justify-center rounded-lg bg-[#FF3B30]"
              >
                <Text className="text-[16px] font-semibold text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
