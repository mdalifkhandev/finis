import BackTitleHeader from "@/components/common/BackTitleHeader";
import TeamScreen from "@/components/company/team/TeamScreen";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const projectId = typeof id === "string" ? id : undefined;
  const { refreshing, onRefresh } = usePullToRefresh();

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <BackTitleHeader title="Team" onBack={() => router.back()} />
        <TeamScreen projectId={projectId} />
      </ScrollView>
    </SafeAreaView>
  );
}
