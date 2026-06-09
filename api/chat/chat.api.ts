import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type { ApiResponse } from "@/types/auth.types";

export type ChatThreadType = "direct" | "group" | "project";

export type ChatParticipant = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role?: string | null;
  status?: string | null;
};

export type ChatThreadLastMessage = {
  content: string | null;
  sentAt: string;
  senderId: string;
  isRead: boolean;
};

export type ChatThread = {
  id: string;
  type: ChatThreadType;
  name: string;
  projectId: string | null;
  isActive: boolean;
  lastMessage: ChatThreadLastMessage | null;
  unreadCount: number;
  participants: ChatParticipant[];
};

export type ChatThreadListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: ChatThread[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type ChatContact = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  status: string;
};

export type ChatMessageSender = {
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
  };
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: "image" | "video" | "document" | "audio" | null;
  isRead: boolean;
  sentAt: string;
  sender: ChatMessageSender;
};

export type ChatMessageListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: ChatMessage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SendChatMessagePayload = {
  threadId: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "document" | "audio";
};

type ThreadQueryParams = {
  type?: ChatThreadType;
  search?: string;
  page?: number;
  limit?: number;
};

type MessageQueryParams = {
  page?: number;
  limit?: number;
};

function resolveMediaUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("file://") ||
    path.startsWith("content://")
  ) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function resolveChatAvatar(path: string | null | undefined) {
  return resolveMediaUrl(path);
}

export function formatChatPreview(message: ChatThreadLastMessage | null) {
  if (!message) {
    return "No messages yet";
  }

  if (message.content?.trim()) {
    return message.content.trim();
  }

  return "Attachment";
}

export function formatChatTime(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function getChatThreads(params: ThreadQueryParams = {}) {
  const { data } = await api.get<ChatThreadListResponse>("/messages/threads", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 50,
      ...(params.type ? { type: params.type } : {}),
      ...(params.search ? { search: params.search } : {}),
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to load chats");
  }

  return data;
}

export async function getChatContacts(search?: string) {
  const { data } = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: ChatContact[];
  }>("/messages/contacts", {
    params: search ? { search } : undefined,
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to load contacts");
  }

  return data.data.map((contact) => ({
    ...contact,
    avatarUrl: resolveMediaUrl(contact.avatarUrl),
  }));
}

export async function getChatMessages(
  threadId: string,
  params: MessageQueryParams = {},
) {
  const { data } = await api.get<ChatMessageListResponse>(
    `/messages/threads/${threadId}/messages`,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load messages");
  }

  return data;
}

export async function createDirectThread(targetUserId: string) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: ChatThread;
  }>("/messages/threads/direct", { targetUserId });

  if (!data.success) {
    throw new Error(data.message || "Failed to open chat");
  }

  return data.data;
}

export async function sendChatMessage(payload: SendChatMessagePayload) {
  const { data } = await api.post<ApiResponse<ChatMessage>>(
    "/messages/send",
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to send message");
  }

  return data.data;
}
