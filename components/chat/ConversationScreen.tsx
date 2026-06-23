import { useChatMessagesQuery } from "@/hooks/chat/chat";
import { uploadChatFile } from "@/api/chat/chat.api";
import { useAuthStore } from "@/store/auth.store";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatAttachmentTray from "./ChatAttachmentTray";
import ChatComposer from "./ChatComposer";
import ChatMessageBubble from "./ChatMessageBubble";
import ConversationHeader from "./ConversationHeader";
import { MessageModel } from "./chatData";
import {
  sendChatTypingViaSocket,
  sendChatMessageWithFallback,
  sendChatReadViaSocket,
  useChatThreadPresence,
  useChatUserOnlineStatus,
  useChatSocket,
} from "@/lib/chat-socket";

const placeholderAvatar = require("../../assets/images/placeholder-person.png");
const MESSAGE_BATCH_SIZE = 20;
const TOP_LOAD_THRESHOLD = 80;
const BOTTOM_STICKY_THRESHOLD = 80;

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

function getUploadFileName(uri: string, fallback: string) {
  const parts = uri.split("/");
  return parts[parts.length - 1] || fallback;
}

function resolveMessageKind(mediaType?: string | null, locationUrl?: string | null) {
  if (locationUrl) {
    return "location" as const;
  }

  if (mediaType === "image") {
    return "image" as const;
  }

  return "text" as const;
}

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

type PendingAttachment =
  | {
      type: "image" | "video" | "document";
      uri: string;
      name: string;
      mimeType: string;
      previewText: string;
    }
  | {
      type: "location";
      latitude: number;
      longitude: number;
      locationLabel: string;
      locationUrl: string;
      previewText: string;
    };

