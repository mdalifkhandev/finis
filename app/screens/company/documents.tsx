import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentsList from "@/components/company/documents/DocumentsList";
import { setCurrentPreviewDocument } from "@/components/company/taskdetails/documentPreviewStore";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { getCompanyDocuments } from "@/api/company/company.api";
import { API_BASE_URL } from "@/lib/config";
import { DocumentItem } from "@/components/company/documents/types";
import * as FileSystem from "expo-file-system/legacy";
import RNBlobUtil from "react-native-blob-util";
import * as Sharing from "expo-sharing";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Platform, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function DocumentsRoute() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const companyId = typeof id === "string" ? id : undefined;
  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    if (!companyId) return;
    const result = await getCompanyDocuments(companyId);
    setDocuments(result);
  });

  useEffect(() => {
    let isActive = true;

    if (!companyId) {
      setDocuments([]);
      return;
    }

    const loadDocuments = async () => {
      try {
        const result = await getCompanyDocuments(companyId);
        if (!isActive) return;
        setDocuments(result);
      } catch (error) {
        if (!isActive) return;
        setDocuments([]);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load company documents",
        );
      }
    };

    void loadDocuments();
    return () => {
      isActive = false;
    };
  }, [companyId]);

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
            description: "Downloading company document",
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
        <DocumentsList
          documents={documents}
          onPreviewPress={handlePreviewPress}
          onDownloadPress={handleDownloadPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
