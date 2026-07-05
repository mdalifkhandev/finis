import { API_BASE_URL } from "@/lib/config";
import { sendChatMessage } from "@/api/chat/chat.api";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export const CHAT_SOCKET_EVENTS = {
  join: "thread:join",
  leave: "thread:leave",
  send: "message:send",
  newMessage: "message:new",
  updatedThread: "thread:updated",
  read: "message:read",
  typing: "message:typing",
  userOnline: "user:online",
  userOffline: "user:offline",
  userStatus: "user:status",
} as const;

export const SUPPORT_SOCKET_EVENTS = {
  newThread: "support:thread:new",
  joinedThread: "support:thread:joined",
} as const;

type ServerMessage = {
  threadId: string;
  id?: string;
  content?: string | null;
  mediaUrl?: string | null;
  mediaType?: "image" | "location" | null;
  isRead?: boolean;
  sentAt?: string;
  senderId?: string;
  sender?: {
    id?: string;
    fullName?: string;
    avatarUrl?: string | null;
    role?: string;
    user?: {
      id?: string;
      fullName?: string;
      avatarUrl?: string | null;
      role?: string;
    };
  };
};

type ServerThreadUpdate = {
  threadId: string;
  lastMessage?: unknown;
};

let socket: Socket | null = null;
let activeSubscribers = 0;
let activeToken: string | null = null;
let chatListenersBound = false;
let supportListenersBound = false;
let chatListenersClient: Socket | null = null;
let supportListenersClient: Socket | null = null;
let chatHandlers:
  | {
      connect: () => void;
      messageNew: (payload: ServerMessage) => void;
      threadUpdated: (payload: ServerThreadUpdate) => void;
      messageRead: (payload: ServerMessage) => void;
      userOnline: (payload: { userId?: string }) => void;
      userOffline: (payload: { userId?: string }) => void;
    }
  | null = null;
let supportHandlers:
  | {
      supportThreadNew: (payload: { threadId?: string }) => void;
    }
  | null = null;

function ensureChatListeners(
  client: Socket,
  queryClient: ReturnType<typeof useQueryClient>,
  currentUserId: string,
  threadId?: string,
) {
  if (chatListenersBound && chatListenersClient === client) {
    return;
  }

  if (chatListenersBound && chatListenersClient && chatHandlers) {
    chatListenersClient.off("connect", chatHandlers.connect);
    chatListenersClient.off(CHAT_SOCKET_EVENTS.newMessage, chatHandlers.messageNew);
    chatListenersClient.off(CHAT_SOCKET_EVENTS.updatedThread, chatHandlers.threadUpdated);
    chatListenersClient.off(CHAT_SOCKET_EVENTS.read, chatHandlers.messageRead);
    chatListenersClient.off(CHAT_SOCKET_EVENTS.userOnline, chatHandlers.userOnline);
    chatListenersClient.off(CHAT_SOCKET_EVENTS.userOffline, chatHandlers.userOffline);
  }

  const refreshThreads = () => {
    void queryClient.invalidateQueries({ queryKey: ["chat", "threads"] });
    void queryClient.invalidateQueries({ queryKey: ["chat", "support-thread"] });
  };

  const refreshMessages = (messageThreadId?: string) => {
    if (!messageThreadId) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: ["chat", "messages", messageThreadId],
    });
  };

  const appendIncomingMessage = (payload: ServerMessage) => {
    const senderProfile = payload.sender?.user ?? payload.sender;
    const nextMessage = {
      id: payload.id ?? `${payload.threadId}-${payload.sentAt ?? Date.now()}`,
      text: payload.content ?? "",
      time: payload.sentAt ?? new Date().toISOString(),
      rawTime: payload.sentAt ?? new Date().toISOString(),
      sender: payload.senderId && payload.senderId === currentUserId ? "me" : "other",
      kind:
        payload.mediaType === "image"
          ? "image"
          : payload.content?.toLowerCase().startsWith("my location:")
            ? "location"
            : payload.mediaUrl
              ? "location"
              : "text",
      imageUri: payload.mediaUrl ?? undefined,
      mediaUrl: payload.mediaUrl ?? undefined,
      mediaType: payload.mediaType ?? undefined,
      senderId: payload.senderId,
      senderName: senderProfile?.fullName,
      senderAvatarUrl: senderProfile?.avatarUrl ?? undefined,
    };

    queryClient.setQueryData<any[]>(["chat", "messages", payload.threadId], (current) => {
      const existing = Array.isArray(current) ? current : [];
      if (existing.some((message) => message.id === nextMessage.id)) {
        return existing;
      }
      return [...existing, nextMessage];
    });
  };

  const handleConnect = () => {
    console.log("[ChatSocket] connected", { threadId });
    if (threadId) {
      console.log("[ChatSocket] emit join", { threadId });
      client.emit(CHAT_SOCKET_EVENTS.join, { threadId });
      console.log("[ChatSocket] join thread", { threadId });
    }
  };

  const handleMessageNew = (payload: ServerMessage) => {
    appendIncomingMessage(payload);
    refreshMessages(payload.threadId);
    refreshThreads();
  };

  const handleThreadUpdated = (payload: ServerThreadUpdate) => {
    refreshThreads();
  };

  const handleMessageRead = (payload: ServerMessage) => {
    console.log("[ChatSocket] message:read received", payload);
    refreshMessages(payload.threadId);
    refreshThreads();
  };

  const handleUserOnline = (_payload: { userId?: string }) => {
    refreshThreads();
  };

  const handleUserOffline = (_payload: { userId?: string }) => {
    refreshThreads();
  };

  chatHandlers = {
    connect: handleConnect,
    messageNew: handleMessageNew,
    threadUpdated: handleThreadUpdated,
    messageRead: handleMessageRead,
    userOnline: handleUserOnline,
    userOffline: handleUserOffline,
  };

  client.on("connect", handleConnect);
  client.on(CHAT_SOCKET_EVENTS.newMessage, handleMessageNew);
  client.on(CHAT_SOCKET_EVENTS.updatedThread, handleThreadUpdated);
  client.on(CHAT_SOCKET_EVENTS.read, handleMessageRead);
  client.on(CHAT_SOCKET_EVENTS.userOnline, handleUserOnline);
  client.on(CHAT_SOCKET_EVENTS.userOffline, handleUserOffline);

  if (client.connected && threadId) {
    client.emit(CHAT_SOCKET_EVENTS.join, { threadId });
  }

  chatListenersBound = true;
  chatListenersClient = client;
}

