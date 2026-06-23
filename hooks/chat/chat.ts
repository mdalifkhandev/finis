import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  createDirectThread,
  formatChatPreview,
  formatChatTime,
  getChatContacts,
  getChatMessages,
  getChatThreads,
  getOrCreateSupportThread,
  getSupportThread,
  resolveChatAvatar,
  sendChatMessage,
  type ChatContact,
  type ChatMessage,
  type ChatThread,
  type SendChatMessagePayload,
} from "@/api/chat/chat.api";
import { useAuthStore } from "@/store/auth.store";
import { type ChatListItemModel, type MessageModel } from "@/components/chat/chatData";
import { useChatSocket, useSupportSocket } from "@/lib/chat-socket";

function toAbsoluteAvatar(path: string | null | undefined) {
  return resolveChatAvatar(path) ?? "";
}

function normalizeThreads(
  threads: ChatThread[],
  currentUserId: string,
  filter: "chat" | "support",
): ChatListItemModel[] {
  return threads
    .filter((thread) =>
      filter === "chat"
        ? thread.type === "direct" || thread.type === "project"
        : thread.type === "support",
    )
    .sort((left, right) => {
      const leftTime = left.lastMessage?.sentAt
        ? new Date(left.lastMessage.sentAt).getTime()
        : 0;
      const rightTime = right.lastMessage?.sentAt
        ? new Date(right.lastMessage.sentAt).getTime()
        : 0;
      return rightTime - leftTime;
    })
    .map((thread) => {
      const otherParticipant =
        thread.participants.find((participant) => participant.id !== currentUserId) ??
        thread.participants[0];

      return {
        id: thread.id,
        threadId: thread.id,
        profileUserId: otherParticipant?.id,
        name: thread.name || otherParticipant?.fullName || "Conversation",
        preview: formatChatPreview(thread.lastMessage),
        time: formatChatTime(thread.lastMessage?.sentAt),
        unreadCount: thread.unreadCount,
        avatarUrl: toAbsoluteAvatar(otherParticipant?.avatarUrl),
        isOnline: otherParticipant?.isOnline ?? false,
        type: filter,
      };
    });
}

function normalizeMessages(messages: ChatMessage[], currentUserId: string): MessageModel[] {
  return messages.map((message) => {
    const isMe = message.senderId === currentUserId;
    const senderProfile = "user" in message.sender ? message.sender.user : message.sender;
    const kind =
      message.mediaType === "image"
        ? "image"
        : message.content?.toLowerCase().startsWith("my location:")
          ? "location"
          : message.mediaUrl && !message.content
          ? "location"
          : "text";

    return {
      id: message.id,
      text: message.content ?? "",
      time: formatChatTime(message.sentAt),
      sender: isMe ? "me" : "other",
      isRead: message.isRead,
      senderId: message.senderId,
      senderName: senderProfile?.fullName ?? "Unknown",
      senderAvatarUrl: toAbsoluteAvatar(senderProfile?.avatarUrl),
      kind,
      imageUri: resolveChatAvatar(message.mediaUrl) ?? undefined,
      mediaType: message.mediaType ?? undefined,
      mediaUrl: resolveChatAvatar(message.mediaUrl) ?? undefined,
    };
  });
}

export function useChatThreadsQuery(filter: "chat" | "support", search: string) {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const query = useQuery({
    queryKey: ["chat", "threads", token, currentUserId, filter, search],
    queryFn: async () => {
      const response = await getChatThreads({
        search: search.trim() || undefined,
        limit: 100,
      });

      if (!currentUserId) {
        return [] as ChatListItemModel[];
      }

      return normalizeThreads(response.data, currentUserId, filter);
    },
    enabled: !!token && !!currentUserId,
    staleTime: 15 * 1000,
    refetchInterval: 10 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load chats",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useSupportThreadQuery() {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["chat", "support-thread", token, currentUserId],
    queryFn: async () => {
      const thread = await getSupportThread();
      if (!thread || !currentUserId) {
        return [];
      }

      return normalizeThreads(
        [{ ...thread, type: "support" }],
        currentUserId,
        "support",
      );
    },
    enabled: !!token && !!currentUserId,
    staleTime: 15 * 1000,
  });
}

export function useChatContactsQuery(search: string) {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const query = useQuery({
    queryKey: ["chat", "contacts", token, currentUserId, search],
    queryFn: async () => {
      const response = await getChatContacts(search.trim() || undefined);
      return response.map((contact: ChatContact) => ({
        id: contact.id,
        name: contact.fullName,
        role: contact.role,
        status: contact.status,
        avatarUrl: toAbsoluteAvatar(contact.avatarUrl),
      }));
    },
    enabled: !!token && !!currentUserId,
    staleTime: 15 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error ? query.error.message : "Failed to load contacts",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useChatMessagesQuery(threadId?: string) {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const messagePageSize = 20;
  const [page, setPage] = useState(1);
  const [pagesByNumber, setPagesByNumber] = useState<Record<number, MessageModel[]>>({});
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);

  useEffect(() => {
    setPage(1);
    setPagesByNumber({});
    setMeta(null);
  }, [threadId, currentUserId]);

  const query = useQuery({
    queryKey: ["chat", "messages", threadId, page],
    queryFn: async () => {
      if (!threadId || !currentUserId) {
        return {
          messages: [] as MessageModel[],
          meta: { page: 1, limit: messagePageSize, total: 0, totalPages: 1 },
        };
      }

      const response = await getChatMessages(threadId, {
        page,
        limit: messagePageSize,
      });
      return {
        messages: normalizeMessages(response.data, currentUserId),
        meta: response.meta,
      };
    },
    enabled: !!token && !!threadId && !!currentUserId,
    staleTime: 5 * 1000,
    refetchInterval: 5000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load conversation",
      );
    }
  }, [query.error, query.isError]);

  useEffect(() => {
    if (!query.data) return;

    setMeta(query.data.meta);
    setPagesByNumber((current) => ({
      ...current,
      [page]: query.data.messages,
    }));
  }, [page, query.data]);

  const messages = useMemo(
    () =>
      Object.keys(pagesByNumber)
        .map(Number)
        .sort((left, right) => right - left)
        .flatMap((pageNumber) => pagesByNumber[pageNumber] ?? []),
    [pagesByNumber],
  );

  const hasNextPage = !!meta && page < meta.totalPages;
  const isFetchingNextPage = query.isFetching && page > 1;
  const fetchNextPage = async () => {
    if (!hasNextPage || query.isFetching) {
      return;
    }

    setPage((current) => current + 1);
  };

  return {
    ...query,
    data: messages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

export function useCreateDirectThreadMutation() {
  const mutation = useMutation({
    mutationFn: createDirectThread,
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error ? mutation.error.message : "Failed to open chat",
      );
    }
  }, [mutation.error, mutation.isError]);

  return mutation;
}

export function useCreateSupportThreadMutation() {
  const mutation = useMutation({
    mutationFn: getOrCreateSupportThread,
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error
          ? mutation.error.message
          : "Failed to open support thread",
      );
    }
  }, [mutation.error, mutation.isError]);

  return mutation;
}

export function useSendChatMessageMutation(threadId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<SendChatMessagePayload, "threadId">) => {
      if (!threadId) {
        throw new Error("Thread ID is required");
      }

      return sendChatMessage({
        threadId,
        ...payload,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chat", "messages", threadId] });
      await queryClient.invalidateQueries({ queryKey: ["chat", "threads"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    },
  });
}

export function useChatSocketConnection(threadId?: string) {
  useChatSocket(threadId);
}

export function useSupportSocketConnection() {
  useSupportSocket();
}
