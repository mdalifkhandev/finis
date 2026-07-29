import BackTitleHeader from "@/components/common/BackTitleHeader";
import { useCreateDirectThreadMutation } from "@/hooks/chat/chat";
import { useChatUserProfileQuery } from "@/hooks/chat/user-profile";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const placeholderAvatar = require("../../assets/images/placeholder-person.png");

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-3 rounded-2xl border border-[#E1E7EE] bg-white px-4 py-3">
      <Text className="text-[12px] uppercase tracking-[1px] text-[#66707B]">
        {label}
      </Text>
      <Text className="mt-1 text-[15px] font-medium text-[#1F2328]">
        {value}
      </Text>
    </View>
  );
}

export default function ChatUserProfileScreen() {
  const { id, name, avatarUrl } = useLocalSearchParams<{
    id?: string;
    name?: string;
    avatarUrl?: string;
  }>();

  const userId = typeof id === "string" ? id : undefined;
  const currentUserId = useAuthStore((state) => state.user?.id);
  const currentUserRole = useAuthStore((state) => state.user?.role);
  const openThreadMutation = useCreateDirectThreadMutation();
  const { data, isLoading } = useChatUserProfileQuery(userId);

  const resolvedName = data?.fullName ?? name ?? "User";
  const resolvedAvatar = data?.avatarUrl || avatarUrl || null;
  const imageSource = resolvedAvatar ? { uri: resolvedAvatar } : placeholderAvatar;
  const targetRole = data?.role;
  const canStartDirectChat = (() => {
    if (!currentUserRole || !targetRole || !userId || userId === currentUserId) {
      return false;
    }

    if (currentUserRole === "admin") {
      return targetRole === "manager" || targetRole === "worker";
    }

    if (currentUserRole === "manager") {
      return targetRole === "admin" || targetRole === "worker";
    }

    if (currentUserRole === "worker") {
      return targetRole === "manager";
    }

    return false;
  })();

  const handleMessagePress = async () => {
    if (!userId || !canStartDirectChat) return;

    try {
      const thread = await openThreadMutation.mutateAsync(userId);

      router.push({
        pathname: "/screens/chat/conversation",
        params: {
          threadId: thread.id,
          name: resolvedName,
          avatarUrl: resolvedAvatar ?? "",
          userId,
          role: targetRole ?? "",
        },
      });
    } catch (_error) {
      // mutation already shows toast
    }
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <BackTitleHeader title="Profile" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        {isLoading && !data ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1f3d5c" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading profile...
            </Text>
          </View>
        ) : (
          <>
            <View className="mx-5 mt-4 rounded-[28px] border border-[#DDE4EA] bg-white px-5 py-6">
              <View className="items-center">
                <Image source={imageSource} className="h-24 w-24 rounded-full" />
                <Text className="mt-4 text-[22px] font-semibold text-[#1F2328]">
                  {resolvedName}
                </Text>
                <View className="mt-2 rounded-full bg-[#D8F2E3] px-3 py-1">
                  <Text className="text-[13px] font-medium text-[#16A34A]">
                    {data?.status ?? "active"}
                  </Text>
                </View>

                {userId !== currentUserId ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleMessagePress}
                    disabled={!canStartDirectChat || openThreadMutation.isPending}
                    className={`mt-4 h-11 min-w-[150px] flex-row items-center justify-center rounded-[10px] px-5 ${
                      canStartDirectChat ? "bg-[#1D5478]" : "bg-[#CBD5E1]"
                    }`}
                  >
                    {openThreadMutation.isPending ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
                        <Text className="ml-2 text-[14px] font-semibold text-white">
                          Message
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <View className="mx-5 mt-5">
              <ProfileRow label="Full Name" value={data?.fullName ?? resolvedName} />
              <ProfileRow label="Role" value={data?.role ?? "Unknown"} />
              <ProfileRow label="Email" value={data?.email ?? "N/A"} />
              <ProfileRow label="Phone" value={data?.phone ?? "N/A"} />
              <ProfileRow label="Department" value={data?.department ?? "N/A"} />
              <ProfileRow label="Employee ID" value={data?.employeeId ?? "N/A"} />
              <ProfileRow label="Join Date" value={data?.joinDate ?? "N/A"} />
              <ProfileRow label="User ID" value={data?.id ?? userId ?? "N/A"} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
