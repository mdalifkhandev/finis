import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentPreviewScreen from "@/components/company/taskdetails/DocumentPreviewScreen";
import {
  getCurrentPreviewDocument,
  setCurrentPreviewDocument,
} from "@/components/company/taskdetails/documentPreviewStore";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentPreviewRoute() {
  const document = getCurrentPreviewDocument();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
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
