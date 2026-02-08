import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export type TeamMemberOption = {
  id: string;
  avatarUrl: string;
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
};

export default function AddTeamMemberSheet({
  visible,
  members,
  onClose,
  onSelectMember,
}: AddTeamMemberSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Pressable className="flex-1 justify-end bg-black/25" onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="rounded-t-2xl bg-white px-3 pb-5 pt-3"
        >
          <Text className="text-[16px] font-medium text-[#222831]">Add Team Member</Text>

          <View className="mt-2">
            {members.map((member) => (
              <TouchableOpacity
                key={member.id}
                activeOpacity={0.85}
                onPress={() => onSelectMember(member)}
                className="mt-2 flex-row items-center rounded-xl border border-[#D6DBE2] bg-[#F7F9FB] px-3 py-2.5"
              >
                <Image source={{ uri: member.avatarUrl }} className="h-10 w-10 rounded-full" />
                <View className="ml-2.5 flex-1">
                  <Text className="text-[15px] font-medium text-[#1B2028]">{member.name}</Text>
                  <Text className="text-[13px] text-[#687385]">{member.role}</Text>
                </View>

                <View className="h-5 w-5 items-center justify-center rounded-full border border-[#8F8F8F] bg-transparent">
                  <Ionicons name="add" size={11} color="#8F8F8F" />
                </View>
              </TouchableOpacity>
            ))}

            {members.length === 0 ? (
              <View className="mt-2 rounded-xl border border-[#D6DBE2] bg-[#F7F9FB] px-3 py-4">
                <Text className="text-center text-[14px] text-[#687385]">
                  No member available
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
