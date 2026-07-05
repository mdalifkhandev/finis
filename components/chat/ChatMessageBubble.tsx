import React from "react";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { Image, Linking, Pressable, Text, View, type ImageSourcePropType } from "react-native";
import { MessageModel } from "./chatData";

type ChatMessageBubbleProps = {
  message: MessageModel;
  avatarUrl: string | ImageSourcePropType;
  showSeen?: boolean;
  showSent?: boolean;
};

export default function ChatMessageBubble({
  message,
  avatarUrl,
  showSeen = false,
  showSent = false,
}: ChatMessageBubbleProps) {
  const isMe = message.sender === "me";
  const resolvedAvatar = message.senderAvatarUrl || avatarUrl;

  const locationCoordinates = React.useMemo(() => {
    if (message.kind !== "location") {
      return null;
    }

    // 1) Try to read coordinates from a maps URL (query=lat,lng).
    if (message.mediaUrl) {
      try {
        const parsedUrl = new URL(message.mediaUrl);
        const query =
          parsedUrl.searchParams.get("query") || parsedUrl.searchParams.get("q");
        const match = query?.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
        if (match) {
          return { latitude: match[1], longitude: match[2] };
        }
      } catch {
        // ignore and fall back to text parsing
      }
    }

    // 2) Fall back to the "Latitude: .. / Longitude: .." lines in the text.
    const latMatch = message.text?.match(/Latitude:\s*(-?\d+(?:\.\d+)?)/i);
    const lngMatch = message.text?.match(/Longitude:\s*(-?\d+(?:\.\d+)?)/i);
    if (latMatch && lngMatch) {
      return { latitude: latMatch[1], longitude: lngMatch[1] };
    }

    return null;
  }, [message.kind, message.mediaUrl, message.text]);

  // The link we actually open: an explicit maps URL, or one built from coords.
  const mapUrl = React.useMemo(() => {
    if (message.mediaUrl && /^https?:\/\//i.test(message.mediaUrl)) {
      return message.mediaUrl;
    }
    if (locationCoordinates) {
      return `https://www.google.com/maps/search/?api=1&query=${locationCoordinates.latitude},${locationCoordinates.longitude}`;
    }
    return null;
  }, [message.mediaUrl, locationCoordinates]);

  // Hide a raw URL if it was embedded in the text, and drop the lat/lng lines
  // (they are rendered separately below).
  const locationLabel = React.useMemo(() => {
    const raw = message.text || "";
    return (
      raw
        .replace(/https?:\/\/\S+/gi, "")
        .split(/\r?\n/)
        .filter((line) => !/^\s*(Latitude|Longitude):/i.test(line))
        .join("\n")
        .trim() || "Shared a location"
    );
  }, [message.text]);

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
      const handleOpenLocation = async () => {
        if (!mapUrl) {
          return;
        }
        try {
          await Linking.openURL(mapUrl);
        } catch {
          await WebBrowser.openBrowserAsync(mapUrl);
        }
      };

      return (
        <Pressable onPress={() => void handleOpenLocation()} className="w-full">
          <Text
            className={`text-[16px] leading-7 ${
              isMe ? "text-[#EAF2F8]" : "text-[#4B4B4B]"
            }`}
          >
            {locationLabel}
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
          {mapUrl ? (
            <View className="mt-2 flex-row items-center rounded-[10px] bg-black/5 px-3 py-2">
              <Feather
                name="map-pin"
                size={14}
                color={isMe ? "#D4E4EF" : "#1D4ED8"}
              />
              <Text
                className={`ml-2 text-[12px] font-semibold ${isMe ? "text-[#D4E4EF]" : "text-[#1D4ED8]"}`}
                numberOfLines={2}
              >
                Tap to open map
              </Text>
            </View>
          ) : null}
          <Text
            className={`mt-2 text-[14px] ${isMe ? "text-[#D4E4EF]" : "text-[#4F5560]"}`}
          >
            {message.time}
          </Text>
        </Pressable>
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
        {showSeen ? (
          <Text className="mt-1 text-[11px] text-[#66707B]">Seen</Text>
        ) : showSent ? (
          <Text className="mt-1 text-[11px] text-[#66707B]">Send</Text>
        ) : null}
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
