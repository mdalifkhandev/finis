import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, ActivityIndicator, Keyboard, Platform, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ChatAttachmentTray from "./ChatAttachmentTray";
import ChatComposer from "./ChatComposer";
import { MessageModel } from "./chatData";
import ChatMessageBubble from "./ChatMessageBubble";
import ConversationHeader from "./ConversationHeader";
import {
  useChatMessagesQuery,
  useChatSocketConnection,
  useSendChatMessageMutation,
} from "@/hooks/chat/chat";

const DEFAULT_CHAT_AVATAR =
  "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop";

export default function ConversationScreen() {
  const { name, avatarUrl, threadId: searchThreadId, id } = useLocalSearchParams<{
    name?: string;
    avatarUrl?: string;
    threadId?: string;
    id?: string;
  }>();

  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [messageText, setMessageText] = useState("");
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const threadId = (searchThreadId || id || "").toString();

  useChatSocketConnection(threadId || undefined);
  const messagesQuery = useChatMessagesQuery(threadId || undefined);
  const sendMessageMutation = useSendChatMessageMutation(threadId || undefined);

  const resolvedName = name || "Wade Warren";
  const resolvedAvatar =
    avatarUrl || DEFAULT_CHAT_AVATAR;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates?.height || 0);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messagesQuery.data?.length]);

  const contentBottomPadding = useMemo(
    () => (attachmentsOpen ? 16 : 26),
    [attachmentsOpen],
  );

  const bottomOffset = Math.max(0, keyboardHeight - insets.bottom);

  const appendMessage = async (message: Omit<MessageModel, "id" | "time">) => {
    if (!threadId) {
      Alert.alert("Chat unavailable", "Thread information is missing.");
      return false;
    }

    try {
      await sendMessageMutation.mutateAsync({
        content: message.text || undefined,
        mediaUrl: message.mediaUrl || message.imageUri,
        mediaType: message.mediaType,
      });
      return true;
    } catch {
      return false;
    }
  };

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text) return;

    const sent = await appendMessage({
      sender: "me",
      text,
      kind: "text",
    });

    if (sent) {
      setMessageText("");
    }
  };

  const handlePickFromGallery = async () => {
    try {
      setAttachmentsOpen(false);
      const ImagePicker = await import("expo-image-picker");

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Allow photo library permission to pick image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      await appendMessage({
        sender: "me",
        text: "",
        kind: "image",
        imageUri: result.assets[0].uri,
        mediaUrl: result.assets[0].uri,
        mediaType: "image",
      });
    } catch {
      Alert.alert("Gallery error", "Could not open gallery. Please try again.");
    }
  };

  const handleOpenCamera = async () => {
    try {
      setAttachmentsOpen(false);
      const ImagePicker = await import("expo-image-picker");

      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Allow camera permission to take photo.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      await appendMessage({
        sender: "me",
        text: "",
        kind: "image",
        imageUri: result.assets[0].uri,
        mediaUrl: result.assets[0].uri,
        mediaType: "image",
      });
    } catch {
      Alert.alert("Camera error", "Could not open camera. Please try again.");
    }
  };

  const handlePickLocation = async () => {
    try {
      setAttachmentsOpen(false);
      const Location = await import("expo-location");

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Allow location permission to send location.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lat = position.coords.latitude.toFixed(5);
      const lon = position.coords.longitude.toFixed(5);

      await appendMessage({
        sender: "me",
        kind: "location",
        text: `My location: ${lat}, ${lon}`,
      });
    } catch {
      Alert.alert("Location error", "Could not get your location.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ConversationHeader
        name={resolvedName}
        avatarUrl={resolvedAvatar}
        idText={threadId ? `ID: #${threadId.slice(0, 8).toUpperCase()}` : undefined}
        onBack={() => router.back()}
      />

      <View className="flex-1">
        {messagesQuery.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color="#1D5478" />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingTop: 12,
              paddingBottom: contentBottomPadding,
            }}
          >
            {(messagesQuery.data ?? []).map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                avatarUrl={resolvedAvatar}
              />
            ))}
          </ScrollView>
        )}

        <View style={{ paddingBottom: bottomOffset }}>
          <ChatComposer
            value={messageText}
            onChangeText={setMessageText}
            onPressSend={handleSend}
            attachmentsOpen={attachmentsOpen}
            onToggleAttachments={() => {
              Keyboard.dismiss();
              setAttachmentsOpen((prev) => !prev);
            }}
            disabled={sendMessageMutation.isPending}
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
