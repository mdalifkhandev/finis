import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useWorkerProfileQuery } from "@/hooks/profile/profile";

const THEME = {
  colors: {
    background: "#F8FAFC",
    white: "#FFFFFF",
    textMain: "#0F172A",
    textSecondary: "#64748B",
    bluePrimary: "#3B82F6",
    border: "#E2E8F0",
  },
};

export default function WorkScheduleScreen() {
  const { data: profile, isLoading } = useWorkerProfileQuery();

  const schedules = profile?.workScheduleAssignments || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: THEME.colors.white,
          borderBottomWidth: 1,
          borderBottomColor: THEME.colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <Feather name="arrow-left" size={24} color={THEME.colors.textMain} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "700", color: THEME.colors.textMain }}>Work Schedule</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color={THEME.colors.bluePrimary} style={{ marginTop: 40 }} />
        ) : schedules.length > 0 ? (
          schedules.map((assignment: any) => (
            <View
              key={assignment.id}
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: THEME.colors.border,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", color: THEME.colors.textMain, marginBottom: 12 }}>
                {assignment.schedule?.name || "Regular Schedule"}
              </Text>
              
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Ionicons name="time-outline" size={20} color={THEME.colors.bluePrimary} />
                <Text style={{ marginLeft: 8, fontSize: 16, color: THEME.colors.textSecondary }}>
                  {assignment.schedule?.startTime} - {assignment.schedule?.endTime}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 8 }}>
                <Ionicons name="calendar-outline" size={20} color={THEME.colors.bluePrimary} style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 8, flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {assignment.schedule?.days?.map((day: string) => (
                    <View key={day} style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ color: '#4F46E5', fontSize: 13, fontWeight: '600' }}>{day}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons name="calendar-clear-outline" size={64} color="#CBD5E1" />
            <Text style={{ fontSize: 16, color: THEME.colors.textSecondary, marginTop: 16 }}>No schedule assigned.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
