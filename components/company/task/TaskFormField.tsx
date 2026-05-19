import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TaskFormFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  editable?: boolean;
  onPress?: () => void;
};

export default function TaskFormField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  editable = true,
  onPress,
}: TaskFormFieldProps) {
  const isPressable = Boolean(onPress);

  return (
    <View className="w-full">
      <Text className="mb-2 text-[16px] text-[#344253]">{label}</Text>
      {isPressable ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}
          className={`rounded-xl border border-[#CBD3DC] bg-[#F5F7F9] px-4 ${
            multiline ? "min-h-[116px] py-3" : "h-12 justify-center"
          }`}
        >
          <Text className={`text-[16px] ${value ? "text-[#1E2938]" : "text-[#9AA3AF]"}`}>
            {value || placeholder}
          </Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9AA3AF"
          multiline={multiline}
          editable={editable}
          textAlignVertical={multiline ? "top" : "center"}
          className={`rounded-xl border border-[#CBD3DC] bg-[#F5F7F9] px-4 text-[16px] text-[#1E2938] ${
            multiline ? "min-h-[116px] py-3" : "h-12"
          }`}
        />
      )}
    </View>
  );
}
