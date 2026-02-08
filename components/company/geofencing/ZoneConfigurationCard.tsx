import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

function MetricCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="flex-1 rounded-2xl bg-[#EEF2F6] p-4">
      <Text className="text-[14px] text-[#6B7280]">{label}</Text>
      {children}
    </View>
  );
}

export default function ZoneConfigurationCard() {
  return (
    <View className="mt-4 px-5">
      <View className="rounded-3xl border border-[#E2E8EE] bg-[#F7F9FB] p-4">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-[17px] font-semibold text-[#111827]">Zone</Text>
            <Text className="-mt-0.5 text-[17px] font-semibold text-[#111827]">
              Configuration
            </Text>
            <Text className="mt-2 text-[14px] text-[#6B7280]">
              Defined on 6/10/2025
            </Text>
          </View>

          <View className="items-end">
            <View className="rounded-full bg-[#D8F2E3] px-3 py-2">
              <Text className="text-[15px] text-[#16A34A]">Active Monitor</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-2 h-10 flex-row items-center rounded-xl border border-[#CFD6DD] bg-[#F8FAFC] px-4"
            >
              <Ionicons name="eye-off-outline" size={18} color="#111827" />
              <Text className="ml-2 text-[16px] text-[#111827]">Disable</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-2 h-10 flex-row items-center rounded-xl border border-[#F3C6C6] bg-[#FFF7F7] px-4"
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text className="ml-2 text-[16px] text-[#DC2626]">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <MetricCard label="Total Area">
            <Text className="text-[16px] font-semibold text-[#1F2937]">
              45,200 sq.ft
            </Text>
          </MetricCard>
          <MetricCard label="Perimeter">
            <Text className="text-[16px] font-semibold text-[#1F2937]">860 ft</Text>
          </MetricCard>
        </View>

        <View className="mt-3 flex-row gap-3">
          <MetricCard label="Center Point">
            <Text className="text-[15px] leading-6 text-[#1F2937]">43.6332° N,</Text>
            <Text className="-mt-0.5 text-[15px] leading-6 text-[#1F2937]">
              -79.4186° W
            </Text>
          </MetricCard>
          <MetricCard label="Monitoring Radius">
            <Text className="text-[15px] leading-6 text-[#1F2937]">Precise</Text>
            <Text className="-mt-0.5 text-[15px] leading-6 text-[#1F2937]">
              Polygon
            </Text>
          </MetricCard>
        </View>
      </View>
    </View>
  );
}
