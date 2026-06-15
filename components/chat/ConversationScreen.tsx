import { useChatMessagesQuery, useSendChatMessageMutation } from "@/hooks/chat/chat";
import { useAuthStore } from "@/store/auth.store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  ImageSourcePropType,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatAttachmentTray from "./ChatAttachmentTray";
import ChatComposer from "./ChatComposer";
import ChatMessageBubble from "./ChatMessageBubble";
import ConversationHeader from "./ConversationHeader";
import { MessageModel } from "./chatData";

const placeholderAvatar = require("../../assets/images/placeholder-person.png");

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

function resolveAvatarSource(value?: string | ImageSourcePropType | null) {
  if (!value) {
    return placeholderAvatar;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return placeholderAvatar;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("file://") ||
    trimmed.startsWith("content://")
  ) {
    return { uri: trimmed };
  }

  return placeholderAvatar;
}

export default function ConversationScreen() {
  const { threadId, name, avatarUrl, userId: routeUserId } = useLocalSearchParams<{
    threadId?: string;
    name?: string;
    avatarUrl?: string;
    userId?: string;
  }>();

  const userId = useAuthStore((state) => state.user?.id);
  const [messageText, setMessageText] = useState("");
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const messagesQuery = useChatMessagesQuery(threadId);
  const sendMessageMutation = useSendChatMessageMutation(threadId);

  const resolvedName = name || "Chat";
  const profileUserId = typeof routeUserId === "string" ? routeUserId : undefined;
  const resolvedAvatar = resolveAvatarSource(avatarUrl);

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

  const scrollToBottom = (animated = false) => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    });
  };

  const handleContentSizeChange = () => {
    scrollToBottom(false);
  };

  const handleLayout = () => {
    scrollToBottom(false);
  };

  React.useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ConversationHeader
          name={resolvedName}
          avatarUrl={resolvedAvatar}
          idText={threadId ? `ID: ${threadId}` : "ID: #225432"}
          onBack={() => router.back()}
          onPressProfile={() =>
            router.push({
              pathname: "/screens/chat/userprofile",
              params: {
                name: resolvedName,
                avatarUrl: typeof avatarUrl === "string" ? avatarUrl : "",
                id: profileUserId ?? threadId ?? "",
              },
            })
          }
        />

        <View className="flex-1">
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            style={{ flex: 1 }}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 12,
              paddingBottom: attachmentsOpen ? 24 : 12,
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

          <View
            style={{
              backgroundColor: "#E9EDF1",
              paddingBottom: Math.max(keyboardHeight, 0),
            }}
          >
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
