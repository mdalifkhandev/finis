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

    
    </View>
  );
}
