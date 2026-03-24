import React from "react";
import { Text, TextInput, View } from "react-native";

type TaskFormFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
};

export default function TaskFormField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
}: TaskFormFieldProps) {
  return (
    <View className="w-full">
      <Text className="mb-2 text-[16px] text-[#344253]">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA3AF"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={`rounded-xl border border-[#CBD3DC] bg-[#F5F7F9] px-4 text-[16px] text-[#1E2938] ${
          multiline ? "min-h-[116px] py-3" : "h-12"
        }`}
      />
    </View>
  );
}
