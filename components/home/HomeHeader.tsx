import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type HomeHeaderProps = {
  name: string;
  subtitle: string;
  avatarUrl: string;
  onPressBell?: () => void;
  onPressAvatar?: () => void;
};

export default function HomeHeader({
  name,
  subtitle: role,
  avatarUrl,
  onPressBell,
  onPressAvatar,
}: HomeHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View className="flex-row items-center justify-between px-5 pt-4">
      <View className="flex-row items-center">
        <TouchableOpacity activeOpacity={0.85} onPress={onPressAvatar}>
          <Image
            source={
              avatarUrl && !imageFailed
                ? { uri: avatarUrl }
                : require("../../assets/images/placeholder-person.png")
            }
            onError={() => setImageFailed(true)}
            className="h-12 w-12 rounded-full"
          />
        </TouchableOpacity>
        <View className="ml-3">
          <Text className="text-base font-semibold text-slate-900">{name}</Text>
          <Text className="text-xs text-slate-500">{role}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPressBell}
        className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        activeOpacity={0.8}
      >
        <Ionicons name="notifications-outline" size={18} color="#0f172a" />
      </TouchableOpacity>
    </View>
  );
}
