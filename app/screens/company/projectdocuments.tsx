import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentsList from "@/components/company/documents/DocumentsList";
import { getProjectDocuments } from "@/components/company/documents/documentApi";
import { DocumentItem } from "@/components/company/documents/types";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const projectId = "riverside-tower";

export default function ProjectDocumentsRoute() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    getProjectDocuments(projectId).then(setDocuments);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <BackTitleHeader title="Documents" onBack={() => router.back()} />
        <DocumentsList documents={documents} />
      </ScrollView>
    </SafeAreaView>
  );
}
