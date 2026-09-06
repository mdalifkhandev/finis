import { getAdminSubscriptionHistory } from "@/api/admin/admin.api";
import {
  confirmMobileSubscription,
  createMobileSubscription,
  getPublicPlans,
  type PublicSubscriptionPlan,
} from "@/api/subscription/subscription.api";
import BackTitleHeader from "@/components/common/BackTitleHeader";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

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
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Queries
  const { data: subscription, refetch } = useQuery({
    queryKey: ["admin", "subscription", "history", token],
    queryFn: getAdminSubscriptionHistory,
    enabled: isHydrated && !!token && (role === "admin" || role === "manager"),
    staleTime: 60 * 1000,
  });

  const {
    data: publicPlans = [],
    isLoading: isPlansLoading,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: ["public-plans"],
    queryFn: getPublicPlans,
    staleTime: 5 * 60 * 1000,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchPlans()]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubscribePlan = async (plan: PublicSubscriptionPlan) => {
    if (subscribingPlanId) return;
    setSubscribingPlanId(plan.id);

    try {
      const res = await createMobileSubscription({
        planId: plan.id,
        interval: billingCycle,
      });

      if (!res.requiresPayment) {
        toast.success(res.message || "Subscription updated successfully!");
        await refetch();
        setShowPlansModal(false);
        return;
      }

      if (
        (!res.paymentIntentClientSecret && !res.setupIntentClientSecret) ||
        !res.customerEphemeralKeySecret ||
        !res.customerId
      ) {
        throw new Error("Missing Stripe payment credentials from server.");
      }

      const defaultBillingDetails = {
        name: user?.name || user?.fullName || undefined,
        email: user?.email || undefined,
      };

      const { error: initError } = await initPaymentSheet(
        res.setupIntentClientSecret
          ? {
              merchantDisplayName: "Finis",
              customerId: res.customerId,
              customerEphemeralKeySecret: res.customerEphemeralKeySecret,
              setupIntentClientSecret: res.setupIntentClientSecret,
              allowsDelayedPaymentMethods: false,
              defaultBillingDetails,
            }
          : {
              merchantDisplayName: "Finis",
              customerId: res.customerId,
              customerEphemeralKeySecret: res.customerEphemeralKeySecret,
              paymentIntentClientSecret: res.paymentIntentClientSecret!,
              allowsDelayedPaymentMethods: false,
              defaultBillingDetails,
            },
      );

      if (initError) {
        toast.error(initError.message || "Failed to initialize payment sheet.");
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          toast.info("Payment was cancelled.");
          return;
        }
        toast.error(presentError.message || "Payment failed.");
        return;
      }

      // Payment succeeded! Confirm subscription with backend
      if (res.subscriptionId) {
        try {
          await confirmMobileSubscription({ subscriptionId: res.subscriptionId });
        } catch (e: any) {
          console.warn("Mobile subscription confirm error:", e);
        }
      }

      toast.success("Subscription activated successfully!");
      await refetch();
      setShowPlansModal(false);
    } catch (err: any) {
      console.error("Subscription error:", err);
      toast.error(err?.message || "Something went wrong with the subscription.");
    } finally {
      setSubscribingPlanId(null);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-[#E9EDF1]">
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
              Manage your subscription directly inside the app. Check your current plan benefits or upgrade anytime.
            </Text>

            <View className="mt-4">
              {current ? (
                <View
                  className="rounded-[26px] border border-[#1D5478] bg-white px-4 py-4"
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
                        / {current.planInterval || "month"}
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
                <View
                  className="rounded-[26px] border border-[#E5EAF0] bg-white px-4 py-6 items-center"
                  style={{ elevation: 1 }}
                >
                  <Ionicons name="card-outline" size={40} color="#94A3B8" />
                  <Text className="mt-2 text-[15px] font-medium text-[#64748B]">
                    No active subscription plan found.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setShowPlansModal(true)}
                    className="mt-4 h-[44px] px-6 items-center justify-center rounded-[14px] bg-[#1D5478]"
                  >
                    <Text className="text-[14px] font-semibold text-white">
                      Choose a Plan
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {current && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowPlansModal(true)}
                className="mt-4 h-[48px] flex-row items-center justify-center gap-2 rounded-[14px] bg-[#1D5478]"
              >
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                <Text className="text-[15px] font-semibold text-white">
                  Upgrade or Change Plan
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* In-App Plan Selection & Stripe Checkout Modal */}
      {showPlansModal && (
        <Modal
          visible={showPlansModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => {
            if (!subscribingPlanId) setShowPlansModal(false);
          }}
        >
          <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F8FAFC]">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between border-b border-[#E2E8F0] bg-white px-5 py-4">
              <View>
                <Text className="text-[20px] font-bold text-[#0F172A]">
                  Select Plan
                </Text>
                <Text className="text-[12px] text-[#64748B]">
                  In-app Stripe Checkout
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!!subscribingPlanId}
                onPress={() => setShowPlansModal(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F1F5F9]"
              >
                <Ionicons name="close" size={20} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* Billing Cycle Switcher */}
            <View className="px-5 pt-4">
              <View className="flex-row rounded-[12px] bg-[#E2E8F0] p-1">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setBillingCycle("monthly")}
                  className="flex-1 items-center justify-center rounded-[10px] py-2.5"
                  style={
                    billingCycle === "monthly"
                      ? {
                          backgroundColor: "#FFFFFF",
                          elevation: 1,
                          shadowColor: "#000",
                          shadowOpacity: 0.06,
                          shadowRadius: 2,
                        }
                      : {}
                  }
                >
                  <Text
                    className={`text-[13px] font-bold ${
                      billingCycle === "monthly" ? "text-[#1D5478]" : "text-[#64748B]"
                    }`}
                  >
                    Monthly Billing
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setBillingCycle("yearly")}
                  className="flex-1 items-center justify-center rounded-[10px] py-2.5"
                  style={
                    billingCycle === "yearly"
                      ? {
                          backgroundColor: "#FFFFFF",
                          elevation: 1,
                          shadowColor: "#000",
                          shadowOpacity: 0.06,
                          shadowRadius: 2,
                        }
                      : {}
                  }
                >
                  <View className="flex-row items-center gap-1.5">
                    <Text
                      className={`text-[13px] font-bold ${
                        billingCycle === "yearly" ? "text-[#1D5478]" : "text-[#64748B]"
                      }`}
                    >
                      Yearly Billing
                    </Text>
                    <View className="rounded-full bg-[#10B981] px-1.5 py-0.5">
                      <Text className="text-[9px] font-extrabold text-white">
                        SAVE
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Plans List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
              {isPlansLoading ? (
                <View className="py-20 items-center justify-center">
                  <ActivityIndicator size="large" color="#1D5478" />
                  <Text className="mt-3 text-[14px] text-[#64748B]">
                    Loading plans...
                  </Text>
                </View>
              ) : publicPlans.length === 0 ? (
                <View className="rounded-[18px] border border-[#E2E8F0] bg-white p-6 items-center">
                  <Ionicons name="alert-circle-outline" size={36} color="#94A3B8" />
                  <Text className="mt-2 text-[15px] font-medium text-[#64748B]">
                    No subscription plans available at the moment.
                  </Text>
                </View>
              ) : (
                <View className="gap-4">
                  {publicPlans.map((plan) => {
                    const isCurrent =
                      current?.planName?.toLowerCase().trim() ===
                        plan.name.toLowerCase().trim() && !current?.isExpired;
                    const isProcessing = subscribingPlanId === plan.id;
                    const price =
                      billingCycle === "monthly"
                        ? plan.priceMonthly
                        : plan.priceYearly ?? plan.priceMonthly * 12;

                    return (
                      <View
                        key={plan.id}
                        className={`rounded-[22px] border bg-white p-5 ${
                          isCurrent
                            ? "border-[#1D5478] bg-[#F8FBFF]"
                            : "border-[#E2E8F0]"
                        }`}
                        style={{
                          elevation: 1,
                          shadowColor: "#000",
                          shadowOpacity: 0.04,
                          shadowRadius: 4,
                        }}
                      >
                        {/* Top row */}
                        <View className="flex-row items-center justify-between">
                          <View>
                            <Text className="text-[20px] font-bold text-[#0F172A]">
                              {plan.name}
                            </Text>
                            {plan.supportLevel && (
                              <Text className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">
                                {plan.supportLevel} Support
                              </Text>
                            )}
                          </View>
                          {isCurrent && (
                            <View className="rounded-full bg-[#1D54781A] px-3 py-1">
                              <Text className="text-[11px] font-bold text-[#1D5478]">
                                Active Plan
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Price */}
                        <View className="mt-3 flex-row items-baseline">
                          <Text className="text-[32px] font-extrabold text-[#0F172A]">
                            ${price.toLocaleString("en-US")}
                          </Text>
                          <Text className="ml-1.5 text-[14px] font-medium text-[#64748B]">
                            / {billingCycle === "monthly" ? "month" : "year"}
                          </Text>
                        </View>

                        {/* Limits grid */}
                        <View className="mt-4 flex-row gap-2 rounded-[14px] bg-[#F1F5F9] p-3">
                          <View className="flex-1 items-center">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                              Companies
                            </Text>
                            <Text className="mt-0.5 text-[16px] font-extrabold text-[#0F172A]">
                              {plan.maxCompanies ? plan.maxCompanies : "∞"}
                            </Text>
                          </View>
                          <View className="h-full w-[1px] bg-[#CBD5E1]" />
                          <View className="flex-1 items-center">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                              Projects
                            </Text>
                            <Text className="mt-0.5 text-[16px] font-extrabold text-[#0F172A]">
                              {plan.maxProjects ? plan.maxProjects : "∞"}
                            </Text>
                          </View>
                          <View className="h-full w-[1px] bg-[#CBD5E1]" />
                          <View className="flex-1 items-center">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                              Users
                            </Text>
                            <Text className="mt-0.5 text-[16px] font-extrabold text-[#0F172A]">
                              {plan.maxUsers ? plan.maxUsers : "∞"}
                            </Text>
                          </View>
                        </View>

                        {/* Features checklist */}
                        <View className="mt-4 gap-2 border-t border-[#F1F5F9] pt-3">
                          <View className="flex-row items-center">
                            <Ionicons
                              name={plan.hasGeofencing ? "checkmark-circle" : "close-circle"}
                              size={18}
                              color={plan.hasGeofencing ? "#10B981" : "#94A3B8"}
                            />
                            <Text
                              style={
                                !plan.hasGeofencing
                                  ? { textDecorationLine: "line-through" }
                                  : undefined
                              }
                              className={`ml-2 text-[13px] ${
                                plan.hasGeofencing ? "text-[#334155]" : "text-[#94A3B8]"
                              }`}
                            >
                              Geofencing tracking
                            </Text>
                          </View>

                          <View className="flex-row items-center">
                            <Ionicons
                              name={
                                plan.hasAdvancedReporting
                                  ? "checkmark-circle"
                                  : "close-circle"
                              }
                              size={18}
                              color={plan.hasAdvancedReporting ? "#10B981" : "#94A3B8"}
                            />
                            <Text
                              style={
                                !plan.hasAdvancedReporting
                                  ? { textDecorationLine: "line-through" }
                                  : undefined
                              }
                              className={`ml-2 text-[13px] ${
                                plan.hasAdvancedReporting
                                  ? "text-[#334155]"
                                  : "text-[#94A3B8]"
                              }`}
                            >
                              Advanced reporting & analytics
                            </Text>
                          </View>

                          <View className="flex-row items-center">
                            <Ionicons
                              name={
                                plan.hasCustomReporting
                                  ? "checkmark-circle"
                                  : "close-circle"
                              }
                              size={18}
                              color={plan.hasCustomReporting ? "#10B981" : "#94A3B8"}
                            />
                            <Text
                              style={
                                !plan.hasCustomReporting
                                  ? { textDecorationLine: "line-through" }
                                  : undefined
                              }
                              className={`ml-2 text-[13px] ${
                                plan.hasCustomReporting
                                  ? "text-[#334155]"
                                  : "text-[#94A3B8]"
                              }`}
                            >
                              Custom reports export
                            </Text>
                          </View>

                          <View className="flex-row items-center">
                            <Ionicons
                              name={plan.hasWhiteLabel ? "checkmark-circle" : "close-circle"}
                              size={18}
                              color={plan.hasWhiteLabel ? "#10B981" : "#94A3B8"}
                            />
                            <Text
                              style={
                                !plan.hasWhiteLabel
                                  ? { textDecorationLine: "line-through" }
                                  : undefined
                              }
                              className={`ml-2 text-[13px] ${
                                plan.hasWhiteLabel ? "text-[#334155]" : "text-[#94A3B8]"
                              }`}
                            >
                              White-label branding
                            </Text>
                          </View>
                        </View>

                        {/* Subscribe Action Button */}
                        <TouchableOpacity
                          activeOpacity={0.85}
                          disabled={isCurrent || !!subscribingPlanId}
                          onPress={() => handleSubscribePlan(plan)}
                          className={`mt-5 h-[46px] flex-row items-center justify-center gap-2 rounded-[12px] ${
                            isCurrent ? "bg-[#E2E8F0]" : "bg-[#1D5478]"
                          }`}
                        >
                          {isProcessing ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <>
                              {!isCurrent && (
                                <Ionicons name="card-outline" size={18} color="#FFFFFF" />
                              )}
                              <Text
                                className={`text-[14px] font-bold ${
                                  isCurrent ? "text-[#64748B]" : "text-white"
                                }`}
                              >
                                {isCurrent ? "Current Plan" : "Subscribe with Stripe"}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}
