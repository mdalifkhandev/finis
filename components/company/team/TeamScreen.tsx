import React, { useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import AddTeamMemberSheet, { TeamMemberOption } from "./AddTeamMemberSheet";
import TeamMemberCard from "./TeamMemberCard";
import TeamWorkerCard from "./TeamWorkerCard";
import {
  useAvailableManagersQuery,
  useProjectTeamQuery,
  useAddProjectManagerMutation,
} from "@/hooks/company/company";

// Keep workers hardcoded for now as requested
const allWorkers: TeamMemberOption[] = [
  {
    id: "worker-emily",
    name: "Emily Chen",
    role: "Electrician",
    email: "emily@example.com",
    phone: "(555) 456-7890",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "worker-sophia",
    name: "Sophia Lee",
    role: "Electrician",
    email: "sophia@example.com",
    phone: "(555) 345-1200",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "worker-daniel",
    name: "Daniel Ross",
    role: "Safety Officer",
    email: "daniel@example.com",
    phone: "(555) 890-1122",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
  },
];

const initialAssignments: Record<string, string[]> = {
  // Hardcoded assignments for demo purposes
};

type TeamScreenProps = {
  projectId?: string;
};

export default function TeamScreen({ projectId }: TeamScreenProps) {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
  const [workerAssignments, setWorkerAssignments] =
    useState<Record<string, string[]>>(initialAssignments);

  const { data: teamData, isLoading: isLoadingTeam } = useProjectTeamQuery(projectId);
  const { data: availableManagersData, isLoading: isLoadingManagers } = useAvailableManagersQuery();
  const addManagerMutation = useAddProjectManagerMutation(projectId);

  const selectedManagers = useMemo(() => {
    if (!teamData) return [];
    return teamData.managers.map((m) => ({
      id: m.userId,
      name: m.user.fullName,
      role: m.role || "Manager",
      email: m.user.email,
      phone: m.user.phone,
      avatarUrl: m.user.avatarUrl,
    }));
  }, [teamData]);

  const activeManager = useMemo(
    () =>
      selectedManagers.find((manager) => manager.id === activeManagerId) ??
      null,
    [activeManagerId, selectedManagers],
  );

  const activeWorkers = useMemo(() => {
    if (!activeManagerId) {
      return [];
    }
    const assignedIds = workerAssignments[activeManagerId] ?? [];
    return allWorkers.filter((worker) => assignedIds.includes(worker.id));
  }, [activeManagerId, workerAssignments]);

  const availableManagers = useMemo(() => {
    if (!availableManagersData) return [];
    const assignedUserIds = teamData?.managers.map((m) => m.userId) || [];
    return availableManagersData
      .filter((m) => !assignedUserIds.includes(m.id))
      .map((m) => ({
        id: m.id,
        name: m.fullName,
        role: m.role || "Manager",
        email: m.email,
        phone: m.phone || "",
        avatarUrl: m.avatarUrl,
      }));
  }, [availableManagersData, teamData]);

  const availableWorkers = useMemo(() => {
    if (!activeManagerId) {
      return [];
    }
    const assignedIds = workerAssignments[activeManagerId] ?? [];
    return allWorkers.filter((worker) => !assignedIds.includes(worker.id));
  }, [activeManagerId, workerAssignments]);

  const handleAddManager = (member: TeamMemberOption) => {
    addManagerMutation.mutate(member.id, {
      onSuccess: () => {
        setShowAddSheet(false);
      },
    });
  };

  const handleAddWorker = (worker: TeamMemberOption) => {
    if (!activeManagerId) return;
    setWorkerAssignments((previous) => ({
      ...previous,
      [activeManagerId]: [...(previous[activeManagerId] ?? []), worker.id],
    }));
    setShowAddSheet(false);
  };

  const handleDeleteManager = (id: string) => {
    // Optimistic or real deletion logic can be added here once API is available
    console.log("Delete manager not implemented yet");
  };

  const handleDeleteWorker = (workerId: string) => {
    if (!activeManagerId) return;
    setWorkerAssignments((previous) => ({
      ...previous,
      [activeManagerId]: (previous[activeManagerId] ?? []).filter(
        (id) => id !== workerId,
      ),
    }));
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

  const isLoading = isLoadingTeam || (showAddSheet && isLoadingManagers);

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
            {addManagerMutation.isPending ? (
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
            <Text className="mt-2 text-[14px] text-slate-500">Loading team...</Text>
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

            {activeWorkers.map((worker) => (
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
          selectedManagers.map((manager) => (
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
        isLoading={isLoadingManagers}
      />
    </>
  );
}
