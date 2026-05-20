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

type AddRoomRangeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (fromCode: string, toCode: string) => void;
};

export default function AddRoomRangeModal({
  visible,
  onClose,
  onSubmit,
}: AddRoomRangeModalProps) {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setFromCode("");
      setToCode("");
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
    onSubmit(fromCode.trim(), toCode.trim());
  };

  const handleBackdropPress = () => {
    if (fromCode.trim() && toCode.trim()) {
      onSubmit(fromCode.trim(), toCode.trim());
      return;
    }
    onClose();
  };

  const content = (
    <>
      <View className="mb-3 items-center">
        <View className="h-1.5 w-11 rounded-full bg-[#D1D5DB]" />
      </View>

      <Text className="text-[16px] font-medium text-[#111827]">
        Add New Room
      </Text>

      <View className="mt-3 flex-row items-center">
        <TextInput
          value={fromCode}
          onChangeText={setFromCode}
          placeholder="A100"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="next"
          className="h-12 flex-1 rounded-md border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 text-[16px] text-[#111827]"
        />
        <Text className="mx-2 text-[14px] text-[#374151]">to</Text>
        <TextInput
          value={toCode}
          onChangeText={setToCode}
          placeholder="A106"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          className="h-12 flex-1 rounded-md border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 text-[16px] text-[#111827]"
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSubmit}
        className="mt-4 h-12 items-center justify-center rounded-md bg-[#1E5371]"
      >
        <Text className="text-[16px] font-semibold text-white">
          Add Room
        </Text>
      </TouchableOpacity>
    </>
  );

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
            {content}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
