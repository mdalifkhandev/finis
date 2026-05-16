import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { API_BASE_URL } from "@/lib/config";
import { cardShadow } from "./styles";

const placeholderAvatar = require("../../assets/images/placeholder-person.png");

function resolveAvatarUrl(avatarUrl: string) {
  if (!avatarUrl) {
    return null;
  }

  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  return `${API_BASE_URL}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
}

type WorkerCardProps = {
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
  name,
  role,
  location,
  status,
  avatarUrl,
}: WorkerCardProps) {
  const styles = statusStyles[status];
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedAvatarUrl = resolveAvatarUrl(avatarUrl);

  return (
    <View className="mx-5 mt-3 rounded-2xl bg-white p-3" style={cardShadow}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            source={resolvedAvatarUrl && !imageFailed ? { uri: resolvedAvatarUrl } : placeholderAvatar}
            onError={() => setImageFailed(true)}
            resizeMode="cover"
            className="h-10 w-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-sm font-semibold text-slate-900">{name}</Text>
            <Text className="text-xs text-slate-500">{role}</Text>
          </View>
        </View>
        <View className={`rounded-full px-2 py-1 ${styles.badge}`}>
          <Text className={`text-[10px] font-semibold ${styles.text}`}>
            {status}
          </Text>
        </View>
      </View>
      <View className="mt-2 flex-row items-center">
        <Ionicons name="location-outline" size={14} color="#64748b" />
        <Text className="ml-2 text-xs text-slate-500">{location}</Text>
      </View>
    </View>
  );
}
