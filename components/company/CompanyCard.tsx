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
  isActive?: boolean;
  onPress?: () => void;
  onMenuPress?: () => void;
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
  isActive = true,
  onPress,
  onMenuPress,
}: CompanyCardProps) {
  const resolvedLogoUrl = resolveLogoUrl(logoUrl);
  const isSuspended = isActive === false;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`mt-4 rounded-2xl bg-white p-4 ${isSuspended ? "border border-red-200" : ""}`}
      style={cardShadow}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-2">
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
        <View className="ml-3 flex-1">
          <View className="flex-row items-center flex-wrap gap-1">
            <Text className="text-base font-semibold text-slate-900" numberOfLines={1}>{name}</Text>
            {isSuspended && (
              <View className="rounded-full bg-red-100 px-2 py-0.5">
                <Text className="text-[10px] font-bold text-red-600">Suspended</Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-slate-500" numberOfLines={1}>{type}</Text>
        </View>
        </View>
        
        {onMenuPress && (
          <TouchableOpacity 
            onPress={onMenuPress}
            className="p-2 -mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {isSuspended && (
        <View className="mt-2.5 flex-row items-center rounded-xl bg-red-50 border border-red-200 px-3 py-2">
          <Ionicons name="lock-closed" size={13} color="#dc2626" />
          <Text className="ml-2 text-xs font-semibold text-red-700">
            Suspended by Super Admin • Details Locked
          </Text>
        </View>
      )}

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
