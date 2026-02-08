import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectInputField from "@/components/company/project/ProjectInputField";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateProjectRoute() {
  const [projectName, setProjectName] = useState("");
  const [floors, setFloors] = useState("");
  const [roomsPerFloor, setRoomsPerFloor] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <BackTitleHeader title="Create New Project" onBack={() => router.back()} />

        <View className="mt-6 px-5">
          <ProjectInputField
            label="Project Name"
            placeholder="Enter project name"
            value={projectName}
            onChangeText={setProjectName}
          />

          <View className="mt-4">
            <ProjectInputField
              label="Company"
              value="CC.LTD"
              rightIconName="chevron-down"
              onPress={() => {}}
            />
          </View>

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <ProjectInputField label="Start Date" placeholder="" value="" />
            </View>
            <View className="flex-1">
              <ProjectInputField label="End Date" placeholder="" value="" />
            </View>
          </View>

          <View className="mt-4 rounded-xl border border-[#D8DEE6] bg-[#EDF1F4] p-3">
            <ProjectInputField
              label="Project Type"
              value="Apartment Building"
              rightIconName="chevron-down"
              onPress={() => {}}
            />

            <View className="mt-3">
              <ProjectInputField
                label="Number of Floors"
                placeholder="e.g. 5"
                value={floors}
                onChangeText={setFloors}
                keyboardType="number-pad"
              />
            </View>

            <View className="mt-3">
              <ProjectInputField
                label="Rooms per Floor"
                placeholder="e.g. 20"
                value={roomsPerFloor}
                onChangeText={setRoomsPerFloor}
                keyboardType="number-pad"
              />
            </View>

            <View className="mt-3">
              <ProjectInputField
                label="Budget"
                placeholder="0.00"
                value={budget}
                onChangeText={setBudget}
                keyboardType="decimal-pad"
                labelRight={
                  <Switch
                    value={budgetEnabled}
                    onValueChange={setBudgetEnabled}
                    trackColor={{ false: "#CBD5E1", true: "#1D4F6D" }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#CBD5E1"
                  />
                }
                editable={budgetEnabled}
              />
            </View>

            <View className="mt-3">
              <ProjectInputField
                label="Location"
                placeholder="Project location"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View className="mt-4">
            <ProjectInputField
              label="Description"
              placeholder="Describe your product..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            className="mt-6 h-[52px] items-center justify-center rounded-[12px] bg-[#1D4F6D] px-8"
          >
            <Text className="text-[16px] font-medium leading-6 text-[#EAEFE9]">
              Create Project & Setup Floors
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
