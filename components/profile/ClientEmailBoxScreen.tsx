import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EMAIL_ITEMS, EmailItem, TabKey } from "./clientEmailData";
import ProfileHeaderBar from "./ProfileHeaderBar";

const TABS: TabKey[] = ["Inbox", "Active Project", "Close Project"];

export default function ClientEmailBoxScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("Inbox");
  const [emails, setEmails] = useState<EmailItem[]>(EMAIL_ITEMS);

  const filteredItems = useMemo(
    () => emails.filter((item) => item.tab === activeTab),
    [activeTab, emails],
  );

  const handleToggleStar = (id: string) => {
    setEmails((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item,
      ),
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      <ProfileHeaderBar title="Client Email Box" onBack={() => router.back()} />

      <View className="px-5 pt-5">
        <View className="flex-row flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.85}
                onPress={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-1.5 ${
                  isActive ? "border-[#1D5478] bg-[#1D5478]" : "border-[#1D5478] bg-white"
                }`}
              >
                <Text
                  className={`text-[14px] font-medium ${
                    isActive ? "text-white" : "text-[#1D5478]"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
      >
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/screens/profile/clientemaildetails",
                params: {
                  id: item.id,
                },
              })
            }
            className="flex-row items-center border-b border-[#E5E7EB] py-6"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={(event) => {
                event.stopPropagation();
                handleToggleStar(item.id);
              }}
              className="pr-2"
            >
              <Ionicons
                name={item.starred ? "star" : "star-outline"}
                size={28}
                color={item.starred ? "#FDBA12" : "#3F3F46"}
              />
            </TouchableOpacity>
            <Text className="ml-4 flex-1 text-[17px] text-[#30343B] ">{item.name}</Text>
            <Text className="text-[15px] text-[#30343B]">{item.time}</Text>
          </TouchableOpacity>
        ))}

        {!filteredItems.length ? (
          <View className="items-center py-12">
            <Text className="text-[15px] text-[#64748B]">No emails found.</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
