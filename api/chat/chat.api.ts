import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";

function resolveMediaUrl(path: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export type ChatContact = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  status: string;
};

export type ChatThreadParticipant = {
  id: string;
  userId: string;
  threadId: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role?: string;
    status?: string;
  };
};

export type ChatThread = {
  id: string;
  type: string;
  title?: string | null;
  lastMessageAt?: string | null;
  lastMessageText?: string | null;
  unreadCount?: number;
  participants?: ChatThreadParticipant[];
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
};

export async function getChatContacts(search = "") {
  const { data } = await api.get<{ success: boolean; message: string; data: ChatContact[] }>(
    "/messages/contacts",
    { params: search ? { search } : undefined },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load contacts");
  }

  return data.data.map((contact) => ({
    ...contact,
    avatarUrl: resolveMediaUrl(contact.avatarUrl),
  }));
}

export async function getChatThreads(search = "") {
  const { data } = await api.get<{ success: boolean; message: string; data: ChatThread[] }>(
    "/messages/threads/chat",
    { params: search ? { search } : undefined },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load chats");
  }

  return data.data;
}

export async function createDirectThread(targetUserId: string) {
  const { data } = await api.post<{ success: boolean; message: string; data: ChatThread }>(
    "/messages/threads/direct",
    { targetUserId },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to open chat");
  }

  return data.data;
}

export async function getChatMessages(threadId: string) {
  const { data } = await api.get<{ success: boolean; message: string; data: ChatMessage[] }>(
    `/messages/threads/${threadId}/messages`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load messages");
  }

  return data.data;
}

export async function sendChatMessage(threadId: string, content: string) {
  const { data } = await api.post<{ success: boolean; message: string; data: ChatMessage }>(
    "/messages/send",
    { threadId, content },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to send message");
  }

  return data.data;
}
