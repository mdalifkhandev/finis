import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentCard from "@/components/company/documents/DocumentCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const documents = [
  {
    fileName: "Project Blueprint.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "John Smith",
    uploadedDate: "1/15/2025",
  },
  {
    fileName: "Safety Guidelines.docx",
    fileType: "DOCX",
    fileSize: "856 KB",
    uploadedBy: "Emily Chen",
    uploadedDate: "1/16/2025",
  },
  {
    fileName: "Budget Breakdown.xlsx",
    fileType: "XLSX",
    fileSize: "1.2 MB",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "1/17/2025",
  },
  {
    fileName: "Site Photos.zip",
    fileType: "ZIP",
    fileSize: "15.8 MB",
    uploadedBy: "Mike Davis",
    uploadedDate: "1/18/2025",
  },
];

export default function DocumentsRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <BackTitleHeader title="Documents" onBack={() => router.back()} />

        <View className="mt-6 px-5">
          {documents.map((document, index) => (
            <View
              key={`${document.fileName}-${index}`}
              className={index > 0 ? "mt-4" : ""}
            >
              <DocumentCard
                fileName={document.fileName}
                fileType={document.fileType}
                fileSize={document.fileSize}
                uploadedBy={document.uploadedBy}
                uploadedDate={document.uploadedDate}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
