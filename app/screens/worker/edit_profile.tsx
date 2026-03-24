import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEME = {
  colors: {
    background: "#FFFFFF",
    white: "#FFFFFF",
    textMain: "#1A1C1E",
    textSecondary: "#8E949A",
    textPlaceholder: "#94A3B8",
    inputBg: "#F8FAFC",
    inputBorder: "#F1F5F9",
    bluePrimary: "#1D4F6D", // Dark blue for the save button
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
  const [name, setName] = useState("Rokey Mahmud");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [dob, setDob] = useState("01/15/1995");
  const [gender, setGender] = useState("Male");

  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];

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
          value="alice@example.com"
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
          value={dob}
          onPress={() => setIsDateModalVisible(true)}
          icon="calendar-month-outline"
        />

        <CustomInput
          placeholder="Gender"
          value={gender}
          isDropdown={true}
          onPress={() => setIsGenderModalVisible(true)}
        />

        <TouchableOpacity
          style={{
            height: 56,
            backgroundColor: THEME.colors.bluePrimary,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>

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

      {/* Date Pick Modal */}
      <Modal
        visible={isDateModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setIsDateModalVisible(false)}
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
                  marginBottom: 12,
                }}
              >
                Enter Date of Birth
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: THEME.colors.textSecondary,
                  marginBottom: 24,
                }}
              >
                Please use mm/dd/yyyy format
              </Text>

              <View
                style={{
                  height: 56,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: "#F1F5F9",
                  marginBottom: 28,
                  justifyContent: "center",
                }}
              >
                <TextInput
                  autoFocus
                  placeholder="01/15/1995"
                  placeholderTextColor="#CBD5E1"
                  value={dob}
                  onChangeText={setDob}
                  keyboardType="numbers-and-punctuation"
                  style={{ fontSize: 18, fontWeight: "600", color: "#1A1C1E" }}
                />
              </View>

              <TouchableOpacity
                style={{
                  height: 52,
                  backgroundColor: THEME.colors.bluePrimary,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setIsDateModalVisible(false)}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "700" }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
