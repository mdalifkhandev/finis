import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ServerHealthStatus } from "@/hooks/common/useServerHealth";

interface ServerHealthBannerProps {
  status: ServerHealthStatus;
  latencyMs?: number | null;
  errorMessage?: string | null;
  onRetry: () => void | Promise<unknown>;
  isChecking: boolean;
}

export function ServerHealthBanner({
  status,
  latencyMs,
  errorMessage,
  onRetry,
  isChecking,
}: ServerHealthBannerProps) {
  if (status === "checking") {
    return (
      <View className="mb-4 flex-row items-center justify-between rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] px-3.5 py-2.5">
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" color="#1D5478" />
          <Text className="text-[13px] font-medium text-[#334155]">
            Testing backend server connection...
          </Text>
        </View>
        <Text className="text-[11px] font-semibold text-[#64748B]">
          Checking
        </Text>
      </View>
    );
  }

  if (status === "stable") {
    return (
      <View className="mb-4 flex-row items-center justify-between rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-2.5">
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-[#10B981]" />
          <Ionicons name="checkmark-circle" size={17} color="#059669" />
          <Text className="text-[13px] font-bold text-[#065F46]">
            Server Stable
          </Text>
          {latencyMs !== null && latencyMs !== undefined ? (
            <View className="rounded-md bg-[#D1FAE5] px-1.5 py-0.5">
              <Text className="text-[11px] font-semibold text-[#047857]">
                {latencyMs}ms
              </Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.7}
          disabled={isChecking}
          className="flex-row items-center gap-1 rounded-md bg-[#D1FAE5] px-2 py-1"
        >
          <Ionicons
            name="refresh-outline"
            size={13}
            color="#047857"
          />
          <Text className="text-[11px] font-medium text-[#047857]">
            Re-test
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // status === "down"
  return (
    <View className="mb-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3.5 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Ionicons name="cloud-offline" size={20} color="#DC2626" />
          <Text className="text-[14px] font-bold text-[#991B1B]">
            Server Down
          </Text>
        </View>
        <View className="rounded-md bg-[#FEE2E2] px-2 py-0.5">
          <Text className="text-[11px] font-bold text-[#DC2626]">
            Offline
          </Text>
        </View>
      </View>

      <Text className="mt-1.5 text-[12px] leading-4 text-[#7F1D1D]">
        {errorMessage || "Unable to reach backend server. Please verify the backend is running."}
      </Text>

      <TouchableOpacity
        onPress={onRetry}
        activeOpacity={0.8}
        disabled={isChecking}
        className="mt-3 flex-row items-center justify-center gap-1.5 rounded-lg bg-[#DC2626] py-2"
      >
        {isChecking ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="refresh" size={15} color="#FFFFFF" />
        )}
        <Text className="text-[12px] font-bold text-white">
          {isChecking ? "Testing Connection..." : "Retry Connection"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
