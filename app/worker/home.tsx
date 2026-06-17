import { DEFAULT_AVATAR_URL } from "@/api/auth/auth.constants";
import { WorkerDashboardTask } from "@/api/worker/dashboard.api";
import { useCheckInWorkerMutation, useCheckOutWorkerMutation, useTodayAttendanceQuery } from "@/hooks/worker/attendance";
import { useWorkerProfileQuery } from "@/hooks/profile/profile";
import { useWorkerDashboardQuery } from "@/hooks/worker/dashboard";
import { emitGeofenceCheckIn, emitGeofenceCheckOut, emitGeofenceLocation, useWorkerGeofenceSocket } from "@/lib/worker-geofence-socket";
import { API_BASE_URL } from "@/lib/config";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "../../components/home/HomeHeader";
import SectionHeader from "../../components/home/SectionHeader";
import StatCard from "../../components/home/StatCard";
import WeeklyActivityItem from "../../components/home/WeeklyActivityItem";
import WorkerStatusCard from "../../components/home/WorkerStatusCard";
import WorkerTaskCard from "../../components/home/WorkerTaskCard";

function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl) {
    return DEFAULT_AVATAR_URL;
  }
  if (
    avatarUrl.startsWith("http://") ||
    avatarUrl.startsWith("https://") ||
    avatarUrl.startsWith("file://")
  ) {
    return avatarUrl;
  }
  return `${API_BASE_URL}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
}

const WEEKLY_ACTIVITY = [
  { day: "Monday", status: "8 hours", type: "completed" as const },
  {
    day: "Tuesday",
    status: "2h 34m (In Progress)",
    type: "in-progress" as const,
  },
  { day: "Wednesday", status: "Scheduled", type: "scheduled" as const },
];

export default function WorkerHome() {
  useWorkerGeofenceSocket();
  const { data: profile } = useWorkerProfileQuery();
  const {
    data: dashboard,
    isLoading,
    refetch,
    isRefetching,
  } = useWorkerDashboardQuery();
  const { data: attendance } = useTodayAttendanceQuery();
  const checkInMutation = useCheckInWorkerMutation();
  const checkOutMutation = useCheckOutWorkerMutation();
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveTrackingRef = useRef(false);
  const [attendanceAction, setAttendanceAction] = React.useState<"check-in" | "check-out" | null>(null);

  const avatarUrl = resolveAvatarUrl(profile?.avatarUrl);
  const displayName = profile?.fullName?.trim().split(" ")[0] || "Welcome Back";
  const subtitle = profile?.role ? `${profile.role}!` : "Worker!";
  const activeProjectId = dashboard?.todayTasks?.[0]?.project?.id;

  React.useEffect(() => {
    // console.log("[WorkerHome] dashboard API:", dashboard);
  }, [dashboard]);

  React.useEffect(() => {
    //  console.log("[WorkerHome] attendance API:", JSON.stringify(attendance,null,2));
  }, [attendance]);

  const todayTasksCount = dashboard?.stats?.todayTasksCount ?? 0;
  const completedToday = dashboard?.stats?.completedToday ?? 0;
  const isClockedIn = attendance?.status === "clocked_in";
  const resolvedProjectId = activeProjectId ?? profile?.companyMembers?.[0]?.projectId;

  const getClockInTime = () => {
    if (!isClockedIn || !attendance?.currentSessionStart) return undefined;
    return new Date(attendance.currentSessionStart).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stopLiveUpdates = () => {
    console.log("[WorkerHome] stopLiveUpdates");
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  const sendLocationUpdate = async (coords?: { latitude: number; longitude: number }) => {
    if (!liveTrackingRef.current) {
      console.log("[WorkerHome] sendLocationUpdate skipped: tracking not active");
      return;
    }

    const startedAt = Date.now();
    console.log("[WorkerHome] sendLocationUpdate start", {
      resolvedProjectId,
      hasCoords: Boolean(coords),
    });

    try {
      const current = coords
        ? { coords }
        : await (async () => {
            const Location = await import("expo-location");
            return Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
          })();

      console.log("[WorkerHome] sendLocationUpdate GPS ready", {
        elapsedMs: Date.now() - startedAt,
        lat: current.coords.latitude,
        lng: current.coords.longitude,
      });

      const payload = {
        lat: current.coords.latitude,
        lng: current.coords.longitude,
        ...(resolvedProjectId ? { projectId: resolvedProjectId } : {}),
      };

      console.log("[WorkerHome] emitGeofenceLocation", payload);
      emitGeofenceLocation(payload);
    } catch (error) {
      console.log("[WorkerHome] sendLocationUpdate error", error);
    }
  };

  const startLiveUpdates = () => {
    console.log("[WorkerHome] startLiveUpdates");
    stopLiveUpdates();
    locationIntervalRef.current = setInterval(() => {
      void sendLocationUpdate();
    }, 1000);
  };

  const handleCheckIn = async () => {
    if (checkInMutation.isPending || attendanceAction) return;
    setAttendanceAction("check-in");

    try {
      const startedAt = Date.now();
      console.log("[WorkerHome] check-in start", {
        resolvedProjectId,
        activeProjectId,
      });

      const Location = await import("expo-location");
      console.log("[WorkerHome] requestForegroundPermissionsAsync...");
      const permission = await Location.requestForegroundPermissionsAsync();
      console.log("[WorkerHome] location permission result", permission.status);
      if (permission.status !== "granted") {
        Alert.alert("Location permission required", "Please allow location access to check in.");
        return;
      }

      console.log("[WorkerHome] getCurrentPositionAsync...");
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log("[WorkerHome] GPS resolved for check-in", {
        elapsedMs: Date.now() - startedAt,
        lat: current.coords.latitude,
        lng: current.coords.longitude,
      });

      console.log("[WorkerHome] attendance.checkIn mutateAsync start");
      await checkInMutation.mutateAsync({
        lat: current.coords.latitude,
        lng: current.coords.longitude,
      });
      console.log("[WorkerHome] attendance.checkIn mutateAsync success");
      liveTrackingRef.current = true;

      const geofencePayload = {
        lat: current.coords.latitude,
        lng: current.coords.longitude,
        ...(resolvedProjectId ? { projectId: resolvedProjectId } : {}),
      };

      console.log("[WorkerHome] emitGeofenceCheckIn", geofencePayload);
      emitGeofenceCheckIn(geofencePayload);

      console.log("[WorkerHome] sendLocationUpdate after check-in");
      await sendLocationUpdate({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      startLiveUpdates();
    } finally {
      setAttendanceAction(null);
    }
  };

  const handleCheckOut = async () => {
    if (checkOutMutation.isPending || !isClockedIn || attendanceAction) return;
    setAttendanceAction("check-out");
    liveTrackingRef.current = false;
    stopLiveUpdates();

    try {
      const startedAt = Date.now();
      console.log("[WorkerHome] check-out start", {
        resolvedProjectId,
        activeProjectId,
      });

      const Location = await import("expo-location");
      console.log("[WorkerHome] getLastKnownPositionAsync...");
      const lastKnown = await Location.getLastKnownPositionAsync({});
      let currentLocation =
        lastKnown?.coords ?? null;

      if (!currentLocation) {
        console.log("[WorkerHome] getCurrentPositionAsync...");
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        currentLocation = current.coords;
      }

      if (!currentLocation) {
        console.log("[WorkerHome] checkout location unavailable, using fallback");
      }

      const lat = currentLocation?.latitude ?? 0;
      const lng = currentLocation?.longitude ?? 0;
      console.log("[WorkerHome] GPS resolved for check-out", {
        elapsedMs: Date.now() - startedAt,
        lat,
        lng,
      });

      console.log("[WorkerHome] attendance.checkOut mutateAsync start");
      await checkOutMutation.mutateAsync({
        lat,
        lng,
      });
      console.log("[WorkerHome] attendance.checkOut mutateAsync success");

      const geofencePayload = {
        lat,
        lng,
        ...(resolvedProjectId ? { projectId: resolvedProjectId } : {}),
      };

      console.log("[WorkerHome] emitGeofenceCheckOut", geofencePayload);
      emitGeofenceCheckOut(geofencePayload);
    } finally {
      setAttendanceAction(null);
    }
  };

  useEffect(() => {
    return () => stopLiveUpdates();
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <HomeHeader
          name={displayName}
          subtitle={subtitle}
          avatarUrl={avatarUrl}
          onPressBell={() => router.push("/screens/notifications")}
          onPressAvatar={() => router.push("/worker/profile")}
        />

        {isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1f3d5c" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading dashboard...
            </Text>
          </View>
        ) : (
          <>
            <View className="flex-row justify-between px-5 mt-6">
              <StatCard
                icon="trending-up"
                value={String(todayTasksCount)}
                label="Today`s Tasks"
              />
              <StatCard
                icon="people"
                value={String(completedToday)}
                label="Completed"
              />
            </View>

            <View className="mt-4">
              <WorkerStatusCard
                isClockedIn={isClockedIn}
                time={getClockInTime()}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                isCheckingIn={checkInMutation.isPending || attendanceAction === "check-in"}
                isCheckingOut={checkOutMutation.isPending || attendanceAction === "check-out"}
              />
            </View>

            <View className="mt-16">
              <SectionHeader
                title="Today`s Tasks "
                actionLabel="View All"
                onPressAction={() => {}}
              />
              <View className="mt-2">
                {dashboard?.todayTasks?.length ? (
                  dashboard.todayTasks.map((task: WorkerDashboardTask) => (
                    <WorkerTaskCard
                      key={task.id}
                      priority={task.priority?.toUpperCase() as any}
                      title={task.title}
                      location={`${task.project?.name || "Project"}${task.floor?.name ? " - " + task.floor.name : ""}`}
                      assignedAvatars={[]}
                      commentsCount={task._count?.reports || 0}
                      onPress={() =>
                        router.push({
                          pathname: "/screens/worker/viewtask",
                          params: { id: task.id },
                        })
                      }
                    />
                  ))
                ) : (
                  <View className="items-center py-4">
                    <Text className="text-slate-500 text-sm">
                      No tasks for today.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        <View className="mt-4 pb-10">
          <SectionHeader
            title="This Week"
            actionLabel="View All"
            onPressAction={() => {}}
          />
          <View className="mx-5 mt-2 rounded-3xl bg-white p-5 border border-slate-100 shadow-sm">
            {WEEKLY_ACTIVITY.map((item, index) => (
              <WeeklyActivityItem
                key={index}
                day={item.day}
                status={item.status}
                type={item.type}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