function ensureSupportListeners(client: Socket, queryClient: ReturnType<typeof useQueryClient>) {
  if (supportListenersBound && supportListenersClient === client) {
    return;
  }

  if (supportListenersBound && supportListenersClient && supportHandlers) {
    supportListenersClient.off(SUPPORT_SOCKET_EVENTS.newThread, supportHandlers.supportThreadNew);
  }

  const handleSupportThreadNew = (payload: { threadId?: string }) => {
    console.log("[ChatSocket] support:thread:new received", payload);
    void queryClient.invalidateQueries({ queryKey: ["chat", "support-thread"] });
    void queryClient.invalidateQueries({ queryKey: ["chat", "threads"] });
    if (payload.threadId) {
      void queryClient.invalidateQueries({
        queryKey: ["chat", "messages", payload.threadId],
      });
    }
  };

  supportHandlers = { supportThreadNew: handleSupportThreadNew };
  client.on(SUPPORT_SOCKET_EVENTS.newThread, handleSupportThreadNew);
  supportListenersBound = true;
  supportListenersClient = client;
}

function getChatSocket(token: string) {
  if (socket && activeToken === token) {
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  activeToken = token;
  socket = io(`${API_BASE_URL}/chat`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: { token },
  });

  return socket;
}

function attachSocket(token: string) {
  activeSubscribers += 1;
  const instance = getChatSocket(token);
  if (!instance.connected) {
    instance.connect();
  }
  return instance;
}

function detachSocket() {
  activeSubscribers = Math.max(0, activeSubscribers - 1);

  if (activeSubscribers === 0 && socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    activeToken = null;
    chatListenersBound = false;
    supportListenersBound = false;
    chatListenersClient = null;
    supportListenersClient = null;
    chatHandlers = null;
    supportHandlers = null;
  }
}

