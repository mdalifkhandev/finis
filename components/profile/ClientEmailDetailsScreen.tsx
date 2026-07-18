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
  const messages = conversation?.messages ?? [];
  const firstMessage = messages[0];
  const emailInfo = useMemo(() => {
    return {
      name: conversation?.clientName || conversation?.clientEmail || "",
      email: conversation?.clientEmail || "",
      date: formatDate(conversation?.createdAt),
      time: formatTime(conversation?.createdAt),
      subject: firstMessage?.subject || "No Subject",
    };
  }, [conversation, firstMessage]);

  const handleAccept = () => {
    statusMutation.mutate("active");
  };

  const handleClose = () => {
    statusMutation.mutate("closed");
  };

  const parseBody = (text?: string | null) =>
    (text || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-[#F7F8FA]">
      <ProfileHeaderBar title="Details" onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <View className="mb-4 rounded-[18px] border border-[#E8EDF2] bg-white p-4 shadow-sm">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[18px] font-semibold text-[#1F2937]">
                {emailInfo.name}
              </Text>
              <Text className="mt-1 text-[13px] text-[#64748B]">{emailInfo.email}</Text>
            </View>

            <View className="items-end">
              <Text className="text-[13px] text-[#475467]">{emailInfo.date}</Text>
              <Text className="mt-1 text-[13px] font-medium text-[#1F2937]">
                {emailInfo.time}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row items-center justify-between border-t border-[#EEF2F6] pt-4">
            <Text className="text-[16px] font-semibold text-[#1F2937]">
              {emailInfo.subject}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsMenuVisible(true)}
              className="h-8 w-8 items-center justify-center"
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#667085" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 gap-4">
          {messages.map((message) => {
            const isSent = message.direction === "sent";
            const bodyLines = parseBody(message.bodyText);
            const attachments = message.attachments ?? [];

            return (
              <View
                key={message.id}
                className={`flex-row ${isSent ? "justify-end" : "justify-start"}`}
              >
                <View
                  className={`max-w-[85%] rounded-[16px] px-4 py-3 ${
                    isSent
                      ? "rounded-tr-sm bg-[#1D5478]"
                      : "rounded-tl-sm border border-[#E8EDF2] bg-white shadow-sm"
                  }`}
                >
                  <View className="gap-2">
                    {bodyLines.map((line, idx) => (
                      <Text
                        key={idx}
                        className={`text-[15px] leading-[22px] ${
                          isSent ? "text-white" : "text-[#4B5563]"
                        }`}
                      >
                        {line}
                      </Text>
                    ))}
                  </View>

                  {attachments.length > 0 && (
                    <View className="mt-3 gap-2 border-t border-[#ffffff20] pt-3">
                      {attachments.map((att, attIdx) => (
                        <TouchableOpacity
                          key={attIdx}
                          activeOpacity={0.85}
                          onPress={() => {
                            if (!att.url) return;
                            setCurrentPreviewDocument({
                              id: `${message.id}-${attIdx}`,
                              name: att.name || "Attachment",
                              uri: att.url,
                              mimeType: "application/pdf",
                            });
                            router.push("/screens/company/documentpreview");
                          }}
                          className={`flex-row items-center rounded-[10px] p-2.5 ${
                            isSent ? "bg-[#144261]" : "bg-[#F7F8FA] border border-[#E8EDF2]"
                          }`}
                        >
                          <Ionicons
                            name="document-attach-outline"
                            size={18}
                            color={isSent ? "#93C5FD" : "#64748B"}
                          />
                          <View className="ml-2 flex-1">
                            <Text
                              className={`text-[13px] font-medium ${
                                isSent ? "text-white" : "text-[#475467]"
                              }`}
                              numberOfLines={1}
                            >
                              {att.name || "Attachment"}
                            </Text>
                            {att.size && (
                              <Text
                                className={`text-[11px] ${
                                  isSent ? "text-[#93C5FD]" : "text-[#98A2B3]"
                                }`}
                              >
                                {att.size}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text
                    className={`mt-2 text-right text-[11px] ${
                      isSent ? "text-[#93C5FD]" : "text-[#98A2B3]"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </Text>
                </View>
              </View>
            );
          })}
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
