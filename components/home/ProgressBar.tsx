import React from "react";
import { View } from "react-native";

type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <View
        className="h-full rounded-full bg-slate-800"
        style={{ width: `${clamped}%` }}
      />
    </View>
  );
}
