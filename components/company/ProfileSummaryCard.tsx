import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProfileStatTile from "./ProfileStatTile";

type ProfileSummaryCardProps = {
  name: string;
  handle: string;
  avatarSource: ImageSourcePropType;
  completedProjects: string;
  annualRevenue: string;
  totalEmployees: string;
  onEdit?: () => void;
};

export default function ProfileSummaryCard({
  name,
  handle,
  avatarSource,
  completedProjects,
  annualRevenue,
  totalEmployees,
  onEdit,
}: ProfileSummaryCardProps) {
  return (
    <View
      className="mx-5 mt-6 overflow-hidden rounded-[24px] border border-[#E1E7ED] bg-white px-4 py-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center">
        <Image source={avatarSource} className="h-20 w-20 rounded-full" style={styles.avatar} />
        <View className="ml-4 flex-1">
          <Text className="text-[22px] font-semibold text-[#111827]">{name}</Text>
          <Text className="mt-1 text-[14px] text-[#64748B]">{handle}</Text>
        </View>
      </View>

      <View className="mt-6 rounded-[18px] bg-[#F8FAFC] px-4 py-4">
        <View className="flex-row items-center justify-center">
          <Ionicons name="person" size={20} color="#1D5478" />
          <Text className="ml-2 text-[18px] font-semibold text-[#111827]">
            {completedProjects}
          </Text>
        </View>
        <Text className="mt-1 text-center text-[13px] text-[#64748B]">
          Projects Completed
        </Text>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1">
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
        className="mt-4 flex-row items-center justify-center rounded-[14px] bg-[#D8F0FF] py-4"
      >
        <Ionicons name="create-outline" size={20} color="#1D5478" />
        <Text className="ml-2 text-[15px] font-semibold text-[#1D5478]">
          Edit Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
});
