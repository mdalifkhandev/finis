import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  onPressAction,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5">
      <Text className="text-sm font-semibold text-slate-800 flex-1 mr-4" numberOfLines={1}>
        {title}
      </Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onPressAction} activeOpacity={0.7}>
          <Text className="text-xs font-semibold text-slate-500">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