export function useChatSocket(threadId?: string) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!token || !currentUserId) {
      return;
    }

    const client = attachSocket(token);
    if (chatListenersBound && chatListenersClient === client) {
      if (threadId) {
        client.emit(CHAT_SOCKET_EVENTS.join, { threadId });
      }

      return () => {
        if (threadId) {
          client.emit(CHAT_SOCKET_EVENTS.leave, { threadId });
        }

        detachSocket();
      };
    }

    const refreshThreads = () => {
      void queryClient.invalidateQueries({ queryKey: ["chat", "threads"] });
      void queryClient.invalidateQueries({ queryKey: ["chat", "support-thread"] });
    };

    const refreshMessages = (messageThreadId?: string) => {
      if (!messageThreadId) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: ["chat", "messages", messageThreadId],
      });
    };

    const appendIncomingMessage = (payload: ServerMessage) => {
      const senderProfile = payload.sender?.user ?? payload.sender;
      const nextMessage = {
        id: payload.id ?? `${payload.threadId}-${payload.sentAt ?? Date.now()}`,
        text: payload.content ?? "",
        time: payload.sentAt ?? new Date().toISOString(),
        rawTime: payload.sentAt ?? new Date().toISOString(),
        sender: payload.senderId && payload.senderId === currentUserId ? "me" : "other",
        kind:
          payload.mediaType === "image"
            ? "image"
            : payload.content?.toLowerCase().startsWith("my location:")
              ? "location"
              : payload.mediaUrl
                ? "location"
                : "text",
        imageUri: payload.mediaUrl ?? undefined,
        mediaUrl: payload.mediaUrl ?? undefined,
        mediaType: payload.mediaType ?? undefined,
        senderId: payload.senderId,
        senderName: senderProfile?.fullName,
        senderAvatarUrl: senderProfile?.avatarUrl ?? undefined,
      };

      queryClient.setQueryData<any[]>(["chat", "messages", payload.threadId], (current) => {
        const existing = Array.isArray(current) ? current : [];
        if (existing.some((message) => message.id === nextMessage.id)) {
          return existing;
        }
        return [...existing, nextMessage];
      });
    };

    const handleConnect = () => {
      console.log("[ChatSocket] connected", { threadId });
      if (threadId) {
        console.log("[ChatSocket] emit join", { threadId });
        client.emit(CHAT_SOCKET_EVENTS.join, { threadId });
        console.log("[ChatSocket] join thread", { threadId });
      }
    };

    const handleMessageNew = (payload: ServerMessage) => {
      appendIncomingMessage(payload);
      refreshMessages(payload.threadId);
      refreshThreads();
    };

    const handleThreadUpdated = (_payload: ServerThreadUpdate) => {
      refreshThreads();
    };

    const handleMessageRead = (payload: ServerMessage) => {
      console.log("[ChatSocket] message:read received", payload);
      refreshMessages(payload.threadId);
      refreshThreads();
    };

    const handleUserOnline = (_payload: { userId?: string }) => {
      refreshThreads();
    };

    const handleUserOffline = (_payload: { userId?: string }) => {
      refreshThreads();
    };

    client.on("connect", handleConnect);
    client.on(CHAT_SOCKET_EVENTS.newMessage, handleMessageNew);
    client.on(CHAT_SOCKET_EVENTS.updatedThread, handleThreadUpdated);
    client.on(CHAT_SOCKET_EVENTS.read, handleMessageRead);
    client.on(CHAT_SOCKET_EVENTS.userOnline, handleUserOnline);
    client.on(CHAT_SOCKET_EVENTS.userOffline, handleUserOffline);

    if (client.connected && threadId) {
      client.emit(CHAT_SOCKET_EVENTS.join, { threadId });
    }

    return () => {
      client.off("connect", handleConnect);
      client.off(CHAT_SOCKET_EVENTS.newMessage, handleMessageNew);
      client.off(CHAT_SOCKET_EVENTS.updatedThread, handleThreadUpdated);
      client.off(CHAT_SOCKET_EVENTS.read, handleMessageRead);
      client.off(CHAT_SOCKET_EVENTS.userOnline, handleUserOnline);
      client.off(CHAT_SOCKET_EVENTS.userOffline, handleUserOffline);

      if (threadId) {
        client.emit(CHAT_SOCKET_EVENTS.leave, { threadId });
      }

      detachSocket();
    };
  }, [queryClient, currentUserId, threadId, token]);
}

export function disconnectChatSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    activeToken = null;
    activeSubscribers = 0;
    chatListenersBound = false;
    supportListenersBound = false;
    chatListenersClient = null;
    supportListenersClient = null;
    chatHandlers = null;
    supportHandlers = null;
  }
}

