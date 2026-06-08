import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChatListItemModel } from "./chatData";

const placeholderAvatar = require("../../assets/images/placeholder-person.png");

type ChatListItemProps = {
  item: ChatListItemModel;
  onPress: () => void;
};

export default function ChatListItem({ item, onPress }: ChatListItemProps) {
  const avatarSource =
    item.avatarUrl && item.avatarUrl.trim()
      ? { uri: item.avatarUrl }
      : placeholderAvatar;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="border-b border-[#D9DFE7] py-4"
    >
      <View className="flex-row items-center">
        <Image
          source={avatarSource}
          className="h-[56px] w-[56px] rounded-full"
        />

        <View className="ml-4 flex-1">
          <Text className="text-[16px] font-semibold text-[#2B2B2B]">
            {item.name}
          </Text>
          <Text className="mt-0.5 text-[14px] text-[#4F5560]" numberOfLines={1}>
            {item.preview}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-[14px] text-[#1D5478]">{item.time}</Text>
          {item.unreadCount > 0 ? (
            <View className="mt-2.5 h-[22px] w-[22px] items-center justify-center rounded-full bg-[#1D5478]">
              <Text className="text-[13px] font-medium text-white">
                {item.unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
