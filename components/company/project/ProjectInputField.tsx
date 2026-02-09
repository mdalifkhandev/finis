import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ProjectInputFieldProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  labelRight?: ReactNode;
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

export default function ProjectInputField({
  label,
  placeholder,
  value,
  onChangeText,
  rightIconName,
  onPress,
  labelRight,
  multiline = false,
  editable = true,
  keyboardType,
}: ProjectInputFieldProps) {
  const isPressable = Boolean(onPress);
  const showHeader = Boolean(label) || Boolean(labelRight);

  return (
    <View className="w-full">
      {showHeader ? (
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[16px] font-medium text-[#1F2937]">{label || ""}</Text>
          {labelRight}
        </View>
      ) : null}

      {isPressable ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}
          className={`flex-row items-center rounded-xl border border-[#C9D1D9] bg-[#F3F5F7] px-3 ${
            multiline ? "min-h-[78px] py-3" : "h-12"
          }`}
        >
          <Text
            className={`flex-1 text-[16px] ${
              value ? "text-[#374151]" : "text-[#B9BEC5]"
            }`}
          >
            {value || placeholder}
          </Text>
          {rightIconName ? (
            <Ionicons name={rightIconName} size={18} color="#6B7280" />
          ) : null}
        </TouchableOpacity>
      ) : (
        <View
          className={`rounded-xl border border-[#C9D1D9] bg-[#F3F5F7] px-3 ${
            multiline ? "min-h-[78px] py-3" : "h-12 justify-center"
          }`}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#B9BEC5"
            multiline={multiline}
            editable={editable}
            keyboardType={keyboardType}
            textAlignVertical={multiline ? "top" : "center"}
            className="text-[16px] text-[#374151]"
          />
        </View>
      )}
    </View>
  );
}
