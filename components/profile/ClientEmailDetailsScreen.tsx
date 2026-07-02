import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import {
  getMailboxConversation,
  updateMailboxStatus,
} from "@/api/mailbox/mailbox.api";
import { setCurrentPreviewDocument } from "@/components/company/taskdetails/documentPreviewStore";
import ProfileHeaderBar from "./ProfileHeaderBar";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function ClientEmailDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const resolvedId = Array.isArray(id) ? id[0] : id;
  const queryClient = useQueryClient();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const conversationQuery = useQuery({
    queryKey: ["mailbox", "conversation", resolvedId],
    queryFn: () => getMailboxConversation(resolvedId as string),
    enabled: Boolean(resolvedId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: "active" | "closed") =>
      updateMailboxStatus(resolvedId as string, status),
    onSuccess: async (_data, status) => {
      setIsMenuVisible(false);
      await queryClient.invalidateQueries({ queryKey: ["mailbox"] });
      await queryClient.invalidateQueries({ queryKey: ["mailbox", "conversation", resolvedId] });
      toast.success(
        status === "active" ? "Mail accepted successfully." : "Mail closed successfully.",
      );
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to update mail status.");
    },
  });

  const conversation = conversationQuery.data;
  const latestMessage = useMemo(
    () => conversation?.messages?.[conversation.messages.length - 1],
    [conversation],
  );
  const previewMessage = useMemo(
    () =>
      [...(conversation?.messages ?? [])]
        .reverse()
        .find((message) => (message.attachments?.length ?? 0) > 0) ?? null,
    [conversation],
  );
  const email = useMemo(() => {
    const bodyLines = (latestMessage?.bodyText || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const firstAttachment = previewMessage?.attachments?.[0];

    return {
      id: conversation?.id || resolvedId || "",
      name: conversation?.clientName || conversation?.clientEmail || "",
      email: conversation?.clientEmail || "",
      date: formatDate(latestMessage?.createdAt || conversation?.createdAt),
      time: formatTime(latestMessage?.createdAt || conversation?.createdAt),
      subject: latestMessage?.subject || "",
      body: bodyLines,
      attachmentName: firstAttachment?.name || "No attachment",
      attachmentSize: firstAttachment?.size || "",
      attachmentCount: `${previewMessage?.attachments?.length || 0} Files`,
      attachmentUrl: firstAttachment?.url || "",
      starred: conversation?.isStarred || false,
    };
  }, [conversation, latestMessage, previewMessage, resolvedId]);

  const handleAccept = () => {
    statusMutation.mutate("active");
  };

  const handleClose = () => {
    statusMutation.mutate("closed");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-[#F7F8FA]">
      <ProfileHeaderBar title="Details" onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <View className="rounded-[18px] border border-[#E8EDF2] bg-white p-4 shadow-sm">
          <View>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[18px] font-semibold text-[#1F2937]">
                  {email.name}
                </Text>
                <Text className="mt-1 text-[13px] text-[#64748B]">{email.email}</Text>
              </View>

              <View className="items-end">
                <Text className="text-[13px] text-[#475467]">{email.date}</Text>
                <Text className="mt-1 text-[13px] font-medium text-[#1F2937]">
                  {email.time}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-5 border-t border-[#EEF2F6] pt-5">
            <Text className="text-[18px] font-semibold leading-[28px] text-[#1F2937]">
              {email.subject}
            </Text>

            <View className="mt-4 gap-4">
              {email.body.map((line, index) => (
                <Text key={`${email.id}-${index}`} className="text-[15px] leading-[26px] text-[#4B5563]">
                  {line}
                </Text>
              ))}
            </View>
          </View>

        </View>

        <View className="mt-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[18px] font-semibold text-[#1F2937]">Attachments</Text>
            <View className="rounded-full bg-[#E8F1FF] px-3 py-1">
              <Text className="text-[12px] font-medium text-[#2F6FED]">{email.attachmentCount}</Text>
            </View>
          </View>

          <View className="rounded-[16px] border border-[#E8EDF2] bg-white p-4">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-[12px] bg-[#FDECEC]">
                <Ionicons name="document-attach-outline" size={24} color="#D92D20" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[15px] font-medium text-[#1F2937]">{email.attachmentName}</Text>
                <Text className="mt-1 text-[13px] text-[#667085]">{email.attachmentSize}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsMenuVisible(true)}
                className="h-9 w-9 items-center justify-center"
              >
                <Ionicons name="ellipsis-vertical" size={22} color="#667085" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!email.attachmentUrl}
              onPress={() => {
                if (!email.attachmentUrl) return;
                setCurrentPreviewDocument({
                  id: email.id,
                  name: email.attachmentName,
                  uri: email.attachmentUrl,
                  mimeType: "application/pdf",
                });
                router.push("/screens/company/documentpreview");
              }}
              className="mt-4 h-[46px] items-center justify-center rounded-[12px] bg-[#1D5478]"
            >
              <Text className="text-[15px] font-medium text-white">View PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isMenuVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/35"
          onPress={() => setIsMenuVisible(false)}
        >
          <Pressable
            className="rounded-t-[24px] bg-white px-5 pb-8 pt-4"
            onPress={() => {}}
          >
            <View className="items-center">
              <View className="h-1.5 w-16 rounded-full bg-[#D7DEE7]" />
            </View>

            <Text className="mt-5 text-[18px] font-semibold text-[#1F2937]">
              Mail Actions
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleAccept}
              className="mt-5 h-[52px] items-center justify-center rounded-[12px] bg-[#1D5478]"
            >
              <Text className="text-[16px] font-medium text-white">Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleClose}
              className="mt-3 h-[52px] items-center justify-center rounded-[12px] border border-[#F1D2D7] bg-white"
            >
              <Text className="text-[16px] font-medium text-[#DC2626]">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
