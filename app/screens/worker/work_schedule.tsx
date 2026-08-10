import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Platform, Alert, KeyboardAvoidingView, RefreshControl } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useWorkerProfileQuery } from "@/hooks/profile/profile";
import { useSubmitTimeAdjustmentMutation } from "@/hooks/manager/time-adjustments";

const THEME = {
  colors: {
    background: "#F8FAFC",
    white: "#FFFFFF",
    textMain: "#0F172A",
    textSecondary: "#64748B",
    bluePrimary: "#1f3d5c",
    border: "#E2E8F0",
  },
};

export default function WorkScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading, refetch } = useWorkerProfileQuery();
  const schedules = profile?.workScheduleAssignments || [];
  const pendingRequests = profile?.timeAdjustments || [];
  const hasPending = pendingRequests.length > 0;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const submitMutation = useSubmitTimeAdjustmentMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [requestType, setRequestType] = useState<"check_in" | "check_out">("check_in");
  const [adjustedTime, setAdjustedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reason, setReason] = useState("");

  const openAdjustmentModal = (assignment: any) => {
    setSelectedSchedule(assignment);
    setRequestType("check_in");
    setAdjustedTime(new Date());
    setReason("");
    setModalVisible(true);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setAdjustedTime(selectedDate);
  };

  const handleSubmit = () => {
    if (!selectedSchedule) return;

    const originalTimeStr = requestType === "check_in" 
      ? selectedSchedule.schedule?.startTime 
      : selectedSchedule.schedule?.endTime;

    // Convert "08:00 AM" to full ISO date for the backend
    const parseTime = (timeStr: string) => {
      if (!timeStr) return new Date().toISOString();
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier?.toLowerCase() === 'pm') hours = (parseInt(hours, 10) + 12).toString();
      const d = new Date();
      d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return d.toISOString();
    };

    submitMutation.mutate(
      {
        date: new Date().toISOString(),
        requestType,
        originalTime: parseTime(originalTimeStr),
        adjustedTime: adjustedTime.toISOString(),
        reason,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Time adjustment request submitted successfully.");
          setModalVisible(false);
        },
        onError: (err: any) => {
          Alert.alert("Error", err.message || "Failed to submit request.");
        }
      }
    );
  };

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

      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME.colors.bluePrimary]} tintColor={THEME.colors.bluePrimary} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={THEME.colors.bluePrimary} style={{ marginTop: 40 }} />
        ) : schedules.length > 0 ? (
          schedules.map((assignment: any) => {
            const isPendingForThisSchedule = pendingRequests.some((req: any) => {
              const reqTimeStr = new Date(req.originalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
              const normalizedReq = reqTimeStr.replace(/^0/, '');
              const normalizedStart = (assignment.schedule?.startTime || '').replace(/^0/, '');
              const normalizedEnd = (assignment.schedule?.endTime || '').replace(/^0/, '');
              return normalizedReq === normalizedStart || normalizedReq === normalizedEnd;
            });

            return (
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
                  {(assignment.schedule?.name || "Regular Schedule").replace(/ \(Adjusted\)/g, '')}
                  {assignment.schedule?.name?.includes('(Adjusted)') ? ' (Adjusted)' : ''}
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

                <TouchableOpacity 
                  disabled={isPendingForThisSchedule}
                  onPress={() => openAdjustmentModal(assignment)}
                  style={{ marginTop: 16, backgroundColor: isPendingForThisSchedule ? THEME.colors.textSecondary : THEME.colors.bluePrimary, padding: 12, borderRadius: 8, alignItems: "center" }}
                >
                  <Text style={{ color: THEME.colors.white, fontWeight: "600", fontSize: 14 }}>
                    {isPendingForThisSchedule ? "Adjustment Request Pending" : "Request Time Adjustment"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons name="calendar-clear-outline" size={64} color="#CBD5E1" />
            <Text style={{ fontSize: 16, color: THEME.colors.textSecondary, marginTop: 16 }}>No schedule assigned.</Text>
          </View>
        )}
      </ScrollView>

      {/* Time Adjustment Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" statusBarTranslucent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
            <View style={{ backgroundColor: THEME.colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Math.max(insets.bottom, 24) }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: THEME.colors.textMain }}>Request Adjustment</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", marginBottom: 16, gap: 12 }}>
              <TouchableOpacity 
                style={{ flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: requestType === "check_in" ? THEME.colors.bluePrimary : THEME.colors.border, backgroundColor: requestType === "check_in" ? "#EEF2FF" : THEME.colors.white, alignItems: "center" }}
                onPress={() => setRequestType("check_in")}
              >
                <Text style={{ fontWeight: "600", color: requestType === "check_in" ? THEME.colors.bluePrimary : THEME.colors.textSecondary }}>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: requestType === "check_out" ? THEME.colors.bluePrimary : THEME.colors.border, backgroundColor: requestType === "check_out" ? "#EEF2FF" : THEME.colors.white, alignItems: "center" }}
                onPress={() => setRequestType("check_out")}
              >
                <Text style={{ fontWeight: "600", color: requestType === "check_out" ? THEME.colors.bluePrimary : THEME.colors.textSecondary }}>Check Out</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, fontWeight: "600", color: THEME.colors.textMain, marginBottom: 8 }}>New Adjusted Time</Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={adjustedTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                style={{ marginBottom: 16 }}
              />
            ) : (
              <>
                <TouchableOpacity 
                  style={{ padding: 12, borderWidth: 1, borderColor: THEME.colors.border, borderRadius: 8, marginBottom: 16, alignItems: "center" }}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={{ color: THEME.colors.textMain }}>{adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={adjustedTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </>
            )}

            <Text style={{ fontSize: 14, fontWeight: "600", color: THEME.colors.textMain, marginBottom: 8 }}>Reason</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: THEME.colors.border, borderRadius: 8, padding: 12, color: THEME.colors.textMain, marginBottom: 24, textAlignVertical: 'top' }}
              placeholder="Why do you need this adjustment?"
              placeholderTextColor="#94A3B8"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={submitMutation.isPending}
              style={{ backgroundColor: THEME.colors.bluePrimary, padding: 16, borderRadius: 8, alignItems: "center" }}
            >
              {submitMutation.isPending ? (
                <ActivityIndicator color={THEME.colors.white} />
              ) : (
                <Text style={{ color: THEME.colors.white, fontWeight: "600", fontSize: 16 }}>Submit Request</Text>
              )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
