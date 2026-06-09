import BackTitleHeader from "@/components/common/BackTitleHeader";
import { useCreateDirectThreadMutation, useChatContactsQuery, useChatThreadsQuery } from "@/hooks/chat/chat";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatFilterTabs from "./ChatFilterTabs";
import ChatListItem from "./ChatListItem";
import ChatSearchBar from "./ChatSearchBar";
import { ChatFilter, type ChatListItemModel } from "./chatData";

export default function ChatListScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ChatFilter>("chat");

  const contactsQuery = useChatContactsQuery(search);
  const threadsQuery = useChatThreadsQuery(search);
  const openThreadMutation = useCreateDirectThreadMutation();

  const items = useMemo<ChatListItemModel[]>(() => {
    if (search.trim()) {
      const contactItems = contactsQuery.data ?? [];

      return contactItems.map((contact) => ({
        id: contact.id,
        name: contact.fullName,
        preview: contact.role,
        time: "",
        unreadCount: 0,
        avatarUrl: contact.avatarUrl ?? "",
        type: "chat",
        threadId: "",
      }));
    }

    const threadItems = threadsQuery.data ?? [];

    return threadItems.map((thread) => {
      const participant = thread.participants?.find((item) => item?.user?.fullName);

      return {
        id: thread.id,
        name: thread.title || participant?.user?.fullName || "Chat",
        preview: thread.lastMessageText || "No messages yet",
        time: "",
        unreadCount: thread.unreadCount ?? 0,
        avatarUrl: participant?.user?.avatarUrl ?? "",
        type: "chat",
        threadId: thread.id,
      };
    });
  }, [contactsQuery.data, search, threadsQuery.data]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => (filter === "chat" ? true : false));
  }, [filter, items]);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <BackTitleHeader title="Chat" onBack={() => router.back()} />

          <View className="px-5">
            <ChatSearchBar value={search} onChangeText={setSearch} />
            <ChatFilterTabs value={filter} onChange={setFilter} />

            <View className="mt-3">
              {visibleItems.map((item) => (
                <ChatListItem
                  key={item.id}
                  item={item}
                  onPress={async () => {
                    if (search.trim() && !item.threadId) {
                      const thread = await openThreadMutation.mutateAsync(item.id);
                      router.push({
                        pathname: "/screens/chat/conversation",
                        params: {
                          threadId: thread.id,
                          name: item.name,
                          avatarUrl: item.avatarUrl,
                        },
                      });
                      return;
                    }

                    router.push({
                      pathname: "/screens/chat/conversation",
                      params: {
                        threadId: item.threadId || item.id,
                        name: item.name,
                        avatarUrl: item.avatarUrl,
                      },
                    });
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
