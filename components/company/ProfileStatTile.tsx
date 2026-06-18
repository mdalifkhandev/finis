import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ProfileStatTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
};

export default function ProfileStatTile({
  icon,
  value,
  label,
}: ProfileStatTileProps) {
  return (
    <View
      className="rounded-[18px] border border-[#EDF1F5] bg-[#F8FAFC] px-4 py-4"
      style={styles.tile}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons name={icon} size={20} color="#1D5478" />
        <Text className="ml-2 text-[18px] font-semibold text-[#111827]">
          {value}
        </Text>
      </View>
      <Text className="mt-1 text-center text-[13px] text-[#64748B]">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: "#F8FAFC",
  },
});
