import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TaskViewCardProps = {
  workerName: string;
  role: string;
  dateRange: string;
  title: string;
  location: string;
  city: string;
  roomNo: string;
  startTime: string;
  endTime: string;
  date: string;
  description: string;
  onStartTask?: () => void;
};

export default function TaskViewCard({
  workerName,
  role,
  dateRange,
  title,
  location,
  city,
  roomNo,
  startTime,
  endTime,
  date,
  description,
  onStartTask,
}: TaskViewCardProps) {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [takenPhoto, setTakenPhoto] = useState<string | null>(null);

  const handleStartTaskClick = () => {
    setIsModalVisible(true);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTakenPhoto(result.assets[0].uri);
    }
  };

  const handleConfirm = () => {
    setIsModalVisible(false);
    setTakenPhoto(null);
    onStartTask?.();
  };

  return (
    <View className="mx-5 my-6 rounded-[24px] bg-white p-6 shadow-sm border border-slate-50">
      <View className="items-center pb-5">
        <Text className="text-[22px] font-bold text-[#1F2937]">
          {workerName}
        </Text>
        <Text className="text-[14px] text-slate-500 mt-1">{role}</Text>
        <Text className="text-[12px] text-slate-400 mt-1">{dateRange}</Text>
      </View>

      <View className="h-[1px] w-full bg-slate-100 mb-5" />

      <View className="space-y-4">
        <Text className="text-[15px] font-semibold text-[#374151] mb-2">
          {title}
        </Text>

        <View className="flex-row justify-between mb-3">
          <Text className="text-[14px] text-slate-500">{location}</Text>
          <Text className="text-[14px] font-medium text-[#111827]">{city}</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-[14px] text-slate-500">Room No:</Text>
          <Text className="text-[14px] font-medium text-[#111827]">
            {roomNo}
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-[14px] text-slate-500">Start Time:</Text>
          <Text className="text-[14px] font-medium text-[#111827]">
            {startTime}
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-[14px] text-slate-500">End Time:</Text>
          <Text className="text-[14px] font-medium text-[#111827]">
            {endTime}
          </Text>
        </View>

        <View className="flex-row justify-between mb-5">
          <Text className="text-[14px] text-slate-500">Date:</Text>
          <Text className="text-[14px] font-medium text-[#111827]">{date}</Text>
        </View>
      </View>

      <View className="rounded-[16px] bg-[#F7F9FB] p-5 mb-6">
        <Text className="text-[14px] font-bold text-[#1F2937] mb-2">
          Description
        </Text>
        <Text className="text-[13px] leading-5 text-slate-600">
          {description}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleStartTaskClick}
        className="h-[56px] w-full items-center justify-center rounded-[12px] bg-[#1D4F6D]"
      >
        <Text className="text-[16px] font-bold text-white">Start Task</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white px-6 pt-3"
            style={{
              paddingBottom: Math.max(insets.bottom, 20) + 12,
              borderTopEndRadius: 30,
              borderTopLeftRadius: 30,
            }}
          >
            <View className="items-center mb-6">
              <View className="h-1.5 w-16 rounded-full bg-[#E5E7EB]" />
            </View>

            <Text className="text-[24px] font-bold text-[#0D1B34] mb-4">
              Before You Start
            </Text>
            <Text className="text-[16px] leading-[22px] text-[#2D455F] mb-6">
              Please take a photo of the current condition before starting the
              task. This photo is required for verification.
            </Text>

            {!takenPhoto ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleTakePhoto}
                className="h-[56px] w-full items-center justify-center rounded-[14px]"
                style={{ backgroundColor: "#CCECFF" }}
              >
                <Text className="text-[18px] font-semibold text-[#1F2937]">
                  Take photo
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="rounded-[24px] border border-[#E5E7EB] p-3">
                <View
                  className="w-full rounded-[16px] overflow-hidden mb-4 bg-black"
                  style={{ height: 200 }}
                >
                  <Image
                    source={{ uri: takenPhoto }}
                    style={{ width: "100%", height: 200 }}
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setTakenPhoto(null)}
                    className="h-[52px] flex-1 items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white"
                  >
                    <Text className="text-[16px] font-semibold text-[#1F2937]">
                      Retake
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleConfirm}
                    className="h-[52px] flex-1 items-center justify-center rounded-[12px]"
                    style={{ backgroundColor: "#CCECFF" }}
                  >
                    <Text className="text-[16px] font-semibold text-[#1F2937]">
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
