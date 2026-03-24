import BackTitleHeader from "@/components/common/BackTitleHeader";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatFilterTabs from "./ChatFilterTabs";
import ChatListItem from "./ChatListItem";
import ChatSearchBar from "./ChatSearchBar";
import { ChatFilter, chatListMock } from "./chatData";

export default function ChatListScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ChatFilter>("chat");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return chatListMock.filter((item) => {
      const matchesFilter = item.type === filter;
      const matchesSearch = query
        ? item.name.toLowerCase().includes(query)
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

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
              {filteredItems.map((item) => (
                <ChatListItem
                  key={item.id}
                  item={item}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/chat/conversation",
                      params: {
                        name: item.name,
                        avatarUrl: item.avatarUrl,
                        id: item.id,
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
