import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

const THEME = {
  colors: {
    background: "#F8FAFC",
    white: "#FFFFFF",
    textMain: "#0F172A",
    textSecondary: "#64748B",
    bluePrimary: "#3B82F6",
    border: "#E2E8F0",
    green: "#22C55E",
    red: "#EF4444",
  },
};

export default function AttendanceHistoryScreen() {
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["worker", "attendance", "history"],
    queryFn: async () => {
      const { data } = await api.get("/worker/attendance/history?page=1&limit=50");
      if (!data.success) throw new Error(data.message);
      return data.data; // data.data.data has the array based on NestJS Pagination, let's assume data.data.data
    },
  });

  const attendances = attendanceData?.data || attendanceData || [];

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
        <Text style={{ fontSize: 20, fontWeight: "700", color: THEME.colors.textMain }}>Attendance History</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color={THEME.colors.bluePrimary} style={{ marginTop: 40 }} />
        ) : attendances.length > 0 ? (
          attendances.map((session: any) => {
            const date = new Date(session.checkInTime);
            return (
              <View
                key={session.id}
                style={{
                  backgroundColor: THEME.colors.white,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: THEME.colors.border,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ backgroundColor: '#EEF2FF', padding: 12, borderRadius: 12, marginRight: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#4F46E5', textAlign: 'center' }}>
                    {date.getDate()}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#4F46E5', textAlign: 'center', textTransform: 'uppercase' }}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: THEME.colors.textMain, marginBottom: 4 }}>
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons name="clock-in" size={16} color={THEME.colors.green} />
                    <Text style={{ fontSize: 14, color: THEME.colors.textSecondary, marginLeft: 4, marginRight: 12 }}>
                      {session.checkInTime ? new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </Text>
                    <MaterialCommunityIcons name="clock-out" size={16} color={THEME.colors.red} />
                    <Text style={{ fontSize: 14, color: THEME.colors.textSecondary, marginLeft: 4 }}>
                      {session.checkOutTime ? new Date(session.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 12, color: THEME.colors.textSecondary, marginBottom: 4 }}>Work Time</Text>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: THEME.colors.textMain }}>
                    {session.totalHours ? `${Number(session.totalHours).toFixed(1)}h` : '--'}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <MaterialCommunityIcons name="clipboard-text-clock-outline" size={64} color="#CBD5E1" />
            <Text style={{ fontSize: 16, color: THEME.colors.textSecondary, marginTop: 16 }}>No attendance history found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
