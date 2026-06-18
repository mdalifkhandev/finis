import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EditPayrollRateSheetProps = {
  visible: boolean;
  value: string;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onUpdate: () => void;
  isUpdating?: boolean;
};

export default function EditPayrollRateSheet({
  visible,
  value,
  onChangeValue,
  onClose,
  onUpdate,
  isUpdating,
}: EditPayrollRateSheetProps) {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
    }
  }, [visible]);

  useEffect(() => {
    const showEvent = isIOS ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = isIOS ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height);
    };

    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isIOS]);

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View
          className="flex-1 justify-end"
          style={{ paddingBottom: isIOS ? 0 : keyboardHeight }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="rounded-t-[24px] bg-white px-4 pt-4"
            style={{
              paddingBottom: isIOS ? Math.max(insets.bottom, 10) + 12 : 40,
            }}
          >
            <View className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[#D0D5DD]" />

            <Text className="text-[18px] font-semibold text-[#101828]">
              Edit Payroll Rate
            </Text>

            <View className="mt-4">
              <Text className="mb-2 text-[13px] font-medium text-[#344054]">
                Rate Per Hour
              </Text>
              <TextInput
                value={value}
                onChangeText={onChangeValue}
                keyboardType="numeric"
                placeholder="Enter rate per hour"
                placeholderTextColor="#98A2B3"
                className="h-12 rounded-[10px] border border-[#D0D5DD] bg-white px-3 text-[15px] text-[#101828]"
              />
            </View>

            <View className="mt-5 flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onClose}
                className="h-12 flex-1 items-center justify-center rounded-[10px] border border-[#D0D5DD] bg-white"
              >
                <Text className="text-[15px] font-medium text-[#344054]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onUpdate}
                disabled={isUpdating}
                className="h-12 flex-1 items-center justify-center rounded-[10px] bg-[#1F5577]"
              >
                <Text className="text-[15px] font-medium text-white">
                  {isUpdating ? "Updating..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
