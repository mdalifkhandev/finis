import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AddTeamMemberSheet, { TeamMemberOption } from "./AddTeamMemberSheet";
import TeamMemberCard from "./TeamMemberCard";

const allMembers: TeamMemberOption[] = [
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
    id: "david",
    name: "David Chen",
    role: "QA Engineer",
    email: "david@example.com",
    phone: "(555) 567-8901",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "lisa",
    name: "Lisa Brown",
    role: "Architect",
    email: "lisa@example.com",
    phone: "(555) 678-9012",
    avatarUrl:
      "https://images.unsplash.com/photo-1542204625-de293a501df4?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "carlos",
    name: "Carlos Martinez",
    role: "Electrician",
    email: "carlos@example.com",
    phone: "(555) 789-0123",
    avatarUrl:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "olivia",
    name: "Olivia Wilson",
    role: "Interior Designer",
    email: "olivia@example.com",
    phone: "(555) 890-1234",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "ahmed",
    name: "Ahmed Rahman",
    role: "Procurement Lead",
    email: "ahmed@example.com",
    phone: "(555) 901-2345",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop",
  },
];

export default function TeamScreen() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [memberIds, setMemberIds] = useState<string[]>([
    "john",
    "sarah",
    "mike",
    "emily",
  ]);

  const selectedMembers = useMemo(
    () => allMembers.filter((member) => memberIds.includes(member.id)),
    [memberIds]
  );

  const availableMembers = useMemo(
    () => allMembers.filter((member) => !memberIds.includes(member.id)),
    [memberIds]
  );

  const handleAddMember = (member: TeamMemberOption) => {
    setMemberIds((previous) =>
      previous.includes(member.id) ? previous : [...previous, member.id]
    );
  };

  const handleDeleteMember = (id: string) => {
    setMemberIds((previous) => previous.filter((memberId) => memberId !== id));
  };

  return (
    <>
      <View className="mt-6 px-5">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[16px] font-medium text-[#283443]">Floors (5)</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowAddSheet(true)}
            className="h-[42px] min-w-[132px] flex-row items-center justify-center rounded-[10px] border border-[#D3D9E1] bg-[#F8FAFC] px-4"
          >
            <Text className="mr-1 text-[18px] font-medium text-[#1F2937]">+</Text>
            <Text className="text-[16px] font-medium text-[#1F2937]">Add Member</Text>
          </TouchableOpacity>
        </View>

        {selectedMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            avatarUrl={member.avatarUrl}
            name={member.name}
            role={member.role}
            email={member.email}
            phone={member.phone}
            onDelete={() => handleDeleteMember(member.id)}
          />
        ))}
      </View>

      <AddTeamMemberSheet
        visible={showAddSheet}
        members={availableMembers}
        onClose={() => setShowAddSheet(false)}
        onSelectMember={handleAddMember}
      />
    </>
  );
}
