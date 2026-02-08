import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AddFloorModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (floorName: string) => void;
};

export default function AddFloorModal({
  visible,
  onClose,
  onSubmit,
}: AddFloorModalProps) {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const [floorName, setFloorName] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setFloorName("");
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

  const handleSubmit = () => {
    const normalized = floorName.trim();
    if (!normalized) {
      onClose();
      return;
    }
    onSubmit(normalized);
  };

  const handleBackdropPress = () => {
    if (floorName.trim()) {
      handleSubmit();
      return;
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <Pressable className="flex-1 bg-black/20" onPress={handleBackdropPress}>
        <View
          className="flex-1 justify-end"
          style={{ paddingBottom: isIOS ? 0 : keyboardHeight }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="rounded-t-2xl bg-white px-4 pt-3"
            style={{
              paddingBottom: isIOS ? Math.max(insets.bottom, 10) + 12 : 40,
            }}
          >
            <View className="mb-3 items-center">
              <View className="h-1.5 w-11 rounded-full bg-[#D1D5DB]" />
            </View>

            <Text className="text-[16px] font-medium text-[#111827]">
              Add Floor
            </Text>

            <View className="mt-3">
              <TextInput
                value={floorName}
                onChangeText={setFloorName}
                placeholder="Enter floor name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                className="h-12 rounded-md border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 text-[16px] text-[#111827]"
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
