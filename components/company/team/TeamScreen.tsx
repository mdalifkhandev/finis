import {
  useAddProjectManagerMutation,
  useRemoveProjectManagerMutation,
  useAvailableManagersQuery,
  useProjectManagersQuery,
} from "@/hooks/company/company";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import AddTeamMemberSheet, { TeamMemberOption } from "./AddTeamMemberSheet";
import TeamMemberCard from "./TeamMemberCard";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

type TeamScreenProps = {
  projectId?: string;
};

export default function TeamScreen({ projectId }: TeamScreenProps) {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [deletingManagerId, setDeletingManagerId] = useState<string | null>(null);

  const { data: managersData, isLoading: isLoadingTeam } =
    useProjectManagersQuery(projectId);
  const { data: availableManagersData, isLoading: isLoadingManagers } =
    useAvailableManagersQuery();
  const addManagerMutation = useAddProjectManagerMutation(projectId);
  const removeManagerMutation = useRemoveProjectManagerMutation(projectId);

  const selectedManagers = useMemo(() => {
    if (!managersData) return [];
    return managersData.map((m: any) => ({
      id: m.id,
      userId: m.userId || m.memberId,
      name: m.fullName || m.name,
      role: m.role || "Manager",
      email: m.email,
      phone: m.phone,
      avatarUrl: m.avatarUrl,
    }));
  }, [managersData]);

  const availableManagers = useMemo(() => {
    if (!availableManagersData) return [];
    const assignedUserIds = selectedManagers.map((m: any) => m.userId) || [];
    return availableManagersData
      .filter((m: any) => !assignedUserIds.includes(m.id))
      .map((m: any) => ({
        id: m.id,
        name: m.fullName,
        role: m.role || "Manager",
        email: m.email,
        phone: m.phone || "",
        avatarUrl: m.avatarUrl,
      }));
  }, [availableManagersData, selectedManagers]);

  const handleAddManager = (member: TeamMemberOption) => {
    addManagerMutation.mutate(member.id, {
      onSuccess: () => {
        setShowAddSheet(false);
      },
    });
  };

  const handleDeleteManager = (id: string) => {
    setDeletingManagerId(id);
  };

  const confirmDeleteManager = () => {
    if (!deletingManagerId) return;
    removeManagerMutation.mutate(deletingManagerId);
    setDeletingManagerId(null);
  };

  const handleOpenAddSheet = () => setShowAddSheet(true);

  const isLoading = isLoadingTeam || (showAddSheet && isLoadingManagers);

  return (
    <>
      <View className="mt-5 px-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[16px] font-medium text-[#283443]">
            Managers ({selectedManagers.length})
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenAddSheet}
            disabled={isLoading}
            className="h-[40px] min-w-[128px] flex-row items-center justify-center rounded-[8px] border border-[#D3D9E1] bg-[#FFFFFF] px-4"
          >
            {addManagerMutation.isPending ? (
              <ActivityIndicator size="small" color="#1F2937" />
            ) : (
              <>
                <Text className="mr-1 text-[18px] font-medium text-[#1F2937]">
                  +
                </Text>
                <Text className="text-[15px] font-medium text-[#1F2937]">
                  Add Managers
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {isLoadingTeam ? (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator size="large" color="#1d4f6d" />
            <Text className="mt-2 text-[14px] text-slate-500">
              Loading managers...
            </Text>
          </View>
        ) : (
          selectedManagers.map((manager: any) => (
            <TeamMemberCard
              key={manager.id}
              avatarUrl={manager.avatarUrl}
              name={manager.name}
              role={manager.role}
              email={manager.email}
              phone={manager.phone}
              onDelete={() => handleDeleteManager(manager.id)}
            />
          ))
        )}
      </View>

      <AddTeamMemberSheet
        visible={showAddSheet}
        title="Add Team Managers"
        members={availableManagers}
        onClose={() => setShowAddSheet(false)}
        onSelectMember={handleAddManager}
        isLoading={isLoadingManagers}
      />

      <DeleteConfirmationModal
        visible={!!deletingManagerId}
        title="Remove Manager"
        description="Are you sure you want to remove this manager from the project? This action cannot be undone."
        onClose={() => setDeletingManagerId(null)}
        onConfirm={confirmDeleteManager}
      />
    </>
  );
}