export async function sendChatMessageViaSocket(
  payload: {
    threadId: string;
    content?: string;
    mediaUrl?: string;
    mediaType?: "image" | "location";
    locationUrl?: string;
  },
  token?: string | null,
): Promise<any> {
  const authToken = token ?? useAuthStore.getState().token;
  if (!authToken) {
    throw new Error("Authentication required");
  }

  const client = getChatSocket(authToken);
  if (!client.connected) {
    await new Promise<void>((resolve, reject) => {
      const handleConnect = () => {
        client.off("connect_error", handleError);
        resolve();
      };
      const handleError = (error: unknown) => {
        client.off("connect", handleConnect);
        reject(error instanceof Error ? error : new Error("Socket connection failed"));
      };

      client.once("connect", handleConnect);
      client.once("connect_error", handleError);
      client.connect();
    });
  }

  return await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error("Message send timeout")), 15000);

    client.emit(CHAT_SOCKET_EVENTS.send, payload, (response: { status?: string; message?: any } | undefined) => {
      clearTimeout(timeoutId);
      if (!response || response.status !== "ok") {
        reject(new Error(response?.message || "Failed to send message"));
        return;
      }
      const normalizedMessage =
        response.message &&
        typeof response.message === "object" &&
        "message" in response.message &&
        response.message.message
          ? response.message.message
          : response.message;

      console.log("[ChatSocket] sent via socket", {
        threadId: payload.threadId,
        senderPath: "socket",
      });
      resolve(normalizedMessage);
    });
  });
}

export async function sendChatReadViaSocket(threadId: string, token?: string | null): Promise<void> {
  const authToken = token ?? useAuthStore.getState().token;
  if (!authToken) {
    throw new Error("Authentication required");
  }

  const client = getChatSocket(authToken);
  if (!client.connected) {
    await new Promise<void>((resolve, reject) => {
      const handleConnect = () => {
        client.off("connect_error", handleError);
        resolve();
      };
      const handleError = (error: unknown) => {
        client.off("connect", handleConnect);
        reject(error instanceof Error ? error : new Error("Socket connection failed"));
      };

      client.once("connect", handleConnect);
      client.once("connect_error", handleError);
      client.connect();
    });
  }


  client.emit(CHAT_SOCKET_EVENTS.read, { threadId });
}

export async function sendChatTypingViaSocket(
  payload: { threadId: string; isTyping: boolean },
  token?: string | null,
): Promise<void> {
  const authToken = token ?? useAuthStore.getState().token;
  if (!authToken) {
    throw new Error("Authentication required");
  }

  const client = getChatSocket(authToken);
  if (!client.connected) {
    await new Promise<void>((resolve, reject) => {
      const handleConnect = () => {
        client.off("connect_error", handleError);
        resolve();
      };
      const handleError = (error: unknown) => {
        client.off("connect", handleConnect);
        reject(error instanceof Error ? error : new Error("Socket connection failed"));
      };

      client.once("connect", handleConnect);
      client.once("connect_error", handleError);
      client.connect();
    });
  }

  client.emit(CHAT_SOCKET_EVENTS.typing, payload);
}

