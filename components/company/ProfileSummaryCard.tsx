import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileStatTile from "./ProfileStatTile";

type ProfileSummaryCardProps = {
  name: string;
  handle: string;
  avatarUrl: string;
  completedProjects: string;
  annualRevenue: string;
  totalEmployees: string;
  onEdit?: () => void;
};

export default function ProfileSummaryCard({
  name,
  handle,
  avatarUrl,
  completedProjects,
  annualRevenue,
  totalEmployees,
  onEdit,
}: ProfileSummaryCardProps) {
  return (
    <View className="mx-5 mt-8 overflow-hidden rounded-[30px] bg-[#225879] px-5 pb-5 pt-6">
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.ring, styles.ringTopLeft]} />
        <View style={[styles.ring, styles.ringTopRight]} />
        <View style={[styles.ring, styles.ringBottomRight]} />
      </View>

      <View className="flex-row items-center">
        <Image
          source={{ uri: avatarUrl }}
          className="h-20 w-20 rounded-full"
          style={styles.avatar}
        />
        <View className="ml-4 flex-1">
          <Text className="text-[16px] font-semibold text-white">{name}</Text>
          <Text className="mt-1 text-[14px] text-[#9ad8b3]">{handle}</Text>
        </View>
      </View>

      <View
        className="mt-6 items-center rounded-3xl px-4 py-4"
        style={styles.infoTile}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="person" size={22} color="#f2f5f9" />
          <Text className="ml-2 text-[20px] font-semibold text-white">
            {completedProjects}
          </Text>
        </View>
        <Text className="mt-1 text-[14px] text-slate-100">
          Projects Completed
        </Text>
      </View>

      <View className="mt-4 flex-row">
        <View className="mr-3 flex-1">
          <ProfileStatTile
            icon="layers-outline"
            value={annualRevenue}
            label="Annual Revenue"
          />
        </View>
        <View className="flex-1">
          <ProfileStatTile
            icon="people-outline"
            value={totalEmployees}
            label="Total Employees"
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.85}
        className="mt-5 flex-row items-center justify-center rounded-2xl bg-[#b8d6ea] py-4"
      >
        <Ionicons name="add" size={22} color="#20252b" />
        <Text className="ml-2 text-[14px] font-semibold text-[#20252b]">
          Edit Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: "#f0debf",
  },
  infoTile: {
    backgroundColor: "rgba(136, 175, 201, 0.45)",
  },
  ring: {
    position: "absolute",
    borderWidth: 18,
    borderColor: "rgba(136, 175, 201, 0.23)",
    borderRadius: 999,
  },
  ringTopLeft: {
    width: 320,
    height: 320,
    left: -180,
    top: -40,
  },
  ringTopRight: {
    width: 280,
    height: 280,
    right: -120,
    top: -100,
  },
  ringBottomRight: {
    width: 300,
    height: 300,
    right: -170,
    bottom: -130,
  },
});
