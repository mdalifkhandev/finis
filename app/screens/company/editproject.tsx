import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectCheckboxOption from "@/components/company/project/ProjectCheckboxOption";
import ProjectInputField from "@/components/company/project/ProjectInputField";
import ProjectTypeDropdown, {
  ProjectTypeValue,
} from "@/components/company/project/ProjectTypeDropdown";
import {
  saveProject,
  useProjectData,
} from "@/components/company/project/projectStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProjectRoute() {
  const currentProject = useProjectData();

  const [projectName, setProjectName] = useState(currentProject.projectName);
  const [company] = useState(currentProject.company || "CC.LTD");
  const [startDate, setStartDate] = useState(currentProject.startDate);
  const [endDate, setEndDate] = useState(currentProject.endDate);
  const [projectType, setProjectType] = useState<ProjectTypeValue>(
    currentProject.projectType,
  );
  const [floors, setFloors] = useState(currentProject.floors);
  const [roomsPerFloor, setRoomsPerFloor] = useState(
    currentProject.roomsPerFloor,
  );
  const [budget, setBudget] = useState(currentProject.budget);
  const [location, setLocation] = useState(currentProject.location);
  const [description, setDescription] = useState(currentProject.description);
  const [budgetEnabled, setBudgetEnabled] = useState(
    currentProject.budgetEnabled,
  );
  const [houseScope, setHouseScope] = useState<"whole" | "sections">(
    currentProject.houseScope,
  );
  const [selectedSections, setSelectedSections] = useState<string[]>(
    currentProject.selectedSections,
  );

  const isApartment = projectType === "Apartment Building";
  const houseSectionOptions = [
    "Basement",
    "Upstairs",
    "Main floor",
    "Exterior",
  ];

  const handleSelectProjectType = (nextType: ProjectTypeValue) => {
    setProjectType(nextType);

    if (nextType === "Apartment Building") {
      setHouseScope("whole");
      setSelectedSections([]);
      return;
    }

    setFloors("");
    setRoomsPerFloor("");
  };

  const toggleHouseSection = (name: string) => {
    setSelectedSections((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      }

      return [...prev, name];
    });
  };

  const handleSave = () => {
    saveProject({
      projectName,
      company,
      startDate,
      endDate,
      projectType,
      floors: projectType === "Apartment Building" ? floors : "",
      roomsPerFloor: projectType === "Apartment Building" ? roomsPerFloor : "",
      budgetEnabled,
      budget: budgetEnabled ? budget : "",
      location,
      description,
      houseScope: projectType === "House" ? houseScope : "whole",
      selectedSections:
        projectType === "House" && houseScope === "sections"
          ? selectedSections
          : [],
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={16}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <BackTitleHeader title="Edit Project" onBack={() => router.back()} />

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
                value={company}
                rightIconName="chevron-down"
                onPress={() => {}}
              />
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <ProjectInputField
                  label="Start Date"
                  placeholder=""
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <View className="flex-1">
                <ProjectInputField
                  label="End Date"
                  placeholder=""
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>

            <View className="mt-4 rounded-xl border border-[#D8DEE6] bg-[#EDF1F4] p-3">
              <ProjectTypeDropdown
                value={projectType}
                onChange={handleSelectProjectType}
              />

              {isApartment ? (
                <>
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
                </>
              ) : (
                <>
                  <View className="mt-3 flex-row items-center">
                    <ProjectCheckboxOption
                      label="Whole House"
                      selected={houseScope === "whole"}
                      onPress={() => {
                        setHouseScope("whole");
                        setSelectedSections([]);
                      }}
                    />
                    <ProjectCheckboxOption
                      label="Sections"
                      selected={houseScope === "sections"}
                      onPress={() => setHouseScope("sections")}
                    />
                  </View>

                  {houseScope === "sections" ? (
                    <View className="mt-2 rounded-xl bg-[#E9E2DF] px-3 py-2">
                      <View className="flex-row flex-wrap">
                        {houseSectionOptions.map((option) => (
                          <View key={option} className="mb-1.5 w-1/2">
                            <ProjectCheckboxOption
                              label={option}
                              selected={selectedSections.includes(option)}
                              onPress={() => toggleHouseSection(option)}
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </>
              )}

              <View className="mt-3">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-[16px] font-medium text-[#1F2937]">
                    Budget
                  </Text>
                  <Switch
                    value={budgetEnabled}
                    onValueChange={setBudgetEnabled}
                    trackColor={{ false: "#CBD5E1", true: "#1D4F6D" }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#CBD5E1"
                  />
                </View>

                {budgetEnabled ? (
                  <View className="mt-2">
                    <ProjectInputField
                      placeholder="0.00"
                      value={budget}
                      onChangeText={setBudget}
                      keyboardType="decimal-pad"
                    />
                  </View>
                ) : null}
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
              onPress={handleSave}
              className="mt-6 h-[52px] items-center justify-center rounded-[12px] bg-[#1D4F6D] px-8"
            >
              <Text className="text-[16px] font-medium leading-6 text-[#EAEFE9]">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
