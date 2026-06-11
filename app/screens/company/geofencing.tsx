import BackTitleHeader from "@/components/common/BackTitleHeader";
import GeofenceMapCard from "@/components/company/geofencing/GeofenceMapCard";
import GeofencingSummaryCard from "@/components/company/geofencing/GeofencingSummaryCard";
import LiveTrackerCard from "@/components/company/geofencing/LiveTrackerCard";
import LocationLogsCard from "@/components/company/geofencing/LocationLogsCard";
import ZoneConfigurationCard from "@/components/company/geofencing/ZoneConfigurationCard";
import ZoneViolationAlertCard from "@/components/company/geofencing/ZoneViolationAlertCard";
import { LocationLog } from "@/components/company/geofencing/types";
import { useAdminProjectsQuery } from "@/hooks/admin/admin";
import {
  useCreateProjectGeofenceMutation,
  useProjectGeofenceLocationLogsQuery,
  useProjectGeofenceTimeSummaryQuery,
  useProjectGeofenceViolationsQuery,
  useProjectGeofencesQuery,
  useUpdateProjectGeofenceMutation,
} from "@/hooks/company/company";
import { usePullToRefresh } from "@/hooks/common/usePullToRefresh";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GeofencingRoute() {
  const { id: companyIdParam } = useLocalSearchParams<{ id?: string }>();
  const companyId = typeof companyIdParam === "string" ? companyIdParam : undefined;
  const { data: projects = [], isLoading: projectsLoading } = useAdminProjectsQuery();
  const [isProjectSheetVisible, setIsProjectSheetVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [draftPoints, setDraftPoints] = useState<Array<{ lat: number; lng: number }>>([]);
  const queryClient = useQueryClient();

  const visibleProjects = React.useMemo(() => {
    if (!companyId) {
      return projects;
    }

    return projects.filter((project) => project.company?.id === companyId);
  }, [companyId, projects]);

  React.useEffect(() => {
    if (visibleProjects.length === 0) {
      setSelectedProjectId(undefined);
      setDraftPoints([]);
      return;
    }

    const selectedProjectExists = visibleProjects.some((project) => project.id === selectedProjectId);

    if (!selectedProjectId || !selectedProjectExists) {
      setSelectedProjectId(visibleProjects[0].id);
      setDraftPoints([]);
    }
  }, [visibleProjects, selectedProjectId]);

  const selectedProject = visibleProjects.find((project) => project.id === selectedProjectId);
  const geofencesQuery = useProjectGeofencesQuery(selectedProjectId);
  const logsQuery = useProjectGeofenceLocationLogsQuery(selectedProjectId);
  const violationsQuery = useProjectGeofenceViolationsQuery(selectedProjectId);
  const summaryQuery = useProjectGeofenceTimeSummaryQuery(selectedProjectId);
  const createGeofenceMutation = useCreateProjectGeofenceMutation(selectedProjectId);
  const updateGeofenceMutation = useUpdateProjectGeofenceMutation(selectedProjectId);

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await Promise.all([
      geofencesQuery.refetch(),
      logsQuery.refetch(),
      violationsQuery.refetch(),
      summaryQuery.refetch(),
      queryClient.invalidateQueries({ queryKey: ["project", "geofences"] }),
    ]);
  });

  const logs: LocationLog[] = useMemo(() => {
    return (logsQuery.data?.data ?? []).map((log: any) => ({
      name: log.worker.fullName,
      time: new Date(log.loggedAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      location: `${log.lat.toFixed(4)}, ${log.lng.toFixed(4)}`,
      status: log.eventType.toLowerCase().includes("check") ? "Check In" : "Tracking",
    }));
  }, [logsQuery.data]);

  const selectedGeofence = useMemo(() => {
    const geofences = geofencesQuery.data ?? [];
    return geofences.find((geofence) => geofence.isActive) ?? geofences[0];
  }, [geofencesQuery.data]);

  

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1f3d5c"
            colors={["#1f3d5c"]}
          />
        }
      >
        <BackTitleHeader title="Geofencing" onBack={() => router.back()} />

        <GeofencingSummaryCard
          onAddNewZonePress={() => {
            if (!selectedProjectId) {
              setIsProjectSheetVisible(true);
              return;
            }
          }}
          onProjectPress={() => setIsProjectSheetVisible(true)}
          name={selectedProject?.name}
        />
        <View className="px-5 pt-2">
          <Text className="text-[14px] text-[#66707B]">
            Tap on the map to draw your zone. Use Undo/Clear if needed.
          </Text>
        </View>

        <GeofenceMapCard
          projectName={selectedProject?.name}
          projectSite={selectedProject?.location}
          initialPolygonCoords={selectedGeofence?.polygonCoords ?? []}
          onPolygonChange={setDraftPoints}
        />

        {selectedProjectId ? (
          <View className="px-5 pt-3">
            <Text className="mb-2 text-[12px] text-[#66707B]">
              {draftPoints.length >= 3
                ? `${draftPoints.length} points selected.`
                : "Select at least 3 points to enable save."}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={draftPoints.length < 3 || createGeofenceMutation.isPending}
              onPress={() => {
                if (!selectedProjectId || draftPoints.length < 3) {
                  return;
                }

                const zonePayload = {
                  zoneName: `${selectedProject?.name ?? "Selected Project"} Zone`,
                  polygonCoords: draftPoints,
                };

                if (selectedGeofence?.id) {
                  void updateGeofenceMutation.mutateAsync({
                    geofenceId: selectedGeofence.id,
                    payload: zonePayload,
                  }).then(() => {
                    setDraftPoints([]);
                  });
                  return;
                }

                void createGeofenceMutation.mutateAsync(zonePayload).then(() => {
                  setDraftPoints([]);
                });
              }}
              className={`h-[48px] items-center justify-center rounded-[12px] ${
                draftPoints.length >= 3 &&
                !createGeofenceMutation.isPending &&
                !updateGeofenceMutation.isPending
                  ? "bg-[#1D5478]"
                  : "bg-[#AAB7C2]"
              }`}
            >
              <Text className="text-[15px] font-semibold text-white">
                {createGeofenceMutation.isPending || updateGeofenceMutation.isPending
                  ? "Saving..."
                  : "Save Zone"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <ZoneConfigurationCard />
        <LiveTrackerCard />
        <LocationLogsCard logs={logs} />
        <ZoneViolationAlertCard />
      </ScrollView>

      <Modal
        visible={isProjectSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsProjectSheetVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/35"
          onPress={() => setIsProjectSheetVisible(false)}
        >
          <Pressable
            className="max-h-[78%] rounded-t-[24px] bg-white px-5 pb-6 pt-4"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-semibold text-[#1F2328]">
                Select Project
              </Text>
              <TouchableOpacity onPress={() => setIsProjectSheetVisible(false)}>
                <Text className="text-[15px] font-medium text-[#66707B]">
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {projectsLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="small" color="#1d4f6d" />
                </View>
              ) : (
                visibleProjects.map((project) => {
                  const isSelected = selectedProjectId === project.id;
                  return (
                    <TouchableOpacity
                      key={project.id}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedProjectId(project.id);
                        setIsProjectSheetVisible(false);
                        setDraftPoints([]);
                      }}
                      className={`mb-3 rounded-[12px] border px-4 py-4 ${
                        isSelected
                          ? "border-[#1E5371] bg-[#EAF3F7]"
                          : "border-[#D7DDE4] bg-[#F8FAFC]"
                      }`}
                    >
                      <Text className="text-[16px] font-medium text-[#1F2328]">
                        {project.name}
                      </Text>
                      <Text className="mt-0.5 text-[13px] text-[#66707B]">
                        {project.location}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
