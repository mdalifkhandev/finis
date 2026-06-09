import { useChatMessagesQuery, useSendChatMessageMutation } from "@/hooks/chat/chat";
import { useAuthStore } from "@/store/auth.store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatAttachmentTray from "./ChatAttachmentTray";
import ChatComposer from "./ChatComposer";
import ChatMessageBubble from "./ChatMessageBubble";
import ConversationHeader from "./ConversationHeader";
import { MessageModel } from "./chatData";

function getCurrentTimeLabel() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatMessageTime(value?: string | null) {
  if (!value) {
    return getCurrentTimeLabel();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return getCurrentTimeLabel();
  }

  return parsed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationScreen() {
  const { threadId, name, avatarUrl } = useLocalSearchParams<{
    threadId?: string;
    name?: string;
    avatarUrl?: string;
  }>();

  const userId = useAuthStore((state) => state.user?.id);
  const [messageText, setMessageText] = useState("");
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  const messagesQuery = useChatMessagesQuery(threadId);
  const sendMessageMutation = useSendChatMessageMutation(threadId);

  const resolvedName = name || "Chat";
  const resolvedAvatar =
    avatarUrl ||
    "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop";

  const messages = useMemo<MessageModel[]>(() => {
    return (messagesQuery.data ?? []).map((message) => ({
      id: message.id,
      text: message.text,
      time: formatMessageTime(message.time),
      sender: message.sender === "me" ? "me" : "other",
      kind: message.kind,
      imageUri: message.imageUri,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatarUrl: message.senderAvatarUrl,
    }));
  }, [messagesQuery.data, userId]);

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text) return;

    await sendMessageMutation.mutateAsync({ content: text });
    setMessageText("");
    messagesQuery.refetch();
  };

  const handlePickFromGallery = async () => {
    Alert.alert("Not available", "Attachment sending is not wired yet.");
  };

  const handleOpenCamera = async () => {
    Alert.alert("Not available", "Attachment sending is not wired yet.");
  };

  const handlePickLocation = async () => {
    Alert.alert("Not available", "Attachment sending is not wired yet.");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ConversationHeader
        name={resolvedName}
        avatarUrl={resolvedAvatar}
        idText={threadId ? `ID: ${threadId}` : "ID: #225432"}
        onBack={() => router.back()}
      />

      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: attachmentsOpen ? 16 : 26,
          }}
        >
          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              avatarUrl={resolvedAvatar}
            />
          ))}
        </ScrollView>

        <View>
          <ChatComposer
            value={messageText}
            onChangeText={setMessageText}
            onPressSend={handleSend}
            attachmentsOpen={attachmentsOpen}
            onToggleAttachments={() => setAttachmentsOpen((prev) => !prev)}
          />

          {attachmentsOpen ? (
            <ChatAttachmentTray
              onPressPhoto={handlePickFromGallery}
              onPressCamera={handleOpenCamera}
              onPressLocation={handlePickLocation}
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
