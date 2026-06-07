import BackTitleHeader from "@/components/common/BackTitleHeader";
import { useChatSocketConnection, useChatThreadsQuery } from "@/hooks/chat/chat";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatFilterTabs from "./ChatFilterTabs";
import ChatListItem from "./ChatListItem";
import ChatSearchBar from "./ChatSearchBar";
import { ChatFilter } from "./chatData";

export default function ChatListScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ChatFilter>("chat");
  const threadsQuery = useChatThreadsQuery(filter, search);
  useChatSocketConnection();

  const filteredItems = useMemo(() => threadsQuery.data ?? [], [threadsQuery.data]);

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
