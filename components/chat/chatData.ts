export type ChatFilter = "chat" | "support";

export type ChatListItemModel = {
  id: string;
  profileUserId?: string;
  profileRole?: string | null;
  name: string;
  preview: string;
  time: string;
  unreadCount: number;
  avatarUrl: string;
  isOnline?: boolean;
  type: ChatFilter;
  threadId?: string;
  isBlocked?: boolean;
  blockedByMe?: boolean;
  blockedByOther?: boolean;
};

export type MessageModel = {
  id: string;
  text: string;
  time: string;
  rawTime?: string;
  sender: "me" | "other";
  isRead?: boolean;
  kind?: "text" | "image" | "location";
  imageUri?: string;
  mediaUrl?: string;
  mediaType?: "image" | "location" | null;
  senderId?: string;
  senderName?: string;
  senderAvatarUrl?: string;
  blockedByMe?: boolean;
  blockedByOther?: boolean;
};
