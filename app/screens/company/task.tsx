import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskScreen from "@/components/company/task/TaskScreen";
import { useAdminProjectNamesQuery } from "@/hooks/admin/admin";
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

export default function TaskRoute() {
  const { id, projectId } = useLocalSearchParams<{ id?: string; projectId?: string }>();
  const activeProjectId = projectId || id;
  const queryClient = useQueryClient();
  const { data: projectNames, isLoading } = useAdminProjectNamesQuery();
  const [isProjectSheetVisible, setIsProjectSheetVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(activeProjectId);

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  });

  const selectedProjectName = useMemo(() => {
    if (!selectedProjectId) return undefined;
    return projectNames?.find((project) => project.id === selectedProjectId)?.name;
  }, [projectNames, selectedProjectId]);

  const handleOpenProjectSheet = () => {
    if (activeProjectId) {
      router.push({
        pathname: "/screens/company/createtask",
        params: { projectId: activeProjectId },
      });
      return;
    }

    setSelectedProjectId(projectNames?.[0]?.id);
    setIsProjectSheetVisible(true);
  };

  const handleConfirmProject = () => {
    if (!selectedProjectId) return;
    setIsProjectSheetVisible(false);
    router.push({
      pathname: "/screens/company/createtask",
      params: { projectId: selectedProjectId },
    });
  };

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
        <BackTitleHeader title="Task" onBack={() => router.back()} />
        <TaskScreen projectId={activeProjectId} onCreateTaskPress={handleOpenProjectSheet} />
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

            {selectedProjectName ? (
              <Text className="mb-3 text-[14px] text-[#66707B]">
                Selected: {selectedProjectName}
              </Text>
            ) : null}

            <ScrollView showsVerticalScrollIndicator={false}>
              {isLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="small" color="#1d4f6d" />
                </View>
              ) : (projectNames ?? []).length ? (
                (projectNames ?? []).map((project) => {
                  const isSelected = selectedProjectId === project.id;
                  return (
                    <TouchableOpacity
                      key={project.id}
                      activeOpacity={0.85}
                      onPress={() => setSelectedProjectId(project.id)}
                      className={`mb-3 rounded-[12px] border px-4 py-4 ${
                        isSelected
                          ? "border-[#1E5371] bg-[#EAF3F7]"
                          : "border-[#D7DDE4] bg-[#F8FAFC]"
                      }`}
                    >
                      <Text className="text-[16px] font-medium text-[#1F2328]">
                        {project.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="items-center py-8">
                  <Text className="text-[14px] text-[#66707B]">
                    No projects found.
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!selectedProjectId}
              onPress={handleConfirmProject}
              className={`mt-4 h-[48px] items-center justify-center rounded-[12px] ${
                selectedProjectId ? "bg-[#1E5371]" : "bg-[#AAB7C2]"
              }`}
            >
              <Text className="text-[16px] font-semibold text-white">
                OK
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
