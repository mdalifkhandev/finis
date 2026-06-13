import { API_BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

type LocationPayload = {
  lat: number;
  lng: number;
  projectId?: string;
};

let socket: Socket | null = null;
let activeSubscribers = 0;
let activeToken: string | null = null;

function getSocket(token: string) {
  if (socket && activeToken === token) {
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  activeToken = token;
  socket = io(`${API_BASE_URL}/geofencing`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: { token },
  });

  return socket;
}

function attachSocket(token: string) {
  activeSubscribers += 1;
  const instance = getSocket(token);
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

export function emitGeofenceLocation(payload: LocationPayload) {
  const token = useAuthStore.getState().token;
  if (!token) return;
  const client = getSocket(token);
  if (!client.connected) {
    client.connect();
  }
  client.emit("location_update", payload);
}

export function emitGeofenceCheckIn(payload: LocationPayload) {
  const token = useAuthStore.getState().token;
  if (!token) return;
  const client = getSocket(token);
  if (!client.connected) {
    client.connect();
  }
  client.emit("check_in", payload);
}

export function emitGeofenceCheckOut(payload: LocationPayload) {
  const token = useAuthStore.getState().token;
  if (!token) return;
  const client = getSocket(token);
  if (!client.connected) {
    client.connect();
  }
  client.emit("check_out", payload);
}

export function useWorkerGeofenceSocket() {
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!token || !currentUserId) {
      return;
    }

    attachSocket(token);
    return () => {
      detachSocket();
    };
  }, [currentUserId, token]);
}

export function disconnectWorkerGeofenceSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    activeToken = null;
    activeSubscribers = 0;
  }
}
