import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type DocumentCardProps = {
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  onDownloadPress?: () => void;
};

export default function DocumentCard({
  fileName,
  fileType,
  fileSize,
  uploadedBy,
  uploadedDate,
  onDownloadPress,
}: DocumentCardProps) {
  return (
    <View
      className="w-full rounded-[14px] border border-[#E3E7EC] bg-white px-4 py-3"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start">
        <View className="h-12 w-12 items-center justify-center rounded-lg bg-[#DDEAFB]">
          <Ionicons name="document-text-outline" size={24} color="#2563EB" />
        </View>

        <View className="ml-3 flex-1">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-[16px] font-medium leading-6 text-[#111827]"
          >
            {fileName}
          </Text>
          <Text className="text-[14px] leading-6 text-[#4B5563]">
            {fileType} • {fileSize}
          </Text>
          <Text className="text-[12px] leading-4 text-[#6B7280]">
            Uploaded by {uploadedBy} on {uploadedDate}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onDownloadPress}
          activeOpacity={0.75}
          className="h-8 w-8 items-center justify-center"
        >
          <Ionicons name="download-outline" size={24} color="#1E5A80" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
