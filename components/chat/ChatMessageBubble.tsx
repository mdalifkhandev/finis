import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";
import { MessageModel } from "./chatData";

type ChatMessageBubbleProps = {
  message: MessageModel;
  avatarUrl: string | ImageSourcePropType;
};

export default function ChatMessageBubble({
  message,
  avatarUrl,
}: ChatMessageBubbleProps) {
  const isMe = message.sender === "me";
  const resolvedAvatar = message.senderAvatarUrl || avatarUrl;
  const locationCoordinates = React.useMemo(() => {
    if (message.kind !== "location" || !message.mediaUrl) {
      return null;
    }

    const match = message.mediaUrl.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i);
    if (!match) {
      return null;
    }

    return {
      latitude: match[1],
      longitude: match[2],
    };
  }, [message.kind, message.mediaUrl]);

  const BubbleBody = () => {
    if (message.kind === "image" && (message.imageUri || message.mediaUrl)) {
      return (
        <>
          <Image
            source={{ uri: message.imageUri || message.mediaUrl || "" }}
            className="h-44 w-full rounded-[10px]"
          />
          <Text
            className={`mt-2 text-[14px] ${isMe ? "text-[#D4E4EF]" : "text-[#4F5560]"}`}
          >
            {message.time}
          </Text>
        </>
      );
    }

    if (message.kind === "location") {
      return (
        <>
          <Text
            className={`text-[16px] leading-7 ${
              isMe ? "text-[#EAF2F8]" : "text-[#4B4B4B]"
            }`}
          >
            {message.text || "Shared a location"}
          </Text>
          {locationCoordinates ? (
            <Text
              className={`mt-1 text-[12px] ${isMe ? "text-[#D4E4EF]" : "text-[#6B7280]"}`}
            >
              {`Latitude: ${locationCoordinates.latitude}`}
            </Text>
          ) : null}
          {locationCoordinates ? (
            <Text
              className={`mt-1 text-[12px] ${isMe ? "text-[#D4E4EF]" : "text-[#6B7280]"}`}
            >
              {`Longitude: ${locationCoordinates.longitude}`}
            </Text>
          ) : null}
          {message.mediaUrl ? (
            <Text
              className={`mt-1 text-[12px] ${isMe ? "text-[#D4E4EF]" : "text-[#6B7280]"}`}
              numberOfLines={2}
            >
              {message.mediaUrl}
            </Text>
          ) : null}
          <Text
            className={`mt-2 text-[14px] ${isMe ? "text-[#D4E4EF]" : "text-[#4F5560]"}`}
          >
            {message.time}
          </Text>
        </>
      );
    }

    if (message.mediaType === "document" && message.mediaUrl) {
      return (
        <>
          <Text
            className={`text-[16px] leading-7 ${
              isMe ? "text-[#EAF2F8]" : "text-[#4B4B4B]"
            }`}
          >
            {message.text || "Shared a file"}
          </Text>
          <Text
            className={`mt-1 text-[12px] ${isMe ? "text-[#D4E4EF]" : "text-[#6B7280]"}`}
            numberOfLines={2}
          >
            {message.mediaUrl}
          </Text>
          <Text
            className={`mt-2 text-[14px] ${isMe ? "text-[#D4E4EF]" : "text-[#4F5560]"}`}
          >
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
        <Text
          className={`mt-2 text-[14px] ${isMe ? "text-[#D4E4EF]" : "text-[#4F5560]"}`}
        >
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
      <Image
        source={typeof resolvedAvatar === "string" ? { uri: resolvedAvatar } : resolvedAvatar}
        className="mr-2 h-6 w-6 rounded-full"
      />
      <View className="w-[66%] rounded-[14px] bg-[#F8FAFC] px-4 py-3">
        <BubbleBody />
      </View>
    </View>
  );
}
