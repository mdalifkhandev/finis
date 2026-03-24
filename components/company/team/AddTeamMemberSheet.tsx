import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  title?: string;
};

export default function AddTeamMemberSheet({
  visible,
  members,
  onClose,
  onSelectMember,
  title = "Add Team Managers",
}: AddTeamMemberSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable className="flex-1 justify-end bg-black/20" onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="rounded-t-[14px] bg-white px-3 pb-4 pt-3"
        >
          <Text className="text-[16px] font-medium text-[#222831]">
            {title}
          </Text>

          <View className="mt-2">
            {members.map((member, index) => (
              <TouchableOpacity
                key={member.id}
                activeOpacity={0.85}
                onPress={() => onSelectMember(member)}
                className="mt-2 flex-row items-center rounded-[10px] border border-[#E0E4E9] bg-[#FFFFFF] px-3 py-2.5"
              >
                <Image
                  source={{ uri: member.avatarUrl }}
                  className="h-9 w-9 rounded-full"
                />
                <View className="ml-2.5 flex-1">
                  <Text className="text-[14px] font-medium text-[#1B2028]">
                    {member.name}
                  </Text>
                  <Text className="text-[12px] text-[#687385]">
                    {member.role}
                  </Text>
                </View>

                {index === 0 ? (
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-[#6C63FF]">
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                ) : (
                  <View className="h-5 w-5 rounded-full border border-[#8F8F8F] bg-transparent" />
                )}
              </TouchableOpacity>
            ))}

            {members.length === 0 ? (
              <View className="mt-2 rounded-[10px] border border-[#E0E4E9] bg-[#FFFFFF] px-3 py-4">
                <Text className="text-center text-[12px] text-[#687385]">
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
