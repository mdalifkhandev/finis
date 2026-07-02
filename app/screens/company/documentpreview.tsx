import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentPreviewScreen from "@/components/company/taskdetails/DocumentPreviewScreen";
import {
  getCurrentPreviewDocument,
  setCurrentPreviewDocument,
} from "@/components/company/taskdetails/documentPreviewStore";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentPreviewRoute() {
  const params = useLocalSearchParams<{
    uri?: string;
    name?: string;
    mimeType?: string;
  }>();
  const storedDocument = getCurrentPreviewDocument();
  const document = storedDocument ?? {
    uri: Array.isArray(params.uri) ? params.uri[0] : params.uri || "",
    name: Array.isArray(params.name) ? params.name[0] : params.name || "Document Preview",
    mimeType: Array.isArray(params.mimeType) ? params.mimeType[0] : params.mimeType,
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <BackTitleHeader
        title={document?.name || "Document Preview"}
        onBack={() => {
          setCurrentPreviewDocument(null);
          router.back();
        }}
      />
      <DocumentPreviewScreen
        uri={document?.uri || ""}
        name={document?.name || "Document Preview"}
        mimeType={document?.mimeType}
      />
    </SafeAreaView>
  );
}
