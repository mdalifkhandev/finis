import { API_BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

type ServerMessage = {
  threadId: string;
};

type ServerThreadUpdate = {
  threadId: string;
};

let socket: Socket | null = null;
let activeSubscribers = 0;
let activeToken: string | null = null;

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

    const handleConnect = () => {
      if (threadId) {
        client.emit("thread:join", { threadId });
      }
    };

    const handleMessageNew = (payload: ServerMessage) => {
      refreshMessages(payload.threadId);
      refreshThreads();
    };

    const handleThreadUpdated = (_payload: ServerThreadUpdate) => {
      refreshThreads();
    };

    const handleMessageRead = (payload: ServerMessage) => {
      refreshMessages(payload.threadId);
      refreshThreads();
    };

    client.on("connect", handleConnect);
    client.on("message:new", handleMessageNew);
    client.on("thread:updated", handleThreadUpdated);
    client.on("message:read", handleMessageRead);

    if (client.connected && threadId) {
      client.emit("thread:join", { threadId });
    }

    return () => {
      client.off("connect", handleConnect);
      client.off("message:new", handleMessageNew);
      client.off("thread:updated", handleThreadUpdated);
      client.off("message:read", handleMessageRead);

      if (threadId) {
        client.emit("thread:leave", { threadId });
      }

      detachSocket();
    };
  }, [queryClient, currentUserId, threadId, token]);
}
