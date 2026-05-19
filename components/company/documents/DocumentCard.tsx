import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type DocumentCardProps = {
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  onPreviewPress?: () => void;
  onDownloadPress?: () => void;
};

export default function DocumentCard({
  fileName,
  fileType,
  fileSize,
  uploadedBy,
  uploadedDate,
  onPreviewPress,
  onDownloadPress,
}: DocumentCardProps) {
  return (
    <View
      className="w-full rounded-[14px] border border-[#D8DEE5] bg-[#F7F9FB] px-4 py-3.5"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <View className="flex-row items-start">
        <View className="h-12 w-12 items-center justify-center rounded-lg bg-[#D7E5F8]">
          <Ionicons name="document-text-outline" size={22} color="#2662F4" />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPreviewPress}
          className="ml-3 flex-1"
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-[16px] font-medium leading-6 text-[#141A22]"
          >
            {fileName}
          </Text>
          <Text className="text-[14px] leading-6 text-[#4D596A]">
            {fileType} • {fileSize}
          </Text>
          <Text className="text-[13px] leading-5 text-[#697487]">
            Uploaded by {uploadedBy} on {uploadedDate}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDownloadPress}
          activeOpacity={0.75}
          className="h-8 w-8 items-center justify-center"
        >
          <Ionicons name="download-outline" size={20} color="#1E5A80" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