export async function sendChatMessageWithFallback(
  payload: {
    threadId: string;
    content?: string;
    mediaUrl?: string;
    mediaType?: "image" | "location";
    locationUrl?: string;
  },
  token?: string | null,
): Promise<any> {
  try {
    return await sendChatMessageViaSocket(payload, token);
  } catch (error) {
    console.log("[ChatSocket] socket send failed, falling back to POST /messages/send", {
      threadId: payload.threadId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return await sendChatMessage({
      threadId: payload.threadId,
      content: payload.content,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      locationUrl: payload.locationUrl,
    });
  }
}

export function useSupportSocket() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!token || !currentUserId) {
      return;
    }

    const client = attachSocket(token);
    if (supportListenersBound && supportListenersClient === client) {
      return () => {
        detachSocket();
      };
    }

    const handleSupportThreadNew = (payload: { threadId?: string }) => {
      console.log("[ChatSocket] support:thread:new received", payload);
      void queryClient.invalidateQueries({ queryKey: ["chat", "support-thread"] });
      void queryClient.invalidateQueries({ queryKey: ["chat", "threads"] });
      if (payload.threadId) {
        void queryClient.invalidateQueries({
          queryKey: ["chat", "messages", payload.threadId],
        });
      }
    };

    const handleUserOnline = () => {
      void queryClient.invalidateQueries({ queryKey: ["chat", "threads"] });
      void queryClient.invalidateQueries({ queryKey: ["chat", "contacts"] });
      void queryClient.invalidateQueries({ queryKey: ["chat", "support-thread"] });
    };

    const handleUserOffline = () => {
      void queryClient.invalidateQueries({ queryKey: ["chat", "threads"] });
      void queryClient.invalidateQueries({ queryKey: ["chat", "contacts"] });
      void queryClient.invalidateQueries({ queryKey: ["chat", "support-thread"] });
    };

    client.on(SUPPORT_SOCKET_EVENTS.newThread, handleSupportThreadNew);
    client.on(CHAT_SOCKET_EVENTS.userOnline, handleUserOnline);
    client.on(CHAT_SOCKET_EVENTS.userOffline, handleUserOffline);

    return () => {
      client.off(SUPPORT_SOCKET_EVENTS.newThread, handleSupportThreadNew);
      client.off(CHAT_SOCKET_EVENTS.userOnline, handleUserOnline);
      client.off(CHAT_SOCKET_EVENTS.userOffline, handleUserOffline);
      detachSocket();
    };
  }, [queryClient, currentUserId, token]);
}

export function useChatThreadPresence(threadId?: string) {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  useEffect(() => {
    if (!threadId || !token || !currentUserId) {
      setIsOtherTyping(false);
      return;
    }

    const client = attachSocket(token);
    const typingTimers = new Map<string, ReturnType<typeof setTimeout>>();

    const handleTyping = (payload: {
      userId?: string;
      threadId?: string;
      isTyping?: boolean;
    }) => {
      if (
        payload.threadId !== threadId ||
        !payload.userId ||
        payload.userId === currentUserId
      ) {
        return;
      }

      const existingTimer = typingTimers.get(payload.userId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      if (!payload.isTyping) {
        typingTimers.delete(payload.userId);
        setIsOtherTyping(false);
        return;
      }

      setIsOtherTyping(true);
      const timer = setTimeout(() => {
        typingTimers.delete(payload.userId!);
        setIsOtherTyping(false);
      }, 1800);
      typingTimers.set(payload.userId, timer);
    };

    client.on(CHAT_SOCKET_EVENTS.typing, handleTyping);

    return () => {
      client.off(CHAT_SOCKET_EVENTS.typing, handleTyping);
      typingTimers.forEach((timer) => clearTimeout(timer));
      detachSocket();
    };
  }, [currentUserId, threadId, token]);

  return {
    isOtherTyping,
  };
}

export function useChatUserOnlineStatus(userId?: string, initialOnline = false) {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [isOnline, setIsOnline] = useState(initialOnline);

  useEffect(() => {
    setIsOnline(initialOnline);
  }, [initialOnline, userId]);

  useEffect(() => {
    if (!userId || !token || !currentUserId) {
      setIsOnline(false);
      return;
    }

    const client = attachSocket(token);

    const syncStatus = () => {
      client.emit(
        CHAT_SOCKET_EVENTS.userStatus,
        { userIds: [userId] },
        (response?: {
          statuses?: Record<string, boolean>;
          onlineStatuses?: Record<string, boolean>;
        }) => {
          const nextStatus =
            response?.statuses?.[userId] ?? response?.onlineStatuses?.[userId];

          if (typeof nextStatus === "boolean") {
            setIsOnline(nextStatus);
          }
        },
      );
    };

    const handleUserOnline = (payload: { userId?: string }) => {
      if (payload.userId === userId) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = (payload: { userId?: string }) => {
      if (payload.userId === userId) {
        setIsOnline(false);
      }
    };

    client.on(CHAT_SOCKET_EVENTS.userOnline, handleUserOnline);
    client.on(CHAT_SOCKET_EVENTS.userOffline, handleUserOffline);

    if (client.connected) {
      syncStatus();
    } else {
      client.once("connect", syncStatus);
    }

    return () => {
      client.off(CHAT_SOCKET_EVENTS.userOnline, handleUserOnline);
      client.off(CHAT_SOCKET_EVENTS.userOffline, handleUserOffline);
      client.off("connect", syncStatus);
      detachSocket();
    };
  }, [currentUserId, token, userId]);

  return isOnline;
}
