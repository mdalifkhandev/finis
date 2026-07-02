import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMailbox, type MailboxListItem, toggleMailboxStar } from "@/api/mailbox/mailbox.api";
import { toast } from "sonner-native";
import ProfileHeaderBar from "./ProfileHeaderBar";

type TabKey = "Inbox" | "Active Project" | "Close Project";

const TABS: TabKey[] = ["Inbox", "Active Project", "Close Project"];

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function ClientEmailBoxScreen() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>("Inbox");

  const statusFilter = useMemo(() => {
    if (activeTab === "Active Project") return "active" as const;
    if (activeTab === "Close Project") return "closed" as const;
    return undefined;
  }, [activeTab]);

  const mailboxQuery = useQuery({
    queryKey: ["mailbox", activeTab],
    queryFn: () => getMailbox({ status: statusFilter, page: 1, limit: 100 }),
  });

  const filteredItems = useMemo(
    () => mailboxQuery.data?.data ?? [],
    [mailboxQuery.data],
  );

  const handleToggleStar = async (id: string) => {
    try {
      await toggleMailboxStar(id);
      await queryClient.invalidateQueries({ queryKey: ["mailbox"] });
    } catch (error: any) {
      toast.error(error?.message || "Unable to update star status.");
    }
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
        {filteredItems.map((item: MailboxListItem) => (
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
                name={item.isStarred ? "star" : "star-outline"}
                size={28}
                color={item.isStarred ? "#FDBA12" : "#3F3F46"}
              />
            </TouchableOpacity>
            <Text className="ml-4 flex-1 text-[17px] text-[#30343B] ">
              {item.clientName || item.clientEmail}
            </Text>
            <Text className="text-[15px] text-[#30343B]">
              {formatTime(item.latestMessage?.createdAt || item.createdAt)}
            </Text>
          </TouchableOpacity>
        ))}

        {!mailboxQuery.isLoading && !filteredItems.length ? (
          <View className="items-center py-12">
            <Text className="text-[15px] text-[#64748B]">No emails found.</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
