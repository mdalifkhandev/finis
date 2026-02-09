import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

type TaskPhotoCardProps = {
  title: string;
  imageUrl: string;
};

export default function TaskPhotoCard({ title, imageUrl }: TaskPhotoCardProps) {
  return (
    <View className="mt-5 rounded-[16px] border border-[#D6DCE3] bg-[#F7F9FB] p-3.5">
      <View className="flex-row items-center">
        <Ionicons name="camera-outline" size={20} color="#1F2937" />
        <Text className="ml-2.5 text-[16px] font-semibold text-[#1E1E1E]">{title}</Text>
      </View>

      <Image
        source={{ uri: imageUrl }}
        resizeMode="cover"
        className="mt-3 h-[170px] w-full rounded-[14px]"
      />
    </View>
  );
}
