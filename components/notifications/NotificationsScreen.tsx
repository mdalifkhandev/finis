import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getMyNotifications } from "@/api/notifications/notifications.list.api";

export default function NotificationsScreen() {
  const query = useQuery({
    queryKey: ["notifications", "my"],
    queryFn: getMyNotifications,
  });

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
            {query.data.map((item) => (
              <View
                key={item.id}
                className={`mb-3 rounded-2xl border px-4 py-4 ${item.isRead ? "border-slate-200 bg-white" : "border-[#1f3d5c]/20 bg-[#F0F6FB]"}`}
              >
                <Text className="text-[15px] font-semibold text-slate-900">{item.title}</Text>
                <Text className="mt-1 text-[13px] leading-5 text-slate-600">{item.body}</Text>
                <Text className="mt-2 text-[11px] text-slate-400">
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            ))}
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
