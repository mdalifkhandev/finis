import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentPreviewScreen from "@/components/company/taskdetails/DocumentPreviewScreen";
import {
  getCurrentPreviewDocument,
  setCurrentPreviewDocument,
} from "@/components/company/taskdetails/documentPreviewStore";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentPreviewRoute() {
  const params = useLocalSearchParams<{
    uri?: string;
    name?: string;
    mimeType?: string;
    download?: string;
  }>();
  const storedDocument = getCurrentPreviewDocument();
  const document = storedDocument ?? {
    uri: Array.isArray(params.uri) ? params.uri[0] : params.uri || "",
    name: Array.isArray(params.name) ? params.name[0] : params.name || "Document Preview",
    mimeType: Array.isArray(params.mimeType) ? params.mimeType[0] : params.mimeType,
  };

  const allowDownload =
    (Array.isArray(params.download) ? params.download[0] : params.download) === "1";

  const handleDownload = async () => {
    if (!document?.uri) return;
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert("Unavailable", "Saving is not available on this device.");
        return;
      }
      await Sharing.shareAsync(document.uri, {
        mimeType: document.mimeType ?? "application/pdf",
        dialogTitle: `Save ${document.name}`,
        UTI: "com.adobe.pdf",
      });
    } catch {
      Alert.alert("Download failed", "Unable to save this file.");
    }
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <View className="flex-row items-center">
        <View className="flex-1">
          <BackTitleHeader
            title={document?.name || "Document Preview"}
            onBack={() => {
              setCurrentPreviewDocument(null);
              router.back();
            }}
          />
        </View>
        {allowDownload ? (
          <TouchableOpacity
            onPress={handleDownload}
            activeOpacity={0.85}
            className="mr-5 h-9 w-9 items-center justify-center rounded-full bg-[#1D5478]"
          >
            <Ionicons name="download-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
      </View>
      <DocumentPreviewScreen
        uri={document?.uri || ""}
        name={document?.name || "Document Preview"}
        mimeType={document?.mimeType}
      />
    </SafeAreaView>
  );
}
