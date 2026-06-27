import BackTitleHeader from "@/components/common/BackTitleHeader";
import ContactCard from "@/components/company/contacts/ContactCard";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { useCompanyContactsQuery } from "@/hooks/company/company";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Linking, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactsRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const companyId = typeof id === "string" ? id : undefined;
  const { data, isLoading } = useCompanyContactsQuery(companyId);
  const { refreshing, onRefresh } = usePullToRefresh();

  const handleCallPress = async (phone: string | null) => {
    if (!phone) {
      return;
    }

    const sanitizedPhone = phone.replace(/[^\d+]/g, "");
    if (!sanitizedPhone) {
      return;
    }

    await Linking.openURL(`tel:${sanitizedPhone}`);
  };

  const handleEmailPress = async (
    email: string,
    fullName: string,
    role: string,
    projectName?: string,
  ) => {
    const subject = projectName
      ? `Quick check-in about ${projectName}`
      : `Hello ${fullName}, quick update`;
    const body = projectName
      ? `Hi ${fullName},\n\nHope you are doing well. I wanted a quick update regarding your ${role} responsibilities for ${projectName}.\n\nThanks.`
      : `Hi ${fullName},\n\nHope you are doing well. I wanted a quick update regarding your ${role} responsibilities.\n\nThanks.`;

    await Linking.openURL(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#e9edf1]">
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
        <BackTitleHeader title="Contacts" onBack={() => router.back()} />
        {isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1d4f6d" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading contacts...
            </Text>
          </View>
        ) : data?.length ? (
          <View className="mt-6 px-5">
            {data.map((contact, index) => (
              <View
                key={contact.userId}
                className={index > 0 ? "mt-4" : ""}
              >
                <ContactCard
                  name={contact.fullName}
                  designation={contact.projects[0]?.role ?? contact.systemRole}
                  avatarUrl={contact.avatarUrl}
                  onCallPress={() => handleCallPress(contact.phone)}
                  onEmailPress={() =>
                    handleEmailPress(
                      contact.email,
                      contact.fullName,
                      contact.projects[0]?.role ?? contact.systemRole,
                      contact.projects[0]?.name,
                    )
                  }
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="mt-10 items-center px-5">
            <Text className="text-sm text-slate-500">No contacts found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
