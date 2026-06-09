import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";
import {
  createDirectThread,
  getChatContacts,
  getChatMessages,
  getChatThreads,
  sendChatMessage,
} from "@/api/chat/chat.api";
import { useAuthStore } from "@/store/auth.store";

export function useChatContactsQuery(search = "") {
  const token = useAuthStore((state) => state.token);

  const query = useQuery({
    queryKey: ["chat", "contacts", search, token],
    queryFn: () => getChatContacts(search),
    enabled: !!token,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(query.error instanceof Error ? query.error.message : "Failed to load contacts");
    }
  }, [query.error, query.isError]);

  return query;
}

export function useChatThreadsQuery(search = "") {
  const token = useAuthStore((state) => state.token);

  const query = useQuery({
    queryKey: ["chat", "threads", search, token],
    queryFn: () => getChatThreads(search),
    enabled: !!token,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(query.error instanceof Error ? query.error.message : "Failed to load chats");
    }
  }, [query.error, query.isError]);

  return query;
}

export function useChatMessagesQuery(threadId?: string) {
  const token = useAuthStore((state) => state.token);

  const query = useQuery({
    queryKey: ["chat", "messages", threadId, token],
    queryFn: () => getChatMessages(threadId ?? ""),
    enabled: !!token && !!threadId,
    staleTime: 0,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(query.error instanceof Error ? query.error.message : "Failed to load messages");
    }
  }, [query.error, query.isError]);

  return query;
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

export function useSendChatMessageMutation() {
  const mutation = useMutation({
    mutationFn: ({ threadId, content }: { threadId: string; content: string }) =>
      sendChatMessage(threadId, content),
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error ? mutation.error.message : "Failed to send message",
      );
    }
  }, [mutation.error, mutation.isError]);

  return mutation;
}