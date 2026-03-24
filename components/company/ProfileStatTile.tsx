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
    <View className="rounded-3xl px-5 py-4" style={styles.tile}>
      <View className="flex-row items-center justify-center">
        <Ionicons name={icon} size={22} color="#f0f4f8" />
        <Text className="ml-2 text-[20px] font-semibold text-white">
          {value}
        </Text>
      </View>
      <Text className="mt-1 text-center text-[14px] text-slate-100">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: "rgba(136, 175, 201, 0.45)",
  },
});
