import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AvatarStack from "./AvatarStack";
import PriorityBadge from "./PriorityBadge";

type AssignedProjectCardProps = {
  priority: "MEDIUM" | "HIGH" | "LOW";
  title: string;
  site: string;
  date: string;
  checklist: string;
  links: string;
  extraMembers: string;
  avatars: string[];
};

export default function AssignedProjectCard({
  priority,
  title,
  site,
  date,
  checklist,
  links,
  extraMembers,
  avatars,
}: AssignedProjectCardProps) {
  return (
    <View className="mt-4 h-[206px] w-full flex-col items-start gap-4 rounded-xl border border-[#EDEDED] bg-white p-4">
      <View className="flex-row items-center">
        <PriorityBadge level={priority} />
        <Ionicons
          name="business-outline"
          size={24}
          color="#1e5d7e"
          style={{ marginLeft: 12 }}
        />
      </View>

      <View className="w-full">
        <Text className="text-[16px] font-semibold text-[#101010]">{title}</Text>
        <Text
          className="mt-1 text-[14px] font-normal leading-[22.4px] text-[#878787]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {site}
        </Text>
      </View>

      <View className="w-full flex-row items-start justify-between">
        <View className="flex-1">
          <View className="w-[102px] flex-row items-center justify-center gap-2 rounded-md bg-[#F7F7F8] px-4 py-1">
            <Text className="text-[12px] font-normal text-[#101010]">{date}</Text>
          </View>
          <View className="mt-4">
            <AvatarStack avatars={avatars} extraCount={extraMembers} />
          </View>
        </View>

        <View className="ml-4 items-end justify-between self-stretch py-0.5">
          <View className="flex-row items-center">
            <Ionicons name="checkbox-outline" size={24} color="#2f6dff" />
            <Text className="ml-2 text-[12px] text-[#878787]">{checklist}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="link-outline" size={24} color="#111317" />
            <Text className="ml-2 text-[12px] text-[#878787]">{links}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
