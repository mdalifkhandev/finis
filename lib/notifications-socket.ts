import { API_BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

type ServerNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  refId: string | null;
  refType: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

let socket: Socket | null = null;
let activeSubscribers = 0;
let activeToken: string | null = null;

function getNotificationsSocket(token: string) {
  if (socket && activeToken === token) {
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  activeToken = token;
  socket = io(`${API_BASE_URL}/notifications`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: { token },
  });

  return socket;
}

function attachSocket(token: string) {
  activeSubscribers += 1;
  const instance = getNotificationsSocket(token);
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

export function useNotificationsSocket() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!token || !currentUserId) {
      return;
    }

    const client = attachSocket(token);

    const refreshNotifications = () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications", "my"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    };

    const handleNotification = (_payload: ServerNotification) => {
      refreshNotifications();
    };

    client.on("notification", handleNotification);

    return () => {
      client.off("notification", handleNotification);
      detachSocket();
    };
  }, [queryClient, currentUserId, token]);
}

export function disconnectNotificationsSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    activeToken = null;
    activeSubscribers = 0;
  }
}
