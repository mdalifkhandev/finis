import { API_BASE_URL } from "@/lib/config";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { cardShadow } from "./styles";

const placeholderAvatar = require("../../assets/images/placeholder-person.png");

function resolveAvatarUrl(avatarUrl: string) {
  return avatarUrl;
}

type WorkerCardProps = {
  workerId?: string;
  name: string;
  role: string;
  location: string;
  status: "Active" | "Inactive";
  avatarUrl: string;
};

const statusStyles = {
  Active: {
    badge: "bg-emerald-100",
    text: "text-emerald-700",
  },
  Inactive: {
    badge: "bg-slate-100",
    text: "text-slate-500",
  },
};

export default function WorkerCard({
  workerId,
  name,
  role,
  location,
  status,
  avatarUrl,
}: WorkerCardProps) {
  const styles = statusStyles[status];
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedAvatarUrl = resolveAvatarUrl(avatarUrl);
  const openProfile = () => {
    router.push({
      pathname: "/screens/chat/userprofile",
      params: {
        ...(workerId ? { id: workerId } : {}),
        name,
        avatarUrl: resolvedAvatarUrl,
      },
    });
  };

  return (
    <Pressable
      onPress={openProfile}
      className="mx-5 mt-3 rounded-2xl bg-white p-3"
      style={cardShadow}
      android_ripple={{ color: "#E8EEF4" }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center pr-3">
          <Image
            source={
              resolvedAvatarUrl && !imageFailed
                ? { uri: resolvedAvatarUrl }
                : placeholderAvatar
            }
            onError={() => setImageFailed(true)}
            resizeMode="cover"
            className="h-12 w-12 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-semibold text-slate-900">{name}</Text>
            <Text className="text-sm font-normal text-slate-500 mt-2">
              {role}
            </Text>
          </View>
        </View>
        <View>
          <View className="shrink-0 items-end">
            <View className={`rounded-full px-2 py-1 ${styles.badge}`}>
              <Text className={`text-[10px] font-semibold ${styles.text}`}>
                {status}
              </Text>
            </View>
          </View>
          <View className="mt-2 flex-row items-center justify-end ">
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <Text className="ml-2 text-xs text-slate-500">{location}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
