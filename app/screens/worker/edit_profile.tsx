import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useWorkerProfileQuery, useUpdateWorkerProfileMutation } from "@/hooks/profile/profile";

const THEME = {
  colors: {
    background: "#FFFFFF",
    white: "#FFFFFF",
    textMain: "#1A1C1E",
    textSecondary: "#8E949A",
    textPlaceholder: "#94A3B8",
    inputBg: "#F8FAFC",
    inputBorder: "#F1F5F9",
    bluePrimary: "#1D4F6D",
  },
};

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  icon,
  readOnly = false,
  isDropdown = false,
  onPress,
}: {
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  icon?: any;
  readOnly?: boolean;
  isDropdown?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={readOnly ? 1 : onPress ? 0.7 : 1}
    onPress={onPress}
    disabled={readOnly && !onPress}
    style={{
      height: 56,
      backgroundColor: THEME.colors.inputBg,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: THEME.colors.inputBorder,
      marginBottom: 16,
    }}
  >
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={THEME.colors.textPlaceholder}
      value={value}
      onChangeText={onChangeText}
      editable={!readOnly && !isDropdown && !onPress}
      pointerEvents={isDropdown || onPress ? "none" : "auto"}
      style={{
        flex: 1,
        fontSize: 16,
        color: readOnly
          ? onPress
            ? THEME.colors.textMain
            : THEME.colors.textSecondary
          : THEME.colors.textMain,
        fontWeight: "500",
      }}
    />
    {icon && (
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={THEME.colors.textPlaceholder}
      />
    )}
    {isDropdown && (
      <Feather
        name="chevron-down"
        size={22}
        color={THEME.colors.textSecondary}
      />
    )}
  </TouchableOpacity>
);

const EditProfileScreen = () => {
  const { data: profile } = useWorkerProfileQuery();
  const { mutateAsync: updateProfile, isPending } = useUpdateWorkerProfileMutation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [gender, setGender] = useState("Male");

  useEffect(() => {
    if (profile) {
      setName(profile.fullName || "");
      setPhone(profile.phone || "");
      if (profile.dateOfBirth) {
        setDob(new Date(profile.dateOfBirth));
      }
    }
  }, [profile]);

  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", name);
      if (phone) formData.append("phone", phone);
      if (dob) formData.append("dateOfBirth", dob.toISOString());
      formData.append("gender", gender);

      await updateProfile(formData as any);
      router.back();
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 20 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name="chevron-left"
            size={32}
            color={THEME.colors.textMain}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: THEME.colors.textMain,
          }}
        >
          Edit Profile
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 40,
          }}
        >
          <CustomInput
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />

          <CustomInput
            value={profile?.email || ""}
            readOnly={true}
            icon="lock-outline"
          />

          <CustomInput
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
          />

          <CustomInput
            placeholder="mm/dd/yyyy"
            value={
              dob
                ? dob.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })
                : ""
            }
            onPress={() => setShowDatePicker(true)}
            icon="calendar-month-outline"
          />
          {showDatePicker && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDob(selectedDate);
                }
              }}
            />
          )}

          <CustomInput
            placeholder="Gender"
            value={gender}
            isDropdown={true}
            onPress={() => setIsGenderModalVisible(true)}
          />

          <TouchableOpacity
            disabled={isPending}
            style={{
              height: 56,
              backgroundColor: THEME.colors.bluePrimary,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 16,
            }}
            onPress={handleSave}
          >
            {isPending && <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />}
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
              Save
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Picker Modal */}
      <Modal
        visible={isGenderModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setIsGenderModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "85%",
              borderRadius: 24,
              padding: 28,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: THEME.colors.textMain,
                marginBottom: 20,
              }}
            >
              Select Gender
            </Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setGender(option);
                  setIsGenderModalVisible(false);
                }}
                style={{
                  paddingVertical: 16,
                  borderBottomWidth: option === "Other" ? 0 : 1,
                  borderBottomColor: "#F1F5F9",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color:
                      gender === option ? THEME.colors.bluePrimary : "#475569",
                    fontWeight: gender === option ? "700" : "500",
                  }}
                >
                  {option}
                </Text>
                {gender === option && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={THEME.colors.bluePrimary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

