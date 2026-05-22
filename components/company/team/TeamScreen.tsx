import {
  useAddProjectManagerMutation,
  useRemoveProjectManagerMutation,
  useAvailableManagersQuery,
  useProjectManagersQuery,
  useAvailableWorkersQuery,
  useAddProjectWorkerMutation,
  useAssignedWorkersQuery,
  useRemoveProjectWorkerMutation,
} from "@/hooks/company/company";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import AddTeamMemberSheet, { TeamMemberOption } from "./AddTeamMemberSheet";
import TeamMemberCard from "./TeamMemberCard";
import TeamWorkerCard from "./TeamWorkerCard";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

type TeamScreenProps = {
  projectId?: string;
};

export default function TeamScreen({ projectId }: TeamScreenProps) {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
  const [deletingManagerId, setDeletingManagerId] = useState<string | null>(null);
  const [deletingWorkerId, setDeletingWorkerId] = useState<string | null>(null);

  const { data: managersData, isLoading: isLoadingTeam } =
    useProjectManagersQuery(projectId);
  const { data: availableManagersData, isLoading: isLoadingManagers } =
    useAvailableManagersQuery();
  const { data: availableWorkersData, isLoading: isLoadingWorkers } =
    useAvailableWorkersQuery();
  
  const addManagerMutation = useAddProjectManagerMutation(projectId);
  const removeManagerMutation = useRemoveProjectManagerMutation(projectId);
  const addWorkerMutation = useAddProjectWorkerMutation(projectId);
  const removeWorkerMutation = useRemoveProjectWorkerMutation(projectId);

  const { data: assignedWorkersData, isLoading: isLoadingAssignedWorkers } =
    useAssignedWorkersQuery(projectId, activeManagerId);

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

  const activeManager = useMemo(
    () =>
      selectedManagers.find((manager: any) => manager.id === activeManagerId) ??
      null,
    [activeManagerId, selectedManagers],
  );

  const activeWorkers = useMemo(() => {
    if (!assignedWorkersData) return [];
    return assignedWorkersData.map((w: any) => ({
      id: w.id,
      userId: w.memberId, // From API response
      name: w.fullName,
      role: w.role || "Worker",
      email: w.email,
      phone: w.phone || "",
      avatarUrl: w.avatarUrl,
    }));
  }, [assignedWorkersData]);

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

  const availableWorkers = useMemo(() => {
    if (!availableWorkersData) return [];
    // If you have a way to filter assigned workers, do it here. 
    const assignedWorkerUserIds = activeWorkers.map((w: any) => w.userId) || [];
    return availableWorkersData
      .filter((m: any) => !assignedWorkerUserIds.includes(m.id))
      .map((m: any) => ({
      id: m.id,
      name: m.fullName,
      role: m.role || "Worker",
      email: m.email,
      phone: m.phone || "",
      avatarUrl: m.avatarUrl,
    }));
  }, [availableWorkersData]);

  const handleAddManager = (member: TeamMemberOption) => {
    addManagerMutation.mutate(member.id, {
      onSuccess: () => {
        setShowAddSheet(false);
      },
    });
  };

  const handleAddWorker = (member: TeamMemberOption) => {
    if (!activeManager) return;
    addWorkerMutation.mutate({
      userId: member.id,
      managerId: activeManager.id,
    }, {
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
    if (deletingManagerId === activeManagerId) {
      setActiveManagerId(null);
    }
  };

  const handleDeleteWorker = (workerId: string) => {
    setDeletingWorkerId(workerId);
  };

  const confirmDeleteWorker = () => {
    if (!deletingWorkerId) return;
    removeWorkerMutation.mutate(deletingWorkerId);
    setDeletingWorkerId(null);
  };

  const handleOpenAddSheet = () => setShowAddSheet(true);

  const headerCount = activeManager
    ? activeWorkers.length
    : selectedManagers.length;
  const headerLabel = activeManager ? "Workers" : "Managers";
  const buttonLabel = activeManager ? "Add Worker" : "Add Managers";
  const sheetTitle = activeManager ? "Add Team Worker" : "Add Team Managers";
  const sheetMembers = activeManager ? availableWorkers : availableManagers;
  const handleSelectMember = activeManager ? handleAddWorker : handleAddManager;

  const isLoading = isLoadingTeam || isLoadingAssignedWorkers || (showAddSheet && (activeManager ? isLoadingWorkers : isLoadingManagers));

  return (
    <>
      <View className="mt-5 px-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[16px] font-medium text-[#283443]">
            {headerLabel} ({headerCount})
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenAddSheet}
            disabled={isLoading}
            className="h-[40px] min-w-[128px] flex-row items-center justify-center rounded-[8px] border border-[#D3D9E1] bg-[#FFFFFF] px-4"
          >
            {addManagerMutation.isPending || addWorkerMutation.isPending ? (
              <ActivityIndicator size="small" color="#1F2937" />
            ) : (
              <>
                <Text className="mr-1 text-[18px] font-medium text-[#1F2937]">
                  +
                </Text>
                <Text className="text-[15px] font-medium text-[#1F2937]">
                  {buttonLabel}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {isLoadingTeam ? (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator size="large" color="#1d4f6d" />
            <Text className="mt-2 text-[14px] text-slate-500">
              Loading team...
            </Text>
          </View>
        ) : activeManager ? (
          <>
            <TeamMemberCard
              avatarUrl={activeManager.avatarUrl}
              name={activeManager.name}
              role={activeManager.role}
              email={activeManager.email}
              phone={activeManager.phone}
              onPress={() => setActiveManagerId(null)}
              hideDelete
            />

            <Text className="mt-3 text-[15px] font-medium text-[#283443]">
              All Worker
            </Text>

            {activeWorkers.map((worker: any) => (
              <TeamWorkerCard
                key={worker.id}
                avatarUrl={worker.avatarUrl}
                name={worker.name}
                role={worker.role}
                onDelete={() => handleDeleteWorker(worker.id)}
              />
            ))}
          </>
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
              onPress={() => setActiveManagerId(manager.id)}
            />
          ))
        )}
      </View>

      <AddTeamMemberSheet
        visible={showAddSheet}
        title={sheetTitle}
        members={sheetMembers}
        onClose={() => setShowAddSheet(false)}
        onSelectMember={handleSelectMember}
        isLoading={activeManager ? isLoadingWorkers : isLoadingManagers}
      />

      <DeleteConfirmationModal
        visible={!!deletingManagerId}
        title="Remove Manager"
        description="Are you sure you want to remove this manager from the project? This action cannot be undone."
        onClose={() => setDeletingManagerId(null)}
        onConfirm={confirmDeleteManager}
      />

      <DeleteConfirmationModal
        visible={!!deletingWorkerId}
        title="Remove Worker"
        description="Are you sure you want to remove this worker from the project? This action cannot be undone."
        onClose={() => setDeletingWorkerId(null)}
        onConfirm={confirmDeleteWorker}
      />
    </>
  );
}
