import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

type ProfileAvatarProps = {
  uri: string;
  size?: number;
  showCamera?: boolean;
  onPressCamera?: () => void;
};

export default function ProfileAvatar({
  uri,
  size = 74,
  showCamera = false,
  onPressCamera,
}: ProfileAvatarProps) {
  const cameraSize = Math.max(18, Math.round(size * 0.26));
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={
          uri && !imageFailed
            ? { uri }
            : require("../../assets/images/placeholder-person.png")
        }
        onError={() => setImageFailed(true)}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />

      {showCamera ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressCamera}
          className="absolute bottom-0 right-0 items-center justify-center rounded-full bg-[#1F5577]"
          style={{ width: cameraSize, height: cameraSize }}
        >
          <Ionicons name="camera" size={cameraSize * 0.6} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
