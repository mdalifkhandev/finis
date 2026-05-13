import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DocumentPreviewScreenProps = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

type PdfModule = typeof import("react-native-pdf");

function resolveKind(mimeType?: string | null, name?: string) {
  const lowerName = name?.toLowerCase() ?? "";
  const lowerMimeType = mimeType?.toLowerCase() ?? "";

  if (
    lowerMimeType.startsWith("image/") ||
    /\.(png|jpg|jpeg|webp|gif|bmp|heic)$/i.test(lowerName)
  ) {
    return "image";
  }

  if (lowerMimeType.includes("pdf") || lowerName.endsWith(".pdf")) {
    return "pdf";
  }

  return "file";
}

function resolveMimeType(name: string, mimeType?: string | null) {
  if (mimeType) {
    return mimeType;
  }

  const lowerName = name.toLowerCase();

  if (lowerName.endsWith(".pdf")) return "application/pdf";
  if (lowerName.endsWith(".doc")) return "application/msword";
  if (lowerName.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lowerName.endsWith(".xls")) return "application/vnd.ms-excel";
  if (lowerName.endsWith(".xlsx")) {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  if (lowerName.endsWith(".ppt")) return "application/vnd.ms-powerpoint";
  if (lowerName.endsWith(".pptx")) {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }
  if (lowerName.endsWith(".txt")) return "text/plain";
  if (lowerName.endsWith(".png")) return "image/png";
  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg"))
    return "image/jpeg";

  return "*/*";
}

export default function DocumentPreviewScreen({
  uri,
  name,
  mimeType,
}: DocumentPreviewScreenProps) {
  const [pdfModule, setPdfModule] = useState<PdfModule | null>(null);
  const [pdfUnavailable, setPdfUnavailable] = useState(false);
  const resolvedKind = useMemo(
    () => resolveKind(mimeType, name),
    [mimeType, name],
  );
  const resolvedMimeType = useMemo(
    () => resolveMimeType(name, mimeType),
    [mimeType, name],
  );

  useEffect(() => {
    let active = true;

    if (resolvedKind !== "pdf") {
      setPdfModule(null);
      setPdfUnavailable(false);
      return () => {
        active = false;
      };
    }

    import("react-native-pdf")
      .then((module) => {
        if (!active) return;
        setPdfModule(module);
        setPdfUnavailable(false);
      })
      .catch(() => {
        if (!active) return;
        setPdfModule(null);
        setPdfUnavailable(true);
      });

    return () => {
      active = false;
    };
  }, [resolvedKind]);

  const handleOpenFile = async () => {
    try {
      const sharingAvailable = await Sharing.isAvailableAsync();

      if (sharingAvailable && resolvedKind === "file") {
        await Sharing.shareAsync(uri, {
          mimeType: resolvedMimeType,
          dialogTitle: `Open ${name}`,
        });
        return;
      }

      if (Platform.OS === "android" && uri.startsWith("file://")) {
        const IntentLauncher = await import("expo-intent-launcher");
        const contentUri = await FileSystem.getContentUriAsync(uri);

        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: resolvedMimeType,
        });
        return;
      }

      await Linking.openURL(uri);
    } catch {
      Alert.alert("Open failed", "Unable to open this file on the device.");
    }
  };

  if (!uri) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-[15px] text-[#6B7280]">
          No preview available.
        </Text>
      </View>
    );
  }

  if (resolvedKind === "image") {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri }} contentFit="contain" style={{ flex: 1 }} />
      </View>
    );
  }

  if (resolvedKind === "pdf") {
    const Pdf = pdfModule?.default;

    if (!Pdf || pdfUnavailable) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center rounded-[18px] border border-[#D8E0E8] bg-white px-8 py-8">
            <Ionicons name="document-text-outline" size={42} color="#1E5371" />
            <Text className="mt-3 text-center text-[16px] font-medium text-[#111827]">
              {name}
            </Text>
            <Text className="mt-2 text-center text-[13px] text-[#6B7280]">
              PDF preview is unavailable in this runtime. You can open the file
              in another app instead.
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleOpenFile}
              className="mt-5 h-[48px] min-w-[170px] items-center justify-center rounded-[12px] bg-[#1E5371] px-5"
            >
              <Text className="text-[15px] font-medium text-white">
                Open File
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1 bg-[#0F172A]">
        <Pdf
          source={{ uri, cache: true }}
          trustAllCerts={false}
          style={{ flex: 1 }}
          renderActivityIndicator={() => (
            <View className="flex-1 items-center justify-center">
              <Text className="text-[15px] text-white">Loading PDF...</Text>
            </View>
          )}
          onError={() => {
            Alert.alert(
              "Preview failed",
              "Unable to preview this PDF inline. You can open it directly.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Open File", onPress: handleOpenFile },
              ],
            );
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="items-center rounded-[18px] border border-[#D8E0E8] bg-white px-8 py-8">
        <Ionicons name="document-text-outline" size={42} color="#1E5371" />
        <Text className="mt-3 text-center text-[16px] font-medium text-[#111827]">
          {name}
        </Text>
        <Text className="mt-2 text-center text-[13px] text-[#6B7280]">
          This file type opens through the device app chooser. If Google Drive,
          Docs, or Word is installed, you can open it there.
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleOpenFile}
          className="mt-5 h-[48px] min-w-[170px] items-center justify-center rounded-[12px] bg-[#1E5371] px-5"
        >
          <Text className="text-[15px] font-medium text-white">
            Open In App
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