export default function ConversationScreen() {
  const { threadId, name, avatarUrl, userId: routeUserId, isOnline } = useLocalSearchParams<{
    threadId?: string;
    name?: string;
    avatarUrl?: string;
    userId?: string;
    isOnline?: string;
  }>();
  const resolvedThreadId = Array.isArray(threadId) ? threadId[0] : threadId;

  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.token);
  const [messageText, setMessageText] = useState("");
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [optimisticMessages, setOptimisticMessages] = useState<MessageModel[]>([]);
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [visibleMessageCount, setVisibleMessageCount] = useState(MESSAGE_BATCH_SIZE);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readSyncedThreadRef = useRef<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const initialScrollDoneRef = useRef(false);
  const topLoadArmedRef = useRef(false);
  const preserveScrollRef = useRef(false);
  const currentScrollOffsetRef = useRef(0);
  const currentContentHeightRef = useRef(0);
  const previousContentHeightRef = useRef(0);
  const isNearBottomRef = useRef(true);

  const messagesQuery = useChatMessagesQuery(resolvedThreadId);
  useChatSocket(resolvedThreadId);
  const { isOtherTyping } = useChatThreadPresence(resolvedThreadId);

  const resolvedName = name || "Chat";
  const profileUserId = typeof routeUserId === "string" ? routeUserId : undefined;
  const resolvedAvatar = resolveAvatarSource(avatarUrl);
  const isParticipantOnline = useChatUserOnlineStatus(
    profileUserId ?? resolvedThreadId,
    isOnline === "true",
  );

  const allMessages = useMemo<MessageModel[]>(() => {
    const serverMessages: MessageModel[] = (messagesQuery.data ?? []).map((message) => ({
      id: message.id,
      text: message.text,
      time: formatMessageTime(message.time),
      sender: message.sender === "me" ? "me" : "other",
      isRead: message.isRead,
      kind: message.kind,
      imageUri: message.imageUri,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatarUrl: message.senderAvatarUrl,
    }));

    const merged = [...serverMessages, ...optimisticMessages];
    return merged.filter(
      (message, index, array) => array.findIndex((item) => item.id === message.id) === index,
    );
  }, [messagesQuery.data, optimisticMessages, userId]);

  const visibleMessages = useMemo(() => {
    if (allMessages.length <= visibleMessageCount) {
      return allMessages;
    }

    const startIndex = Math.max(0, allMessages.length - visibleMessageCount);
    return allMessages.slice(startIndex);
  }, [allMessages, visibleMessageCount]);

  const lastOwnMessageId = useMemo(() => {
    for (let index = allMessages.length - 1; index >= 0; index -= 1) {
      if (allMessages[index]?.sender === "me") {
        return allMessages[index].id;
      }
    }

    return null;
  }, [allMessages]);

  const appendLocalMessage = (message: MessageModel) => {
    if (!resolvedThreadId) {
      return;
    }

    setOptimisticMessages((current) => [...current, message]);
  };

  const sendPayload = async (payload: {
    content?: string;
    mediaUrl?: string;
    mediaType?: "image" | "video" | "document" | "audio";
    locationUrl?: string;
  }) => {
    if (!resolvedThreadId) {
      return;
    }

    const sentMessage = await sendChatMessageWithFallback(
      {
        threadId: resolvedThreadId,
        ...payload,
      },
      token,
    );

    const kind = resolveMessageKind(payload.mediaType, payload.locationUrl);
    appendLocalMessage({
      id: sentMessage.id,
      text:
        sentMessage.content ??
        payload.content ??
        (payload.locationUrl ? "Shared a location" : payload.mediaType === "document" ? "Shared a file" : ""),
      time: formatMessageTime(sentMessage.sentAt),
      sender: "me",
      kind,
      senderId: userId,
      imageUri: payload.mediaType === "image" ? payload.mediaUrl : undefined,
      mediaType: payload.mediaType,
      mediaUrl: payload.mediaUrl ?? payload.locationUrl,
    });

    void messagesQuery.refetch();
  };

  const handleSend = async () => {
    if (isSending) {
      return;
    }

    const text = messageText.trim();
    if (!resolvedThreadId) return;

    try {
      setIsSending(true);

      if (pendingAttachment) {
        if (pendingAttachment.type === "location") {
          await sendPayload({
            content: pendingAttachment.previewText,
            locationUrl: pendingAttachment.locationUrl,
          });
        } else {
          const upload = await uploadChatFile({
            uri: pendingAttachment.uri,
            name: pendingAttachment.name,
            type: pendingAttachment.mimeType,
          });

          await sendPayload({
            content: pendingAttachment.previewText,
            mediaUrl: upload.url,
            mediaType: pendingAttachment.type === "document" ? "document" : pendingAttachment.type,
          });
        }

        setPendingAttachment(null);
        setMessageText("");
        return;
      }

      if (!text) return;



      await sendPayload({ content: text });
      setMessageText("");
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
      if (resolvedThreadId) {
        void sendChatTypingViaSocket({ threadId: resolvedThreadId, isTyping: false }, token);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleTypingChange = (nextValue: string) => {
    if (!resolvedThreadId) {
      return;
    }

    const isTyping = nextValue.trim().length > 0;
    void sendChatTypingViaSocket({ threadId: resolvedThreadId, isTyping }, token);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        void sendChatTypingViaSocket({ threadId: resolvedThreadId, isTyping: false }, token);
      }, 1500);
    }
  };

  const handlePickFromGallery = async () => {
    if (!resolvedThreadId) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setPendingAttachment({
      type: asset.type === "video" ? "video" : "image",
      uri: asset.uri,
      name: asset.fileName ?? getUploadFileName(asset.uri, "chat-media"),
      mimeType: asset.mimeType ?? (asset.type === "video" ? "video/mp4" : "image/jpeg"),
      previewText: asset.type === "video" ? "Shared a video" : "Shared an image",
    });
    setAttachmentsOpen(false);
  };

  const handleOpenCamera = async () => {
    if (!resolvedThreadId) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setPendingAttachment({
      type: "image",
      uri: asset.uri,
      name: asset.fileName ?? getUploadFileName(asset.uri, "camera-image.jpg"),
      mimeType: asset.mimeType ?? "image/jpeg",
      previewText: "Shared an image",
    });
    setAttachmentsOpen(false);
  };

  const handlePickFile = async () => {
    if (!resolvedThreadId) return;

    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf", "*/*"],
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? "application/octet-stream";
    setPendingAttachment({
      type: mimeType.startsWith("image/") ? "image" : "document",
      uri: asset.uri,
      name: asset.name,
      mimeType,
      previewText: mimeType.startsWith("image/") ? "Shared an image" : `Shared a file: ${asset.name}`,
    });
    setAttachmentsOpen(false);
  };

  const handlePickLocation = async () => {
    if (!resolvedThreadId) return;

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Please allow location access.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = currentLocation.coords;
    let locationLabel = `Lat ${formatCoordinate(latitude)}, Lng ${formatCoordinate(longitude)}`;

    try {
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const firstAddress = address[0];
      if (firstAddress) {
        const parts = [
          firstAddress.name,
          firstAddress.street,
          firstAddress.city,
          firstAddress.region,
          firstAddress.country,
        ].filter(Boolean);

        if (parts.length > 0) {
          locationLabel = parts.join(", ");
        }
      }
    } catch (_error) {
      console.log("[Conversation] reverse geocode failed");
    }

    const latitudeText = formatCoordinate(latitude);
    const longitudeText = formatCoordinate(longitude);
    const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

    setPendingAttachment({
      type: "location",
      latitude,
      longitude,
      locationLabel,
      locationUrl,
      previewText: `Shared location: ${locationLabel}\nLatitude: ${latitudeText}\nLongitude: ${longitudeText}`,
    });
    setAttachmentsOpen(false);
  };

  const scrollToBottom = (animated = false) => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    });
  };

  const handleScroll = (event: any) => {
    const {
      contentOffset,
      contentSize,
      layoutMeasurement,
    } = event.nativeEvent;

    currentScrollOffsetRef.current = contentOffset?.y ?? 0;
    currentContentHeightRef.current = contentSize?.height ?? currentContentHeightRef.current;

    const distanceFromBottom =
      (contentSize?.height ?? 0) -
      ((contentOffset?.y ?? 0) + (layoutMeasurement?.height ?? 0));
    isNearBottomRef.current = distanceFromBottom <= BOTTOM_STICKY_THRESHOLD;

    if ((contentOffset?.y ?? 0) > TOP_LOAD_THRESHOLD) {
      topLoadArmedRef.current = false;
    }

    if (
      (contentOffset?.y ?? 0) <= TOP_LOAD_THRESHOLD &&
      messagesQuery.hasNextPage &&
      !topLoadArmedRef.current &&
      !messagesQuery.isFetchingNextPage
    ) {
      topLoadArmedRef.current = true;
      preserveScrollRef.current = true;
      previousContentHeightRef.current = currentContentHeightRef.current;
      void messagesQuery.fetchNextPage().then(() => {
        setVisibleMessageCount((current) => current + MESSAGE_BATCH_SIZE);
      });
    }
  };

  const handleContentSizeChange = (_contentWidth: number, contentHeight: number) => {
    currentContentHeightRef.current = contentHeight;

    if (preserveScrollRef.current) {
      const heightDelta = contentHeight - previousContentHeightRef.current;
      const nextOffset = Math.max(0, currentScrollOffsetRef.current + Math.max(heightDelta, 0));

      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({ y: nextOffset, animated: false });
      });

      preserveScrollRef.current = false;
      return;
    }

    if (!initialScrollDoneRef.current && visibleMessages.length > 0) {
      scrollToBottom(false);
      initialScrollDoneRef.current = true;
      return;
    }

    if (isNearBottomRef.current) {
      scrollToBottom(false);
    }
  };

  React.useEffect(() => {
    initialScrollDoneRef.current = false;
    topLoadArmedRef.current = false;
    preserveScrollRef.current = false;
    currentScrollOffsetRef.current = 0;
    currentContentHeightRef.current = 0;
    previousContentHeightRef.current = 0;
    isNearBottomRef.current = true;
    setVisibleMessageCount(MESSAGE_BATCH_SIZE);

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

  React.useEffect(() => {
    if (!resolvedThreadId) return;
    if (readSyncedThreadRef.current === resolvedThreadId) return;
    if ((messagesQuery.data?.length ?? 0) === 0) return;

    readSyncedThreadRef.current = resolvedThreadId;
  
    void sendChatReadViaSocket(resolvedThreadId, token);
  }, [resolvedThreadId, token, messagesQuery.data?.length]);


  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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
          idText={resolvedThreadId ? `ID: ${resolvedThreadId}` : "ID: #225432"}
          isOnline={isParticipantOnline}
          onBack={() => router.back()}
          onPressProfile={() =>
            router.push({
              pathname: "/screens/chat/userprofile",
              params: {
                name: resolvedName,
                avatarUrl: typeof avatarUrl === "string" ? avatarUrl : "",
                id: profileUserId ?? resolvedThreadId ?? "",
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
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            onContentSizeChange={handleContentSizeChange}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 12,
              paddingBottom: attachmentsOpen ? 24 : 12,
            }}
          >
            {visibleMessages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                avatarUrl={resolvedAvatar}
                showSeen={
                  !!lastOwnMessageId &&
                  message.id === lastOwnMessageId &&
                  message.isRead === true
                }
                showSent={
                  !!lastOwnMessageId &&
                  message.id === lastOwnMessageId &&
                  message.sender === "me" &&
                  message.isRead !== true
                }
              />
            ))}
          </ScrollView>

          <View
            style={{
              backgroundColor: "#E9EDF1",
              paddingBottom: Math.max(keyboardHeight, 0),
            }}
          >
            {pendingAttachment ? (
              <View className="mx-4 mb-3 rounded-[16px] border border-[#D8E0E8] bg-[#F8FAFC] p-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-[13px] font-semibold text-[#1D5478]">Preview</Text>
                    {pendingAttachment.type === "image" ? (
                      <Image
                        source={{ uri: pendingAttachment.uri }}
                        className="mt-2 h-36 w-full rounded-[12px]"
                      />
                    ) : null}
                    {pendingAttachment.type === "location" ? (
                      <>
                        <Text className="mt-2 text-[14px] text-[#2B2B2B]">
                          {pendingAttachment.locationLabel}
                        </Text>
                        <Text className="mt-1 text-[12px] text-[#66707B]">
                          {`Latitude: ${formatCoordinate(pendingAttachment.latitude)}`}
                        </Text>
                        <Text className="mt-1 text-[12px] text-[#66707B]">
                          {`Longitude: ${formatCoordinate(pendingAttachment.longitude)}`}
                        </Text>
                      </>
                    ) : null}
                    {pendingAttachment.type === "document" || pendingAttachment.type === "video" ? (
                      <Text className="mt-2 text-[14px] text-[#2B2B2B]">
                        {pendingAttachment.name}
                      </Text>
                    ) : null}
                    {pendingAttachment.type !== "location" ? (
                      <Text className="mt-1 text-[12px] text-[#66707B]">
                        {pendingAttachment.previewText}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => setPendingAttachment(null)}
                    className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-[#E9EDF1]"
                  >
                    <Text className="text-[16px] text-[#475569]">x</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {isOtherTyping ? (
              <View className="px-5 pb-2">
                <Text className="text-[12px] text-[#66707B]">
                  {`${resolvedName} is typing...`}
                </Text>
              </View>
            ) : null}
            <ChatComposer
              value={messageText}
              onChangeText={setMessageText}
              onTypingChange={handleTypingChange}
              onPressSend={handleSend}
              attachmentsOpen={attachmentsOpen}
              onToggleAttachments={() => setAttachmentsOpen((prev) => !prev)}
              disabled={!messageText.trim() && !pendingAttachment}
              isSending={isSending}
            />

            {attachmentsOpen ? (
              <ChatAttachmentTray
              onPressPhoto={handlePickFromGallery}
              onPressCamera={handleOpenCamera}
              onPressFile={handlePickFile}
              onPressLocation={handlePickLocation}
            />
          ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
