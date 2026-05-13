import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Keyboard, Platform, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ChatAttachmentTray from "./ChatAttachmentTray";
import ChatComposer from "./ChatComposer";
import { MessageModel, conversationInitialMessages } from "./chatData";
import ChatMessageBubble from "./ChatMessageBubble";
import ConversationHeader from "./ConversationHeader";

function getCurrentTimeLabel() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ConversationScreen() {
  const { name, avatarUrl } = useLocalSearchParams<{
    name?: string;
    avatarUrl?: string;
  }>();

  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState("");
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [messages, setMessages] = useState(conversationInitialMessages);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const resolvedName = name || "Wade Warren";
  const resolvedAvatar =
    avatarUrl ||
    "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop";

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

  const contentBottomPadding = useMemo(
    () => (attachmentsOpen ? 16 : 26),
    [attachmentsOpen],
  );

  const bottomOffset = Math.max(0, keyboardHeight - insets.bottom);

  const appendMessage = (message: Omit<MessageModel, "id" | "time">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        time: getCurrentTimeLabel(),
      },
    ]);
  };

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;

    appendMessage({
      sender: "me",
      text,
      kind: "text",
    });

    setMessageText("");
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

      appendMessage({
        sender: "me",
        text: "",
        kind: "image",
        imageUri: result.assets[0].uri,
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

      appendMessage({
        sender: "me",
        text: "",
        kind: "image",
        imageUri: result.assets[0].uri,
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

      appendMessage({
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
        idText="ID: #225432"
        onBack={() => router.back()}
      />

      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: contentBottomPadding,
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
