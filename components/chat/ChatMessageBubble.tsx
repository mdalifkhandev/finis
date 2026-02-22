import React from "react";
import { Image, Text, View } from "react-native";
import { MessageModel } from "./chatData";

type ChatMessageBubbleProps = {
  message: MessageModel;
  avatarUrl: string;
};

export default function ChatMessageBubble({ message, avatarUrl }: ChatMessageBubbleProps) {
  const isMe = message.sender === "me";

  const BubbleBody = () => {
    if (message.kind === "image" && message.imageUri) {
      return (
        <>
          <Image source={{ uri: message.imageUri }} className="h-44 w-full rounded-[10px]" />
          <Text className={`mt-2 text-[14px] ${isMe ? "text-[#D4E4EF]" : "text-[#4F5560]"}`}>
            {message.time}
          </Text>
        </>
      );
    }

    return (
      <>
        <Text
          className={`text-[16px] leading-7 ${
            isMe ? "text-[#EAF2F8]" : "text-[#4B4B4B]"
          }`}
        >
          {message.text}
        </Text>
        <Text className={`mt-2 text-[14px] ${isMe ? "text-[#D4E4EF]" : "text-[#4F5560]"}`}>
          {message.time}
        </Text>
      </>
    );
  };

  if (isMe) {
    return (
      <View className="mt-4 items-end px-4">
        <View className="w-[66%] rounded-[14px] bg-[#1D5478] px-4 py-3">
          <BubbleBody />
        </View>
      </View>
    );
  }

  return (
    <View className="mt-4 flex-row items-end px-4">
      <Image source={{ uri: avatarUrl }} className="mr-2 h-6 w-6 rounded-full" />
      <View className="w-[66%] rounded-[14px] bg-[#F8FAFC] px-4 py-3">
        <BubbleBody />
      </View>
    </View>
  );
}
