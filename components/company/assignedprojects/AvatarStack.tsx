import React from "react";
import { Image, Text, View } from "react-native";
const placeholderImage = require("../../../assets/images/placeholder-image.png");

type AvatarStackProps = {
  avatars: Array<string | null>;
  extraCount: string;
};

export default function AvatarStack({ avatars, extraCount }: AvatarStackProps) {
  const visibleAvatars =
    avatars.length >= 3 ? avatars.slice(0, 3) : [...avatars, null, null].slice(0, 3);

  return (
    <View className="flex-row items-center">
      {visibleAvatars.map((avatar, index) => (
        <Image
          key={`${avatar ?? "placeholder"}-${index}`}
          source={avatar ? { uri: avatar } : placeholderImage}
          className={`h-9 w-9 rounded-full border-[1.5px] border-white ${
            index === 0 ? "" : "-ml-2"
          }`}
        />
      ))}
      <View className="-ml-2 h-9 w-9 items-center justify-center rounded-full bg-[#06dc56]">
        <Text className="text-[10px] font-semibold text-black">
          {extraCount}
        </Text>
      </View>
    </View>
  );
}
