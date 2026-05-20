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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FloorStatus } from "./FloorStatusBadge";

export type UpdateRoomPayload = {
  name: string;
  type: string;
  sizeSqft: number;
  status: string;
  progress: number;
};

type UpdateRoomModalProps = {
  visible: boolean;
  initialName: string;
  initialType?: string;
  initialSizeSqft?: number;
  initialStatus: FloorStatus;
  initialProgress?: number;
  onClose: () => void;
  onSubmit: (payload: UpdateRoomPayload) => void;
};

const statusOptions: { label: string; value: string }[] = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

const tones: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "#FFF4E8", text: "#E58B18", border: "#F4D1A7" },
  in_progress: { bg: "#E8F0FF", text: "#225CFF", border: "#C8D7FF" },
  completed: { bg: "#E8F5EE", text: "#0F8A61", border: "#BEE3D2" },
};

function normalizeStatusToValue(status: FloorStatus): string {
  if (status === "Completed") return "completed";
  if (status === "In Progress") return "in_progress";
  return "pending";
}

export default function UpdateRoomModal({
  visible,
  initialName,
  initialType = "",
  initialSizeSqft = 0,
  initialStatus,
  initialProgress = 0,
  onClose,
  onSubmit,
}: UpdateRoomModalProps) {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  
  const [roomName, setRoomName] = useState(initialName);
  const [roomType, setRoomType] = useState(initialType);
  const [sizeSqft, setSizeSqft] = useState(initialSizeSqft.toString());
  const [statusValue, setStatusValue] = useState(normalizeStatusToValue(initialStatus));
  const [progressText, setProgressText] = useState(initialProgress.toString());
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (visible) {
      setRoomName(initialName);
      setRoomType(initialType);
      setSizeSqft(initialSizeSqft.toString());
      setStatusValue(normalizeStatusToValue(initialStatus));
      setProgressText(initialProgress.toString());
    }
  }, [visible, initialName, initialType, initialSizeSqft, initialStatus, initialProgress]);

  useEffect(() => {
    const showEvent = isIOS ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = isIOS ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (event: KeyboardEvent) => setKeyboardHeight(event.endCoordinates.height);
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isIOS]);

  const handleSubmit = () => {
    const normalizedName = roomName.trim();
    if (!normalizedName) return;

    let progressNum = parseInt(progressText, 10);
    if (isNaN(progressNum)) progressNum = 0;
    if (progressNum < 0) progressNum = 0;
    if (progressNum > 100) progressNum = 100;

    let sizeNum = parseInt(sizeSqft, 10);
    if (isNaN(sizeNum)) sizeNum = 0;

    onSubmit({
      name: normalizedName,
      type: roomType.trim() || "Room",
      sizeSqft: sizeNum,
      status: statusValue,
      progress: progressNum,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <Pressable className="flex-1 bg-black/20" onPress={onClose}>
        <View
          className="flex-1 justify-end"
          style={{ paddingBottom: isIOS ? 0 : keyboardHeight }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="rounded-t-2xl bg-white px-4 pt-3"
            style={{ paddingBottom: isIOS ? Math.max(insets.bottom, 10) + 12 : 40 }}
          >
            <View className="mb-3 items-center">
              <View className="h-1.5 w-11 rounded-full bg-[#D1D5DB]" />
            </View>

            <Text className="text-[18px] font-semibold text-[#111827]">Update Room</Text>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1.5 text-[14px] font-medium text-[#4B5563]">Room Name</Text>
                <TextInput
                  value={roomName}
                  onChangeText={setRoomName}
                  placeholder="e.g. Room 1"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="h-12 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 text-[16px] text-[#111827]"
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1.5 text-[14px] font-medium text-[#4B5563]">Room Type</Text>
                <TextInput
                  value={roomType}
                  onChangeText={setRoomType}
                  placeholder="e.g. Office"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="h-12 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 text-[16px] text-[#111827]"
                />
              </View>
            </View>

            <View className="mt-4">
              <Text className="mb-1.5 text-[14px] font-medium text-[#4B5563]">Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {statusOptions.map((opt) => {
                  const active = statusValue === opt.value;
                  const tone = tones[opt.value];

                  return (
                    <TouchableOpacity
                      key={opt.value}
                      activeOpacity={0.85}
                      onPress={() => setStatusValue(opt.value)}
                      className="rounded-lg border px-3 py-2"
                      style={{
                        borderColor: active ? tone.border : "#D6DCE3",
                        backgroundColor: active ? tone.bg : "#F8FAFC",
                      }}
                    >
                      <Text
                        className="text-[14px] font-medium"
                        style={{ color: active ? tone.text : "#4B5563" }}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1.5 text-[14px] font-medium text-[#4B5563]">Size (SqFt)</Text>
                <TextInput
                  value={sizeSqft}
                  onChangeText={setSizeSqft}
                  placeholder="e.g. 500"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  className="h-12 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 text-[16px] text-[#111827]"
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1.5 text-[14px] font-medium text-[#4B5563]">Progress (%)</Text>
                <TextInput
                  value={progressText}
                  onChangeText={setProgressText}
                  placeholder="0 - 100"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  className="h-12 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 text-[16px] text-[#111827]"
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              className="mt-6 h-12 items-center justify-center rounded-lg bg-[#1E5371]"
            >
              <Text className="text-[16px] font-semibold text-white">Save Changes</Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
