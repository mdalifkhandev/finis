import BackTitleHeader from "@/components/common/BackTitleHeader";
import DocumentsList from "@/components/company/documents/DocumentsList";
import { getCompanyDocuments } from "@/api/company/company.api";
import { DocumentItem } from "@/components/company/documents/types";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentsRoute() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    getCompanyDocuments().then(setDocuments);
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
