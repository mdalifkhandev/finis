export type ChatFilter = "chat" | "support";

export type ChatListItemModel = {
  id: string;
  threadId?: string;
  name: string;
  preview: string;
  time: string;
  unreadCount: number;
  avatarUrl: string;
  type: ChatFilter;
};

export type MessageModel = {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
  kind?: "text" | "image" | "location";
  imageUri?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "document" | "audio";
  senderId?: string;
  senderName?: string;
  senderAvatarUrl?: string;
};

export const chatListMock: ChatListItemModel[] = [
  {
    id: "chat-1",
    name: "Stephen Yustiono",
    preview: "Nice. I don't know why I ...",
    time: "9:30 am",
    unreadCount: 1,
    avatarUrl:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop",
    type: "chat",
  },
  {
    id: "chat-2",
    name: "Stephen Yustiono",
    preview: "Nice. I don't know why I ...",
    time: "9:30 am",
    unreadCount: 1,
    avatarUrl:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop",
    type: "chat",
  },
  {
    id: "chat-3",
    name: "Stephen Yustiono",
    preview: "Nice. I don't know why I ...",
    time: "9:30 am",
    unreadCount: 0,
    avatarUrl:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop",
    type: "chat",
  },
  {
    id: "chat-4",
    name: "Stephen Yustiono",
    preview: "Nice. I don't know why I ...",
    time: "9:30 am",
    unreadCount: 0,
    avatarUrl:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop",
    type: "support",
  },
  {
    id: "chat-5",
    name: "Stephen Yustiono",
    preview: "Nice. I don't know why I ...",
    time: "9:30 am",
    unreadCount: 0,
    avatarUrl:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=120&auto=format&fit=crop",
    type: "support",
  },
];

export const conversationInitialMessages: MessageModel[] = [
  {
    id: "m-1",
    text: "Hey! How was the new design project coming along?",
    time: "10:30 AM",
    sender: "me",
    kind: "text",
  },
  {
    id: "m-2",
    text: "Hello! Welcome to TechHub Electronics. How can I help you today?",
    time: "10:30 AM",
    sender: "other",
    kind: "text",
  },
  {
    id: "m-3",
    text: "Hey! How was the new design project coming along?",
    time: "10:30 AM",
    sender: "other",
    kind: "text",
  },
  {
    id: "m-4",
    text: "Hey! How was the new design project coming along?",
    time: "10:30 AM",
    sender: "me",
    kind: "text",
  },
  {
    id: "m-5",
    text: "Hey! How was the new design project coming along?",
    time: "10:30 AM",
    sender: "other",
    kind: "text",
  },
  {
    id: "m-6",
    text: "Hey! How was the new design project coming along?",
    time: "10:30 AM",
    sender: "me",
    kind: "text",
  },
];
