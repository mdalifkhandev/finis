import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

type QuoteFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  keyboardType?: KeyboardTypeOptions;
};

export default function QuoteField({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  keyboardType,
}: QuoteFieldProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-[14px] font-medium text-[#2B2B2B]">
        {label}
      </Text>
      <View className="h-[56px] flex-row items-center rounded-[16px] border border-[#D4DCE5] bg-white px-4">
        {leftIcon ? (
          <Ionicons name={leftIcon} size={22} color="#A0A8B5" />
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A8B5"
          keyboardType={keyboardType}
          className={`flex-1 text-[14px] text-[#1F2937] ${leftIcon ? "ml-3" : ""}`}
        />
      </View>
    </View>
  );
}
