import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CompanyFormFieldProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

export default function CompanyFormField({
  placeholder,
  value,
  onChangeText,
  rightIconName,
  onPress,
  multiline = false,
  keyboardType,
}: CompanyFormFieldProps) {
  const isPressable = Boolean(onPress);

  if (isPressable) {
    return (
      <TouchableOpacity
        activeOpacity={0.86}
        onPress={onPress}
        className={`w-full flex-row items-center rounded-xl border border-[#D1D5DB] bg-[#F5F6F8] px-4 ${
          multiline ? "min-h-[102px] py-3" : "h-12"
        }`}
      >
        <Text
          className={`flex-1 text-[16px] ${
            value ? "text-[#374151]" : "text-[#BDBFC4]"
          }`}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        {rightIconName ? (
          <Ionicons name={rightIconName} size={20} color="#6B7280" />
        ) : null}
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={`w-full rounded-xl border border-[#D1D5DB] bg-[#F5F6F8] px-4 ${
        multiline ? "min-h-[102px] py-3" : "h-12 justify-center"
      }`}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#BDBFC4"
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? "top" : "center"}
        className="text-[16px] text-[#374151]"
      />
    </View>
  );
}
