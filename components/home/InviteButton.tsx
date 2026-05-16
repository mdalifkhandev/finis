import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { useInviteMutation } from "@/hooks/auth/useInviteMutation";

type InviteButtonProps = {
  onPress?: () => void;
};

export default function InviteButton({ onPress }: InviteButtonProps) {
  const { invite, isPending } = useInviteMutation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [showRoleOptions, setShowRoleOptions] = useState(false);

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Worker", value: "worker" },
  ];

  const closeModal = () => {
    setVisible(false);
    setShowRoleOptions(false);
  };

  const handleInvite = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Enter email");
      return;
    }

    try {
      const message = await invite({ email: trimmedEmail, role });
      toast.success(message);
      setEmail("");
      setRole("manager");
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invite failed");
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          onPress?.();
          setVisible(true);
        }}
        className="mr-5 mt-4 flex-row items-center self-end rounded-full bg-slate-800 px-4 py-2"
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={16} color="#ffffff" />
        <Text className="ml-2 text-xs font-semibold text-white">Invite</Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          className="flex-1 items-center justify-center bg-black/40"
          onPress={closeModal}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-[90%] max-w-[360px] overflow-hidden rounded-2xl bg-white"
          >
            <View className="flex-row items-center justify-between px-4 py-4">
              <Text className="text-[17px] font-semibold text-[#1F5577]">
                Invite User
              </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={closeModal}>
                <Ionicons name="close" size={26} color="#1F5577" />
              </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-[#E7ECF0]" />

            <View className="px-4 py-4">
              <Text className="mb-2.5 text-[16px] font-medium text-[#2B3138]">
                Email
              </Text>

              <View className="h-12 justify-center rounded-[10px] border border-[#D6DEE5] bg-[#EEF3F6] px-3">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#8C98A4"
                  className="text-[16px] text-[#1F2937]"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowRoleOptions((prev) => !prev)}
                className="mt-3 h-12 flex-row items-center rounded-[10px] border border-[#D6DEE5] bg-[#EEF3F6] px-3"
              >
                <Text className="flex-1 text-[16px] text-[#2B3138]">
                  {roleOptions.find((item) => item.value === role)?.label ??
                    "Manager"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#2B3138" />
              </TouchableOpacity>

              {showRoleOptions ? (
                <View className="mt-2 overflow-hidden rounded-[10px] border border-[#D6DEE5] bg-white">
                  {roleOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.85}
                      onPress={() => {
                        setRole(option.value);
                        setShowRoleOptions(false);
                      }}
                      className="h-10 justify-center px-3"
                    >
                      <Text
                        className={`text-[15px] ${
                          option.value === role
                            ? "font-semibold text-[#1F5577]"
                            : "text-[#2B3138]"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              <View className="mt-4 flex-row items-center gap-3">
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={closeModal}
                  className="h-12 flex-1 items-center justify-center rounded-[16px] border-2 border-[#1F5577] bg-white"
                >
                  <Text className="text-[16px] font-medium text-[#1F5577]">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleInvite}
                  disabled={isPending}
                  className="h-12 flex-1 items-center justify-center rounded-[16px] bg-[#1F5577]"
                >
                  <Text className="text-[16px] font-semibold text-white">
                    {isPending ? "Sending..." : "Invite"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
