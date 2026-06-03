import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkerTasksQuery } from "@/hooks/worker/tasks";
import { ActivityIndicator, RefreshControl } from "react-native";

const THEME = {
  colors: {
    background: "#F8FAFC",
    white: "#FFFFFF",
    textMain: "#0F172A",
    textSecondary: "#94A3B8",
    bluePrimary: "#3B82F6",
    blueBg: "#EFF6FF",
    greenSuccess: "#10B981",
    greenBg: "#ECFDF5",
    border: "#F1F5F9",
    progressTrack: "#F1F5F9",
  },
  spacing: {
    padding: 24,
    radius: 24,
  },
};



const TaskCard = ({ item }: { item: any }) => {
  const isDone = item.status === "completed";
  const statusColor = isDone
    ? THEME.colors.greenSuccess
    : THEME.colors.bluePrimary;
  const statusBg = isDone ? THEME.colors.greenBg : THEME.colors.blueBg;

  // Calculate days left
  let statusText = item.status ? item.status.replace("_", " ") : "In Progress";
  if (!isDone && item.dueDate) {
    const today = new Date();
    const due = new Date(item.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      statusText = `${diffDays} Days Left`;
    } else if (diffDays === 0) {
      statusText = "Due Today";
    } else {
      statusText = "Overdue";
    }
  }

  const reportsCount = item._count?.reports || 0;
  const progressValue = isDone ? 100 : (reportsCount > 0 ? 50 : 0);
  const progressText = `${reportsCount} Reports`;

  return (
    <View
      style={{
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.spacing.radius,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: THEME.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {/* Card Header: Badge & Menu */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: statusBg,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}
        >
          {isDone && (
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color={statusColor}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={{ color: statusColor, fontSize: 13, fontWeight: "700" }}>
            {statusText}
          </Text>
        </View>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name="more-horizontal"
            size={24}
            color={THEME.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Card Body: Info */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: THEME.colors.textMain,
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: THEME.colors.textSecondary,
            fontWeight: "500",
          }}
        >
          {item.description || "No description"}
        </Text>
      </View>

      {/* Card Footer: Progress Text */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="layers-outline"
            size={18}
            color={THEME.colors.textSecondary}
          />
          <Text
            style={{
              marginLeft: 8,
              color: THEME.colors.textSecondary,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {progressText}
          </Text>
        </View>
        <Text
          style={{
            color: THEME.colors.textSecondary,
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          {progressValue}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          height: 8,
          backgroundColor: THEME.colors.progressTrack,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${progressValue}%`,
            backgroundColor: THEME.colors.greenSuccess,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};

export default function WorkerTasks() {
  const { data, isLoading, refetch, isRefetching } = useWorkerTasksQuery();
  const tasks = data?.data || [];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* --- Custom Navigation Header --- */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          paddingHorizontal: 20,
          backgroundColor: THEME.colors.background,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 20 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name="chevron-left"
            size={32}
            color={THEME.colors.textMain}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: THEME.colors.textMain,
          }}
        >
          Task
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[THEME.colors.bluePrimary]}
          />
        }
      >
        {isLoading ? (
          <View style={{ marginTop: 100, alignItems: "center" }}>
            <ActivityIndicator size="large" color={THEME.colors.bluePrimary} />
          </View>
        ) : tasks.length === 0 ? (
          <View style={{ marginTop: 100, alignItems: "center" }}>
            <Text style={{ color: THEME.colors.textSecondary, fontSize: 16 }}>No tasks found.</Text>
          </View>
        ) : (
          tasks.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/screens/worker/taskdetails?id=${item.id}`)}
            >
              <TaskCard item={item} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
