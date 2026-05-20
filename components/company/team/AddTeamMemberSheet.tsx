import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type TeamMemberOption = {
  id: string;
  avatarUrl: string | null;
  name: string;
  role: string;
  email: string;
  phone: string;
};

type AddTeamMemberSheetProps = {
  visible: boolean;
  members: TeamMemberOption[];
  onClose: () => void;
  onSelectMember: (member: TeamMemberOption) => void;
  title?: string;
  isLoading?: boolean;
};

export default function AddTeamMemberSheet({
  visible,
  members,
  onClose,
  onSelectMember,
  title = "Add Team Managers",
  isLoading = false,
}: AddTeamMemberSheetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    const member = members.find((m) => m.id === selectedId);
    if (member) {
      onSelectMember(member);
      setSelectedId(null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable className="flex-1 justify-end bg-black/20" onPress={handleClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="rounded-t-[14px] bg-white px-3 pb-6 pt-3"
        >
          <Text className="text-[16px] font-medium text-[#222831]">
            {title}
          </Text>

          <View className="mt-2">
            {isLoading ? (
              <View className="py-6 items-center justify-center">
                <ActivityIndicator size="small" color="#1F2937" />
              </View>
            ) : (
              <>
                {members.map((member) => {
                  const isSelected = selectedId === member.id;
                  return (
                    <TouchableOpacity
                      key={member.id}
                      activeOpacity={0.85}
                      onPress={() => setSelectedId(member.id)}
                      className={`mt-2 flex-row items-center rounded-[10px] border px-3 py-2.5 ${isSelected ? "border-[#6C63FF] bg-[#F4F3FF]" : "border-[#E0E4E9] bg-[#FFFFFF]"}`}
                    >
                      {member.avatarUrl ? (
                        <Image
                          source={{ uri: member.avatarUrl }}
                          className="h-9 w-9 rounded-full"
                        />
                      ) : (
                        <View className="h-9 w-9 rounded-full bg-[#E9EDF1] items-center justify-center">
                          <Ionicons name="person" size={16} color="#9CA3AF" />
                        </View>
                      )}
                      
                      <View className="ml-2.5 flex-1">
                        <Text className="text-[14px] font-medium text-[#1B2028]">
                          {member.name}
                        </Text>
                        <Text className="text-[12px] text-[#687385]">
                          {member.role}
                        </Text>
                      </View>

                      {isSelected ? (
                        <View className="h-5 w-5 items-center justify-center rounded-full bg-[#6C63FF]">
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      ) : (
                        <View className="h-5 w-5 rounded-full border border-[#8F8F8F] bg-transparent" />
                      )}
                    </TouchableOpacity>
                  );
                })}

                {members.length === 0 ? (
                  <View className="mt-2 rounded-[10px] border border-[#E0E4E9] bg-[#FFFFFF] px-3 py-4">
                    <Text className="text-center text-[12px] text-[#687385]">
                      No member available
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={!selectedId}
                  onPress={handleConfirm}
                  className={`mt-6 h-[44px] items-center justify-center rounded-[10px] ${selectedId ? "bg-[#1E5371]" : "bg-[#D1D5DB]"}`}
                >
                  <Text className="text-[16px] font-medium text-white">Add Selected</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
