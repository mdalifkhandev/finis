import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

type ChatComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onPressSend: () => void;
  onTypingChange?: (value: string) => void;
  attachmentsOpen: boolean;
  onToggleAttachments: () => void;
  disabled?: boolean;
  isSending?: boolean;
};

export default function ChatComposer({
  value,
  onChangeText,
  onPressSend,
  onTypingChange,
  attachmentsOpen,
  onToggleAttachments,
  disabled = false,
  isSending = false,
}: ChatComposerProps) {
  return (
    <View className="border-t border-[#E1E5EA] bg-[#E9EDF1] px-3 py-3">
      <View className="flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggleAttachments}
          className="h-10 w-8 items-center justify-center"
        >
          <Ionicons
            name={attachmentsOpen ? "keypad-outline" : "add"}
            size={30}
            color="#2B2B2B"
          />
        </TouchableOpacity>

        <View className="mx-2 mb-8 h-[46px] flex-1 flex-row items-center rounded-full bg-[#F8FAFC] px-5">
          <TextInput
            value={value}
            onChangeText={(nextValue) => {
              onChangeText(nextValue);
              onTypingChange?.(nextValue);
            }}
            placeholder="Message"
            placeholderTextColor="#A0A5AD"
            className="flex-1 text-[16px] text-[#2B2B2B]"
            textAlignVertical="center"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPressSend}
          disabled={disabled || isSending}
          className={`h-11 w-11 items-center justify-center rounded-full bg-[#1D5478] ${disabled ? "opacity-60" : ""}`}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={21} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
