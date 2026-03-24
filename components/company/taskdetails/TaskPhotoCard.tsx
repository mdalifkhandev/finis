import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

type TaskPhotoCardProps = {
  title: string;
  imageUrl: string;
};

export default function TaskPhotoCard({ title, imageUrl }: TaskPhotoCardProps) {
  return (
    <View className="mt-4 rounded-[16px] border border-[#DADFE5] bg-white p-3">
      <View className="flex-row items-center">
        <Ionicons name="camera-outline" size={19} color="#1F2937" />
        <Text className="ml-2 text-[15px] font-semibold text-[#1E1E1E]">
          {title}
        </Text>
      </View>

      <Image
        source={{ uri: imageUrl }}
        resizeMode="cover"
        className="mt-3 h-[185px] w-full rounded-[14px]"
      />
    </View>
  );
}
