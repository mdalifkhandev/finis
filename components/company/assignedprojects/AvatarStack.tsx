import React, { useState } from "react";
import { Image, Text, View } from "react-native";
const placeholderImage = require("../../../assets/images/placeholder-person.png");

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
        <AvatarThumb
          key={`${avatar ?? "placeholder"}-${index}`}
          avatar={avatar}
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

function AvatarThumb({
  avatar,
  className,
}: {
  avatar: string | null;
  className: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Image
      source={avatar && !imageFailed ? { uri: avatar } : placeholderImage}
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
}
