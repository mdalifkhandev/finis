import BackTitleHeader from "@/components/common/BackTitleHeader";
import {
  useChatContactsQuery,
  useChatSocketConnection,
  useChatThreadsQuery,
  useCreateDirectThreadMutation,
} from "@/hooks/chat/chat";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatFilterTabs from "./ChatFilterTabs";
import ChatListItem from "./ChatListItem";
import { ChatFilter } from "./chatData";

type ContactItem = {
  id: string;
  name: string;
  role: string;
  status: string;
  avatarUrl: string;
};

export default function ChatListScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ChatFilter>("chat");
  const threadsQuery = useChatThreadsQuery(filter, search);
  const contactsQuery = useChatContactsQuery(search);
  const openThreadMutation = useCreateDirectThreadMutation();
  useChatSocketConnection();

  const filteredItems = useMemo(() => threadsQuery.data ?? [], [threadsQuery.data]);
  const contacts = useMemo(
    () => (contactsQuery.data ?? []) as ContactItem[],
    [contactsQuery.data],
  );
  const showContactOverlay = search.trim().length > 0;

  const openContactChat = async (contact: ContactItem) => {
    const thread = await openThreadMutation.mutateAsync(contact.id);

    router.push({
      pathname: "/screens/chat/conversation",
      params: {
        threadId: thread.id,
        name: contact.name,
        avatarUrl: contact.avatarUrl,
      },
    });
  };

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
            <View className="relative mt-6">
              <View className="h-[40px] flex-row items-center rounded-[10px] border border-[#D4DAE3] bg-[#F8FAFC] px-4">
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by name"
                  placeholderTextColor="#9399A2"
                  className="ml-3 flex-1 text-[14px] text-[#1F2937]"
                />
              </View>

              {showContactOverlay ? (
                <View className="absolute left-0 right-0 top-[46px] z-20 overflow-hidden rounded-[16px] border border-[#D8E0E8] bg-white shadow-sm">
                  <View className="flex-row items-center justify-between border-b border-[#EEF2F6] px-4 py-3">
                    <Text className="text-[14px] font-semibold text-[#1F2937]">
                      People
                    </Text>
                    {contactsQuery.isLoading ? (
                      <ActivityIndicator size="small" color="#1D5478" />
                    ) : null}
                  </View>

                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    style={{ maxHeight: 320 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {contacts.length === 0 && !contactsQuery.isLoading ? (
                      <View className="px-4 py-5">
                        <Text className="text-[14px] text-[#66707B]">
                          No people found
                        </Text>
                      </View>
                    ) : null}

                    {contacts.map((contact) => (
                      <Pressable
                        key={contact.id}
                        onPress={() => void openContactChat(contact)}
                        className="flex-row items-center px-4 py-3 active:bg-[#F7FAFC]"
                      >
                        <View className="h-11 w-11 overflow-hidden rounded-full bg-[#E9EDF1]">
                          {contact.avatarUrl ? (
                            <Image
                              source={{ uri: contact.avatarUrl }}
                              className="h-full w-full"
                            />
                          ) : null}
                        </View>

                        <View className="ml-3 flex-1">
                          <View className="flex-row items-center">
                            <Text className="text-[15px] font-semibold text-[#1F2937]">
                              {contact.name}
                            </Text>
                            <View className="ml-2 h-2 w-2 rounded-full bg-[#28C76F]" />
                          </View>
                          <Text className="mt-0.5 text-[13px] text-[#66707B]">
                            {contact.role}
                          </Text>
                        </View>

                        <Text className="text-[12px] text-[#1D5478]">Chat</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>

            <ChatFilterTabs value={filter} onChange={setFilter} />

            <View className="mt-3">
              {threadsQuery.isLoading ? (
                <View className="items-center py-10">
                  <ActivityIndicator size="small" color="#1D5478" />
                </View>
              ) : null}

              {!threadsQuery.isLoading && filteredItems.length === 0 ? (
                <View className="items-center py-10">
                  <Text className="text-[15px] text-[#4F5560]">
                    No conversations found
                  </Text>
                </View>
              ) : null}

              {filteredItems.map((item) => (
                <ChatListItem
                  key={item.id}
                  item={item}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/chat/conversation",
                      params: {
                        threadId: item.threadId ?? item.id,
                        name: item.name,
                        avatarUrl: item.avatarUrl,
                      },
                    })
                  }
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
