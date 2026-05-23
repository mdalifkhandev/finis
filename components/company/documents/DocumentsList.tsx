import React from "react";
import { Text, View } from "react-native";
import DocumentCard from "./DocumentCard";
import { DocumentItem } from "./types";

type DocumentsListProps = {
  documents: DocumentItem[];
  onPreviewPress?: (document: DocumentItem) => void;
  onDownloadPress?: (document: DocumentItem) => void;
};

export default function DocumentsList({
  documents,
  onPreviewPress,
  onDownloadPress,
}: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <View className="mt-7 px-5">
        <View className="rounded-[14px] border border-[#D8DEE5] bg-[#F7F9FB] px-4 py-5">
          <Text className="text-center text-[14px] text-[#697487]">
            No documents found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-7 px-5">
      {documents.map((document, index) => {
        const uploaderName =
          typeof document.uploadedBy === "object" && document.uploadedBy !== null
            ? (document.uploadedBy as any).fullName
            : document.uploadedBy || "Unknown";

        const sizeString = document.fileSizeMb !== undefined
          ? `${document.fileSizeMb} MB`
          : document.fileSize || "Unknown size";

        let dateString = (document as any).uploadedAt || document.uploadedDate || "";
        if (dateString) {
          try {
            const d = new Date(dateString);
            if (!isNaN(d.getTime())) {
              dateString = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            }
          } catch {}
        }

        return (
          <View key={document.id} className={index > 0 ? "mt-3.5" : ""}>
            <DocumentCard
              fileName={document.fileName}
              fileType={document.fileType}
              fileSize={sizeString}
              uploadedBy={uploaderName}
              uploadedDate={dateString}
              onPreviewPress={
                onPreviewPress ? () => onPreviewPress(document) : undefined
              }
              onDownloadPress={
                onDownloadPress ? () => onDownloadPress(document) : undefined
              }
            />
          </View>
        );
      })}
    </View>
  );
}

