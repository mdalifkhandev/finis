import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentsList from "@/components/company/documents/DocumentsList";
import { setCurrentPreviewDocument } from "@/components/company/taskdetails/documentPreviewStore";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { useProjectDocumentsQuery } from "@/hooks/company/company";
import { API_BASE_URL } from "@/lib/config";
import { DocumentItem } from "@/components/company/documents/types";
import * as FileSystem from "expo-file-system/legacy";
import RNBlobUtil from "react-native-blob-util";
import * as Sharing from "expo-sharing";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Platform, RefreshControl, ScrollView, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function ProjectDocumentsRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const projectId = typeof id === "string" ? id : undefined;

  const { data: documents = [], isLoading, refetch } = useProjectDocumentsQuery(projectId);

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    if (projectId) {
      await refetch();
    }
  });

  const handleDownloadPress = async (document: DocumentItem) => {
    if (!document.fileUrl) {
      toast.error("File URL not found");
      return;
    }

    const fullUrl = document.fileUrl.startsWith("http")
      ? document.fileUrl
      : `${API_BASE_URL}${document.fileUrl}`;

    try {
      if (Platform.OS === "android") {
        const { fs, config } = RNBlobUtil;
        const downloadsDir = fs.dirs.DownloadDir;
        const destinationPath = `${downloadsDir}/${document.fileName}`;

        await config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: document.fileName,
            path: destinationPath,
            mime: document.fileType,
            description: "Downloading project document",
          },
        }).fetch("GET", fullUrl);
      } else {
        const destination = `${FileSystem.documentDirectory}${document.fileName}`;
        const result = await FileSystem.downloadAsync(
          fullUrl,
          destination,
        );
        const sharingAvailable = await Sharing.isAvailableAsync();
        if (sharingAvailable) {
          await Sharing.shareAsync(result.uri, {
            mimeType: document.fileType,
            dialogTitle: "Save document",
          });
        }
      }

      toast.success("Document downloaded");
      Alert.alert(
        "Download complete",
        Platform.OS === "android"
          ? "Saved in your Downloads folder."
          : "Download completed.",
      );
    } catch {
      toast.error("Download failed");
    }
  };

  const handlePreviewPress = (document: DocumentItem) => {
    if (!document.fileUrl) {
      toast.error("Preview URL not found");
      return;
    }

    const fullUrl = document.fileUrl.startsWith("http")
      ? document.fileUrl
      : `${API_BASE_URL}${document.fileUrl}`;

    setCurrentPreviewDocument({
      id: document.id,
      name: document.fileName,
      uri: fullUrl,
      mimeType: document.fileType,
      size: null,
    });
    router.push("/screens/company/documentpreview");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <BackTitleHeader title="Documents" onBack={() => router.back()} />
        {isLoading && !refreshing ? (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator size="large" color="#1F506D" />
          </View>
        ) : (
          <DocumentsList
            documents={documents}
            onPreviewPress={handlePreviewPress}
            onDownloadPress={handleDownloadPress}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

