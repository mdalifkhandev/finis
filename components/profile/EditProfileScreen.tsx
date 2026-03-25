import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileField from "./ProfileField";
import ProfileHeaderBar from "./ProfileHeaderBar";

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState("");
  const [email] = useState("alice@example.com");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ProfileHeaderBar title="Edit Profile" onBack={() => router.back()} />

        <View className="px-3 pt-5">
          <ProfileField
            placeholder="Full name"
            value={fullName}
            onChangeText={setFullName}
          />

          <ProfileField
            placeholder="alice@example.com"
            value={email}
            editable={false}
            rightIconName="lock-closed-outline"
          />

          <ProfileField
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <ProfileField
            placeholder="mm/dd/yyyy"
            value={dob}
            onChangeText={setDob}
            rightIconName="calendar-outline"
          />

          <ProfileField
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            rightIconName="chevron-down"
          />

          <TouchableOpacity
            activeOpacity={0.88}
            className="mt-5 h-[42px] items-center justify-center rounded-[6px] bg-[#1F5577]"
          >
            <Text className="text-[14px] font-semibold text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
