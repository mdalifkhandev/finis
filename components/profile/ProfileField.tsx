import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type ProfileFieldProps = TextInputProps & {
  label?: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
};

export default function ProfileField({
  label,
  rightIconName,
  className,
  editable = true,
  ...inputProps
}: ProfileFieldProps) {
  return (
    <View className="mt-3.5">
      {label ? (
        <Text className="mb-1.5 text-[12px] font-medium text-[#2B2B2B]">
          {label}
        </Text>
      ) : null}
      <View className="h-[42px] flex-row items-center rounded-[8px] border border-[#D8DEE5] bg-[#EFF4F7] px-3.5">
        <TextInput
          editable={editable}
          placeholderTextColor="#A0A8B1"
          className={`flex-1 text-[14px] text-[#2B2B2B] ${className ?? ""}`}
          {...inputProps}
        />
        {rightIconName ? (
          <Ionicons name={rightIconName} size={16} color="#98A2B3" />
        ) : null}
      </View>
    </View>
  );
}
