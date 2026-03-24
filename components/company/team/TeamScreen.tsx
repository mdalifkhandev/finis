import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AddTeamMemberSheet, { TeamMemberOption } from "./AddTeamMemberSheet";
import TeamMemberCard from "./TeamMemberCard";
import TeamWorkerCard from "./TeamWorkerCard";

const allManagers: TeamMemberOption[] = [
  {
    id: "john",
    name: "John Smith",
    role: "Project Manager",
    email: "john@example.com",
    phone: "(555) 123-4567",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    role: "Site Engineer",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    avatarUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "mike",
    name: "Mike Davis",
    role: "Foreman",
    email: "mike@example.com",
    phone: "(555) 345-6789",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "emily",
    name: "Emily Chen",
    role: "Safety Officer",
    email: "emily@example.com",
    phone: "(555) 456-7890",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "lisa",
    name: "Rokeya Sultana",
    role: "Operations Lead",
    email: "rokeya@example.com",
    phone: "(555) 654-7890",
    avatarUrl:
      "https://images.unsplash.com/photo-1542204625-de293a501df4?q=80&w=256&auto=format&fit=crop",
  },
];

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
  {
    id: "worker-maria",
    name: "Maria Garcia",
    role: "Foreman",
    email: "maria@example.com",
    phone: "(555) 221-9988",
    avatarUrl:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "worker-jacob",
    name: "Jacob Miller",
    role: "Safety Officer",
    email: "jacob@example.com",
    phone: "(555) 112-3344",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
  },
];

const initialAssignments: Record<string, string[]> = {
  john: [
    "worker-emily",
    "worker-sophia",
    "worker-daniel",
    "worker-maria",
    "worker-jacob",
  ],
  sarah: ["worker-sophia", "worker-daniel"],
  mike: ["worker-emily", "worker-maria"],
  emily: ["worker-jacob"],
  lisa: ["worker-daniel", "worker-jacob"],
};

export default function TeamScreen() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
  const [managerIds, setManagerIds] = useState<string[]>([
    "john",
    "sarah",
    "mike",
    "emily",
    "lisa",
  ]);
  const [workerAssignments, setWorkerAssignments] =
    useState<Record<string, string[]>>(initialAssignments);

  const selectedManagers = useMemo(
    () => allManagers.filter((manager) => managerIds.includes(manager.id)),
    [managerIds],
  );

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

  const availableManagers = useMemo(
    () => allManagers.filter((manager) => !managerIds.includes(manager.id)),
    [managerIds],
  );

  const availableWorkers = useMemo(() => {
    if (!activeManagerId) {
      return [];
    }

    const assignedIds = workerAssignments[activeManagerId] ?? [];
    return allWorkers.filter((worker) => !assignedIds.includes(worker.id));
  }, [activeManagerId, workerAssignments]);

  const handleAddManager = (member: TeamMemberOption) => {
    setManagerIds((previous) =>
      previous.includes(member.id) ? previous : [...previous, member.id],
    );
    setWorkerAssignments((previous) => ({
      ...previous,
      [member.id]: previous[member.id] ?? [],
    }));
    setShowAddSheet(false);
  };

  const handleAddWorker = (worker: TeamMemberOption) => {
    if (!activeManagerId) {
      return;
    }

    setWorkerAssignments((previous) => ({
      ...previous,
      [activeManagerId]: [...(previous[activeManagerId] ?? []), worker.id],
    }));
    setShowAddSheet(false);
  };

  const handleDeleteManager = (id: string) => {
    setManagerIds((previous) =>
      previous.filter((managerId) => managerId !== id),
    );
    setWorkerAssignments((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });

    if (activeManagerId === id) {
      setActiveManagerId(null);
    }
  };

  const handleDeleteWorker = (workerId: string) => {
    if (!activeManagerId) {
      return;
    }

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
            className="h-[40px] min-w-[128px] flex-row items-center justify-center rounded-[8px] border border-[#D3D9E1] bg-[#FFFFFF] px-4"
          >
            <Text className="mr-1 text-[18px] font-medium text-[#1F2937]">
              +
            </Text>
            <Text className="text-[15px] font-medium text-[#1F2937]">
              {buttonLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {activeManager ? (
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
      />
    </>
  );
}
