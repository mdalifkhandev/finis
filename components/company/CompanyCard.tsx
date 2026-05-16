import { API_BASE_URL } from "@/lib/config";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { cardShadow } from "../home/styles";

type CompanyCardProps = {
  name: string;
  type: string;
  revenue: string;
  projectLevel: string;
  address: string;
  website: string;
  logoUrl?: string | null;
  onPress?: () => void;
};

function resolveLogoUrl(logoUrl?: string | null) {
  if (!logoUrl) {
    return null;
  }

  if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
    return logoUrl;
  }

  return `${API_BASE_URL}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
}

export default function CompanyCard({
  name,
  type,
  revenue,
  projectLevel,
  address,
  website,
  logoUrl,
  onPress,
}: CompanyCardProps) {
  const resolvedLogoUrl = resolveLogoUrl(logoUrl);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mt-4 rounded-2xl bg-white p-4"
      style={cardShadow}
    >
      <View className="flex-row items-center">
        <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          {resolvedLogoUrl ? (
            <Image
              source={{ uri: resolvedLogoUrl }}
              className="h-10 w-10 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="business-outline" size={18} color="#0f172a" />
          )}
        </View>
        <View className="ml-3">
          <Text className="text-base font-semibold text-slate-900">{name}</Text>
          <Text className="text-sm text-slate-500">{type}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between w-full">
        <View>
          <Text className="text-sm text-slate-400">Revenue</Text>
          <Text className="text-base font-semibold text-slate-900">
            {revenue}
          </Text>
        </View>
        <View className="mx-5 h-8 w-px bg-slate-200" />
        <View>
          <Text className="text-sm text-slate-400">Projects</Text>
          <Text className="text-base font-semibold text-slate-900">
            {projectLevel}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center">
        <Ionicons name="location-outline" size={14} color="#64748b" />
        <Text className="ml-2 text-xs text-slate-500">{address}</Text>
      </View>
      <View className="mt-2 flex-row items-center">
        <Ionicons name="globe-outline" size={14} color="#64748b" />
        <Text className="ml-2 text-xs text-slate-500">{website}</Text>
      </View>
    </TouchableOpacity>
  );
}
