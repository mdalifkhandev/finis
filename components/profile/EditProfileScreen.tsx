import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import ProfileField from "./ProfileField";
import ProfileHeaderBar from "./ProfileHeaderBar";
import ProfileAvatar from "./ProfileAvatar";
import { useAdminProfileQuery, useUpdateAdminProfileMutation } from "@/hooks/profile/profile";
import {
  appendImageToFormData,
  DEFAULT_IMAGE_UPLOAD_QUALITY,
} from "@/lib/uploads/image-upload";

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useAdminProfileQuery();
  const { mutate: updateProfile, isPending } = useUpdateAdminProfileMutation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatarUri, setAvatarUri] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setDob(profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "");
      setGender("male"); // Defaulting for demo
      setAvatarUri(profile.avatarUrl || "");
    }
  }, [profile]);

  const handlePickAvatar = async () => {
    const ImagePicker = await import("expo-image-picker");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Allow photo access to change the profile image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: DEFAULT_IMAGE_UPLOAD_QUALITY,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setDob(formattedDate);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("dateOfBirth", dob);
    formData.append("gender", gender);

    appendImageToFormData(formData, "avatar", { uri: avatarUri }, { fileName: "avatar.jpg" });

    updateProfile(formData, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ProfileHeaderBar title="Edit Profile" onBack={() => router.back()} />

        {isLoading ? (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator size="large" color="#1F5577" />
          </View>
        ) : (
          <View className="px-3 pt-5">
            <View className="mb-6 items-center">
              <ProfileAvatar
                uri={avatarUri}
                size={84}
                showCamera
                onPressCamera={handlePickAvatar}
              />
            </View>

            <ProfileField
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <ProfileField
              placeholder="Email address"
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

            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <ProfileField
                  placeholder="YYYY-MM-DD"
                  value={dob}
                  onChangeText={() => {}}
                  rightIconName="calendar-outline"
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowGenderModal(true)}>
              <View pointerEvents="none">
                <ProfileField
                  placeholder="Gender"
                  value={gender.charAt(0).toUpperCase() + gender.slice(1)}
                  onChangeText={() => {}}
                  rightIconName="chevron-down"
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSave}
              disabled={isPending}
              className="mt-5 h-[42px] flex-row items-center justify-center rounded-[6px] bg-[#1F5577]"
            >
              {isPending && <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />}
              <Text className="text-[14px] font-semibold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={dob ? new Date(dob) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center bg-black/40 px-6"
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <TouchableOpacity activeOpacity={1} className="rounded-[16px] bg-white p-5">
            <Text className="mb-4 text-[18px] font-bold text-[#141A22]">Select Gender</Text>
            {["male", "female"].map((opt) => (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.7}
                onPress={() => {
                  setGender(opt);
                  setShowGenderModal(false);
                }}
                className={`mb-3 rounded-[12px] border p-4 ${
                  gender === opt ? "border-[#1F5577] bg-[#F0F8FF]" : "border-[#D8DEE5] bg-[#F7F9FB]"
                }`}
              >
                <Text
                  className={`text-[16px] capitalize ${
                    gender === opt ? "font-semibold text-[#1F5577]" : "text-[#141A22]"
                  }`}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

