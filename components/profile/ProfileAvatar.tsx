import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "@/lib/config";

const placeholderAvatar = require("../../assets/images/placeholder-person.png");

function resolveAvatarUrl(uri: string) {
  if (!uri) {
    return null;
  }

  if (uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("file://")) {
    return uri;
  }

  return `${API_BASE_URL}${uri.startsWith("/") ? "" : "/"}${uri}`;
}

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
  const resolvedUri = resolveAvatarUrl(uri);

  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={resolvedUri && !imageFailed ? { uri: resolvedUri } : placeholderAvatar}
        onError={() => setImageFailed(true)}
        resizeMode="cover"
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
