import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { router, type Href } from "expo-router";
import {
  getMyNotifications,
  type AppNotification,
} from "@/api/notifications/notifications.list.api";

/**
 * Maps a notification to the screen it should open.
 *
 * The backend does not send a route/path — it sends `type` (enum) plus
 * `refType` + `refId`. We resolve the destination from those. refType is the
 * most specific signal, so we match it first, then fall back to `type`.
 * See premierdd Notification model / notifications.service.
 */
function resolveNotificationRoute(notification: AppNotification): Href | null {
  const refType = (notification.refType || "").toLowerCase();
  const type = (notification.type || "").toLowerCase();
  const refId = notification.refId ?? undefined;

  // Most specific: match on refType.
  switch (refType) {
    case "task":
      return refId
        ? { pathname: "/screens/company/taskdetails", params: { taskId: refId } }
        : null;
    case "sub_task":
      return refId
        ? { pathname: "/screens/company/taskdetails", params: { subTaskId: refId } }
        : null;
    case "project":
      return refId
        ? { pathname: "/screens/company/projectdetails", params: { id: refId } }
        : null;
    case "message_thread":
      return refId
        ? { pathname: "/screens/chat/conversation", params: { threadId: refId } }
        : null;
    case "payroll":
      return "/screens/payroll/summary";
    case "company":
      return refId
        ? { pathname: "/screens/company/profile", params: { id: refId } }
        : null;
    default:
      break;
  }

  // Fallback: coarse routing by notification type.
  switch (type) {
    case "message":
      return refId
        ? { pathname: "/screens/chat/conversation", params: { threadId: refId } }
        : null;
    case "task":
      return refId
        ? { pathname: "/screens/company/taskdetails", params: { taskId: refId } }
        : null;
    case "payroll":
      return "/screens/payroll/summary";
    case "inventory":
      return "/(tab)/inventory";
    default:
      return null;
  }
}

export default function NotificationsScreen() {
  const query = useQuery({
    queryKey: ["notifications", "my"],
    queryFn: getMyNotifications,
  });

  const handlePressNotification = (notification: AppNotification) => {
    const route = resolveNotificationRoute(notification);
    if (route) {
      router.push(route);
    }
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={query.isRefetching} onRefresh={query.refetch} />
        }
      >
        <View className="px-5 pt-5">
          <Text className="text-[22px] font-semibold text-slate-900">Notifications</Text>
          <Text className="mt-1 text-[13px] text-slate-500">Latest updates from your account</Text>
        </View>

        {query.isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1f3d5c" />
          </View>
        ) : query.data?.length ? (
          <View className="mt-4 px-5">
            {query.data.map((item) => {
              const hasRoute = resolveNotificationRoute(item) !== null;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={hasRoute ? 0.7 : 1}
                  disabled={!hasRoute}
                  onPress={() => handlePressNotification(item)}
                  className={`mb-3 rounded-2xl border px-4 py-4 ${item.isRead ? "border-slate-200 bg-white" : "border-[#1f3d5c]/20 bg-[#F0F6FB]"}`}
                >
                  <View className="flex-row items-start justify-between">
                    <Text className="flex-1 text-[15px] font-semibold text-slate-900">
                      {item.title}
                    </Text>
                    {hasRoute ? (
                      <Text className="ml-2 mt-0.5 text-slate-300">›</Text>
                    ) : null}
                  </View>
                  <Text className="mt-1 text-[13px] leading-5 text-slate-600">{item.body}</Text>
                  <Text className="mt-2 text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="mt-10 items-center px-5">
            <Text className="text-[14px] text-slate-500">No notifications yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
