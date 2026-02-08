import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cardShadow } from "../home/styles";

type CompanyCardProps = {
  name: string;
  type: string;
  revenue: string;
  projects: string;
  address: string;
  website: string;
  onPress?: () => void;
};

export default function CompanyCard({
  name,
  type,
  revenue,
  projects,
  address,
  website,
  onPress,
}: CompanyCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mt-4 rounded-2xl bg-white p-4"
      style={cardShadow}
    >
      <View className="flex-row items-center">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <Ionicons name="logo-google" size={18} color="#0f172a" />
        </View>
        <View className="ml-3">
          <Text className="text-sm font-semibold text-slate-900">{name}</Text>
          <Text className="text-xs text-slate-500">{type}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center">
        <View>
          <Text className="text-[10px] text-slate-400">Revenue</Text>
          <Text className="text-sm font-semibold text-slate-900">
            {revenue}
          </Text>
        </View>
        <View className="mx-5 h-8 w-px bg-slate-200" />
        <View>
          <Text className="text-[10px] text-slate-400">Projects</Text>
          <Text className="text-sm font-semibold text-slate-900">
            {projects}
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
