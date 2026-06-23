import React from "react";
import { Image, Text, View } from "react-native";
import ContactActionButton from "./ContactActionButton";
const placeholderImage = require("../../../assets/images/placeholder-person.png");

type ContactCardProps = {
  name: string;
  designation: string;
  avatarUrl?: string | null;
  onEmailPress?: () => void;
  onCallPress?: () => void;
};

export default function ContactCard({
  name,
  designation,
  avatarUrl,
  onEmailPress,
  onCallPress,
}: ContactCardProps) {
  const avatarSource = avatarUrl ? { uri: avatarUrl } : placeholderImage;

  return (
    <View
      className="w-full self-stretch rounded-3xl border border-[#E5E7EB] bg-white p-4"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        <Image source={avatarSource} className="h-12 w-12 rounded-full" />
        <View className="ml-3 flex-1">
          <Text
            className="text-[16px] font-medium leading-6 text-[#1F2937]"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text className="mt-0.5 text-[14px] font-normal leading-5 text-[#4B5563]">
            {designation}
          </Text>
        </View>
      </View>

      <View className="mt-4 w-full flex-row gap-3">
        <ContactActionButton
          label="Email"
          icon="mail-outline"
          onPress={onEmailPress}
        />
        <ContactActionButton
          label="Call"
          icon="call-outline"
          variant="primary"
          onPress={onCallPress}
        />
      </View>
    </View>
  );
}
