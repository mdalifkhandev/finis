import { getAdminSubscriptionHistory } from "@/api/admin/admin.api";
import BackTitleHeader from "@/components/common/BackTitleHeader";
import { API_BASE_URL_PLAN } from "@/lib/config";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Linking, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth.store";

function formatCurrencyAmount(amount?: number | null) {
  if (typeof amount !== "number") {
    return "$0";
  }
  return `$${amount.toLocaleString("en-US")}`;
}

function formatDateLabel(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubscriptionScreen() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const role = useAuthStore((state) => state.user?.role);

  const { data: subscription, refetch } = useQuery({
    queryKey: ["admin", "subscription", "history", token],
    queryFn: getAdminSubscriptionHistory,
    enabled: isHydrated && !!token && (role === "admin" || role === "manager"),
    staleTime: 60 * 1000,
  });
  const [refreshing, setRefreshing] = useState(false);

  const current = subscription?.current ?? null;
  const currentPeriodStart = formatDateLabel(current?.startDate);
  const currentPeriodEnd = formatDateLabel(current?.currentPeriodEnd);
  const planTitle = current?.planName ?? "Subscription";
  const planSubtitle = current
    ? `${String(current.planInterval || "monthly").toUpperCase()} BILLING`
    : "MONTHLY BILLING";
  const planPrice = formatCurrencyAmount(current?.amount);
  const planBadge = current?.isExpired ? "Expired" : current?.isActive ? "Active" : "Inactive";
  const featureRows = useMemo(
    () =>
      current
        ? [
             current.permissions.companies.max
            ? `Up to ${current.permissions.companies.max} companies`
            : null,
             current.permissions.projects.max
            ? `Up to ${current.permissions.projects.max} projects`
            : null,
             current.permissions.users.max
            ? `Up to ${current.permissions.users.max} users`
            : null,
            current.permissions.features.geofencing ? "Geofencing access" : null,
            current.permissions.features.advancedReporting ? "Advanced reporting" : null,
            current.permissions.features.customReporting ? "Custom reporting" : null,
            current.permissions.features.whiteLabel ? "White-label branding" : null,
          ].filter((item): item is string => Boolean(item))
        : [],
    [current],
  );

  const stats = useMemo(
    () =>
      current
        ? [
            {
              label: "Companies",
              value: current.permissions.companies.unlimited
                ? "∞"
                : String(current.permissions.companies.max ?? 0),
            },
            {
              label: "Projects",
              value: current.permissions.projects.unlimited
                ? "∞"
                : String(current.permissions.projects.max ?? 0),
            },
            {
              label: "Users",
              value: current.permissions.users.unlimited
                ? "∞"
                : String(current.permissions.users.max ?? 0),
            },
          ]
        : [],
    [current],
  );

  const handleUpgradePlan = async () => {
    await Linking.openURL(`${API_BASE_URL_PLAN}/plans`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <BackTitleHeader title="Subscription" onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="px-5 pt-4">
          <View className="rounded-[18px] border border-[#DEE4EA] bg-white px-4 py-4">
            <Text className="text-[18px] font-semibold text-[#111827]">
              Your Plans
            </Text>
            <Text className="mt-1 text-[13px] leading-5 text-[#6B7280]">
              Here are the subscription plans you can manage. One plan is marked
              as current to show that you’ve already purchased it.
            </Text>

            <View className="mt-4">
              {current ? (
                <View
                  className="rounded-[26px] border border-[#1D5478] bg-white px-4 py-4 shadow-sm"
                  style={{
                    shadowColor: "#0F172A",
                    shadowOpacity: 0.04,
                    shadowRadius: 9,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="h-12 w-12 items-center justify-center rounded-full"
                        style={{ backgroundColor: "#1D547814" }}
                      >
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={22}
                          color="#1D5478"
                        />
                      </View>
                      <View>
                        <Text className="text-[24px] font-extrabold text-[#111827]">
                          {planTitle}
                        </Text>
                        <Text className="text-[11px] font-bold tracking-[2px] text-[#9CA3AF]">
                          {planSubtitle}
                        </Text>
                      </View>
                    </View>

                    <View
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: "#1D547812" }}
                    >
                      <Text
                        className="text-[11px] font-semibold"
                        style={{ color: "#1D5478" }}
                      >
                        {planBadge}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-5">
                    <Text className="text-[42px] font-extrabold text-[#111827]">
                      {planPrice}
                      <Text className="text-[16px] font-semibold text-[#6B7280]">
                        {" "}
                        / month
                      </Text>
                    </Text>
                    <Text className="mt-1 text-[13px] text-[#6B7280]">
                      Days left:{" "}
                      <Text className="font-bold text-[#111827]">
                        {current.daysLeft ?? 0}
                      </Text>
                    </Text>
                    <Text className="mt-1 text-[13px] text-[#6B7280]">
                      Period:{" "}
                      <Text className="font-bold text-[#111827]">
                        {currentPeriodStart && currentPeriodEnd
                          ? `${currentPeriodStart} — ${currentPeriodEnd}`
                          : "N/A"}
                      </Text>
                    </Text>
                  </View>

                  <View className="mt-5 rounded-[22px] bg-[#FAFBFC] px-4 py-4">
                    {featureRows.length > 0 ? (
                      featureRows.map((feature) => (
                        <View key={feature} className="mb-3 flex-row items-center">
                          <View className="h-5 w-5 items-center justify-center rounded-full bg-[#E6FAF1]">
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color="#10B981"
                            />
                          </View>
                          <Text className="ml-3 text-[13px] text-[#475569]">
                            {feature}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text className="text-[13px] text-[#64748B]">
                        No feature permissions available.
                      </Text>
                    )}
                  </View>

                  <View className="mt-4 flex-row gap-2">
                    {stats.map((stat) => (
                      <View
                        key={stat.label}
                        className="flex-1 rounded-[18px] bg-[#FAFBFC] px-2 py-3"
                      >
                        <Text className="text-center text-[11px] font-bold tracking-[1.5px] text-[#A0A8B4]">
                          {stat.label}
                        </Text>
                        <Text className="mt-1 text-center text-[22px] font-extrabold text-[#111827]">
                          {stat.value}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className="mt-4 flex-row gap-3">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled
                      className="h-[48px] flex-1 items-center justify-center rounded-[14px] bg-[#D7E2EA]"
                    >
                      <Text className="text-[14px] font-semibold text-[#64748B]">
                        Current Plan
                      </Text>
                    </TouchableOpacity>

           
                  </View>
                </View>
              ) : (
                <View className="rounded-[26px] border border-[#E5EAF0] bg-white px-4 py-4 shadow-sm">
                  <Text className="text-[14px] text-[#64748B]">
                    No active subscription plan found.
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleUpgradePlan}
              className="mt-4 h-[48px] items-center justify-center rounded-[14px] bg-[#1D5478]"
            >
              <Text className="text-[15px] font-semibold text-white">
                Upgrade Plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
