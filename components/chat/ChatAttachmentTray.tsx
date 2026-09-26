import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ChatAttachmentTrayProps = {
  onPressPhoto?: () => void;
  onPressCamera?: () => void;
  onPressLocation?: () => void;
  disabled?: boolean;
};

type AttachmentKey = "photo" | "camera" | "location";

const ACTIONS: {
  key: AttachmentKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "photo", label: "Photo", icon: "image-outline" },
  { key: "camera", label: "Camera", icon: "camera-outline" },
  { key: "location", label: "Location", icon: "location-outline" },
];

export default function ChatAttachmentTray({
  onPressPhoto,
  onPressCamera,
  onPressLocation,
  disabled = false,
}: ChatAttachmentTrayProps) {
  const onPressMap: Record<AttachmentKey, (() => void) | undefined> = {
    photo: onPressPhoto,
    camera: onPressCamera,
    location: onPressLocation,
  };

  return (
    <View className="border-t border-[#E1E5EA] bg-[#E9EDF1] px-5 pb-6 pt-4">
      <View className="flex-row">
        {ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.key}
            activeOpacity={0.85}
            onPress={onPressMap[action.key]}
            disabled={disabled}
            className="mr-8 items-center"
          >
            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#DCE7E8]">
              <Ionicons name={action.icon} size={29} color="#1D5478" />
            </View>
            <Text className="mt-2 text-[15px] text-[#2B2B2B]">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
