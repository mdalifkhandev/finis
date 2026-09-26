import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
const placeholderAvatar = require("../../assets/images/placeholder-person.png");

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
        source={uri && !imageFailed ? { uri } : placeholderAvatar}
        onError={() => setImageFailed(true)}
        resizeMode="cover"
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />

      {showCamera ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressCamera}
          disabled={!onPressCamera}
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: cameraSize + 8,
            height: cameraSize + 8,
            borderRadius: (cameraSize + 8) / 2,
            backgroundColor: "#1F5577",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "#FFFFFF",
            opacity: onPressCamera ? 1 : 0.8,
          }}
        >
          <Ionicons name="camera" size={cameraSize} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
