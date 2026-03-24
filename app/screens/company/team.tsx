import BackTitleHeader from "@/components/common/BackTitleHeader";
import TeamScreen from "@/components/company/team/TeamScreen";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <BackTitleHeader title="Team" onBack={() => router.back()} />
        <TeamScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
