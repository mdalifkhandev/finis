import BackTitleHeader from "@/components/common/BackTitleHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Plan = {
  name: string;
  subtitle: string;
  price: string;
  yearly: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  badge: string;
  features: string[];
  stats: Array<{ label: string; value: string }>;
  isCurrent?: boolean;
};

const plans: Plan[] = [
  {
    name: "Medeum",
    subtitle: "MONTHLY BILLING",
    price: "$104",
    yearly: "$1000",
    icon: "shield-checkmark-outline",
    accent: "#1D5478",
    badge: "Basic",
    features: [
      "Up to 5 companies",
      "Up to 50 projects",
      "Up to 50 users",
      "Geofencing access",
      "Advanced reporting",
      "White-label branding",
    ],
    stats: [
      { label: "Companies", value: "5" },
      { label: "Projects", value: "50" },
      { label: "Users", value: "50" },
    ],
  },
  {
    name: "Med",
    subtitle: "MONTHLY BILLING",
    price: "$250",
    yearly: "$2500",
    icon: "rocket-outline",
    accent: "#163D63",
    badge: "Popular",
    features: [
      "Up to 10 companies",
      "Up to 100 projects",
      "Up to 200 users",
      "Geofencing access",
      "Advanced reporting",
      "Default branding",
    ],
    stats: [
      { label: "Companies", value: "10" },
      { label: "Projects", value: "100" },
      { label: "Users", value: "200" },
    ],
    isCurrent: true,
  },
  {
    name: "Pro",
    subtitle: "MONTHLY BILLING",
    price: "$2500",
    yearly: "$25000",
    icon: "business-outline",
    accent: "#0F172A",
    badge: "Premium",
    features: [
      "Up to 10 companies",
      "Up to 100 projects",
      "Up to 200 users",
      "Geofencing access",
      "Advanced reporting",
      "White-label branding",
    ],
    stats: [
      { label: "Companies", value: "10" },
      { label: "Projects", value: "100" },
      { label: "Users", value: "200" },
    ],
  },
];

export default function SubscriptionScreen() {
  const handleUpgradePlan = async () => {
    await Linking.openURL("https://b7ds5k81-5173.inc1.devtunnels.ms/plans");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <BackTitleHeader title="Subscription" onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
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

            <View className="mt-4 gap-4">
              {plans.map((plan) => (
                <View
                  key={plan.name}
                  className={`rounded-[26px] border bg-white px-4 py-4 shadow-sm ${
                    plan.isCurrent
                      ? "border-[#1D5478] shadow-black/10"
                      : "border-[#E5EAF0]"
                  }`}
                  style={{
                    shadowColor: "#0F172A",
                    shadowOpacity: 0.08,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 4,
                  }}
                >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <View
                          className="h-12 w-12 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${plan.accent}14` }}
                        >
                          <Ionicons
                            name={plan.icon}
                            size={22}
                            color={plan.accent}
                          />
                        </View>
                        <View>
                          <Text className="text-[24px] font-extrabold text-[#111827]">
                            {plan.name}
                          </Text>
                          <Text className="text-[11px] font-bold tracking-[2px] text-[#9CA3AF]">
                            {plan.subtitle}
                          </Text>
                        </View>
                      </View>

                      <View
                        className="rounded-full px-3 py-1"
                        style={{ backgroundColor: `${plan.accent}12` }}
                      >
                        <Text
                          className="text-[11px] font-semibold"
                          style={{ color: plan.accent }}
                        >
                          {plan.isCurrent ? "Active" : plan.badge}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-5">
                      <Text className="text-[42px] font-extrabold text-[#111827]">
                        {plan.price}
                        <Text className="text-[16px] font-semibold text-[#6B7280]">
                          {" "}
                          / month
                        </Text>
                      </Text>
                      <Text className="mt-1 text-[13px] text-[#6B7280]">
                        Yearly:{" "}
                        <Text className="font-bold text-[#111827]">
                          {plan.yearly}
                        </Text>
                      </Text>
                    </View>

                    <View className="mt-5 rounded-[22px] bg-[#FAFBFC] px-4 py-4">
                      {plan.features.map((feature) => (
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
                      ))}
                    </View>

                    <View className="mt-4 flex-row gap-2">
                      {plan.stats.map((stat) => (
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
                        disabled={plan.isCurrent}
                        onPress={handleUpgradePlan}
                        className={`h-[48px] flex-1 items-center justify-center rounded-[14px] ${
                          plan.isCurrent ? "bg-[#D7E2EA]" : "bg-[#1D5478]"
                        }`}
                      >
                        <Text
                          className={`text-[14px] font-semibold ${
                            plan.isCurrent ? "text-[#64748B]" : "text-white"
                          }`}
                        >
                          {plan.isCurrent ? "Current Plan" : "Buy Monthly"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={handleUpgradePlan}
                        className="h-[48px] flex-1 items-center justify-center rounded-[14px] border border-[#D4DCE4] bg-white"
                      >
                        <Text className="text-[14px] font-semibold text-[#334155]">
                          Buy Yearly
                        </Text>
                      </TouchableOpacity>
                    </View>
                </View>
              ))}
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
