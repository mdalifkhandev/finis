import React from "react";
import { Image, Text, View } from "react-native";

type AvatarStackProps = {
  avatars: string[];
  extraCount: string;
};

export default function AvatarStack({ avatars, extraCount }: AvatarStackProps) {
  return (
    <View className="flex-row items-center">
      {avatars.slice(0, 3).map((avatar, index) => (
        <Image
          key={`${avatar}-${index}`}
          source={{ uri: avatar }}
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
