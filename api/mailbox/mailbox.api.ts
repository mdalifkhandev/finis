import { api } from "@/lib/api/client";

export type MailboxUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

export type MailboxListItem = {
  id: string;
  clientEmail: string;
  clientName: string;
  proxyAddress: string;
  status: "active" | "closed";
  isStarred: boolean;
  createdAt: string;
  sender?: MailboxUser | null;
  unreadCount: number;
  latestMessage: {
    id: string;
    direction: string;
    subject: string;
    preview: string;
    createdAt: string;
    isRead: boolean;
    sender?: MailboxUser | null;
  } | null;
};

export type MailboxListResponse = {
  data: MailboxListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type MailboxMessageAttachment = {
  name: string;
  url: string;
  size?: string;
};

export type MailboxMessage = {
  id: string;
  direction: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  bodyText?: string | null;
  bodyHtml?: string | null;
  attachments?: MailboxMessageAttachment[];
  isRead: boolean;
  createdAt: string;
  sender?: MailboxUser | null;
};

export type MailboxConversation = {
  id: string;
  clientEmail: string;
  clientName: string;
  proxyAddress: string;
  status: "active" | "closed";
  isStarred: boolean;
  createdAt: string;
  sender?: MailboxUser | null;
  messages: MailboxMessage[];
};

export async function getMailbox(params?: {
  status?: "active" | "closed";
  starred?: boolean;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get<MailboxListResponse>("/mailbox", {
    params: {
      status: params?.status,
      starred: typeof params?.starred === "boolean" ? String(params.starred) : undefined,
      page: params?.page,
      limit: params?.limit,
    },
  });

  return data;
}

export async function getMailboxConversation(conversationId: string) {
  const { data } = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: MailboxConversation;
  }>(`/mailbox/${conversationId}`);
  return data.data;
}

export async function updateMailboxStatus(
  conversationId: string,
  status: "active" | "closed",
) {
  const { data } = await api.patch(`/mailbox/${conversationId}/status`, { status });
  return data;
}

export async function toggleMailboxStar(conversationId: string) {
  const { data } = await api.patch(`/mailbox/${conversationId}/star`);
  return data;
}
