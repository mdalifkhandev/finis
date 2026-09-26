import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { setCurrentPreviewDocument } from "./documentPreviewStore";

export type TaskExpenseDocument = {
  id: string;
  name: string;
  uri: string;
  size?: number | null;
  mimeType?: string | null;
};

type TaskExpensesCardProps = {
  documents?: TaskExpenseDocument[];
  onRemoveDocument?: (id: string) => void;
};

function formatFileSize(size?: number | null) {
  if (!size) {
    return null;
  }

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / 1024).toFixed(1)} KB`;
}

function getDocumentKind(document: TaskExpenseDocument) {
  const lowerName = document.name.toLowerCase();
  const mimeType = document.mimeType?.toLowerCase() ?? "";

  if (
    mimeType.startsWith("image/") ||
    /\.(png|jpg|jpeg|webp|gif|bmp|heic)$/i.test(lowerName)
  ) {
    return "image";
  }

  if (mimeType.includes("pdf") || lowerName.endsWith(".pdf")) {
    return "pdf";
  }

  return "file";
}

export default function TaskExpensesCard({
  documents = [],
  onRemoveDocument,
}: TaskExpensesCardProps) {
  return (
    <View
      className={`${documents.length ? "mt-3 rounded-[14px] border border-[#D9DFE6] bg-white p-3" : ""}`}
    >
      {documents.length ? (
        <View>
          <Text className="text-[12px] font-medium text-[#1F2937]">
            Selected Documents
          </Text>

          <View className="mt-2 gap-2">
            {documents.map((document) => {
              const sizeLabel = formatFileSize(document.size);
              const kind = getDocumentKind(document);
              const isImage = kind === "image";
              const metaLabel =
                sizeLabel ||
                document.mimeType ||
                (kind === "pdf" ? "PDF Document" : "Document");

              return (
                <View
                  key={document.id}
                  className="overflow-hidden rounded-[12px] border border-[#D7DEE7] bg-[#F8FAFC]"
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      setCurrentPreviewDocument(document);
                      router.push("/screens/company/documentpreview");
                    }}
                  >
                    {isImage ? (
                      <View className="relative">
                        <Image
                          source={{ uri: document.uri }}
                          resizeMode="cover"
                          className="h-[128px] w-full bg-[#E6EEF8]"
                        />
                      </View>
                    ) : (
                      <View className="h-[128px] items-center justify-center bg-[#EDF3FA]">
                        <View className="items-center justify-center rounded-[14px] bg-white px-5 py-4">
                          <Ionicons
                            name={
                              kind === "pdf"
                                ? "document-attach-outline"
                                : "document-text-outline"
                            }
                            size={30}
                            color="#1E5371"
                          />
                          <Text className="mt-2 text-[13px] font-medium text-[#1E5371]">
                            {kind === "pdf"
                              ? "PDF Preview"
                              : "Document Preview"}
                          </Text>
                        </View>
                      </View>
                    )}

                    <View className="flex-row items-center justify-between px-3 py-3">
                      <View className="mr-3 flex-1">
                        <Text
                          numberOfLines={1}
                          className="text-[14px] font-medium text-[#111827]"
                        >
                          {document.name}
                        </Text>
                        <Text className="mt-0.5 text-[12px] text-[#6B7280]">
                          {metaLabel}
                        </Text>
                      </View>

                      <Ionicons
                        name="expand-outline"
                        size={18}
                        color="#1E5371"
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onRemoveDocument?.(document.id)}
                    className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-black/55"
                  >
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}
