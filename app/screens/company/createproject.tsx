import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectCheckboxOption from "@/components/company/project/ProjectCheckboxOption";
import ProjectInputField from "@/components/company/project/ProjectInputField";
import ProjectTypeDropdown, {
  ProjectTypeValue,
} from "@/components/company/project/ProjectTypeDropdown";
import { saveProject } from "@/components/company/project/projectStore";
import { useCompanyQuery, useCreateProjectMutation } from "@/hooks/company/company";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

function formatDate(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreateProjectRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const companyId = typeof id === "string" ? id : undefined;
  const { data: company } = useCompanyQuery(companyId);
  const { createProject, isPending } = useCreateProjectMutation(companyId);

  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectType, setProjectType] =
    useState<ProjectTypeValue>("Apartment Building");
  const [floors, setFloors] = useState("");
  const [roomsPerFloor, setRoomsPerFloor] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [houseScope, setHouseScope] = useState<"whole" | "sections">("whole");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [pickerTarget, setPickerTarget] = useState<"start" | "end" | null>(
    null,
  );
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());

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

  const handleCreateProject = async () => {
    if (!companyId) {
      toast.error("Company not found");
      return;
    }

    if (
      !projectName.trim() ||
      !startDate.trim() ||
      !endDate.trim() ||
      !location.trim() ||
      !description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const budgetNumber = budgetEnabled ? Number(budget) : 0;
    if (budgetEnabled && Number.isNaN(budgetNumber)) {
      toast.error("Please enter a valid budget.");
      return;
    }

    const floorsNumber = isApartment ? Number(floors) : 1;
    const roomsNumber = isApartment ? Number(roomsPerFloor) : 1;

    if (
      Number.isNaN(floorsNumber) ||
      Number.isNaN(roomsNumber) ||
      floorsNumber <= 0 ||
      roomsNumber <= 0
    ) {
      toast.error("Please enter valid floor and room counts.");
      return;
    }

    await createProject({
      name: projectName.trim(),
      companyId,
      type: "residential",
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      budget: budgetNumber,
      location: location.trim(),
      description: description.trim(),
      numFloors: floorsNumber,
      roomsPerFloor: roomsNumber,
      autoGenerateFloors: true,
    });

    saveProject({
      projectName,
      company: company?.name ?? "",
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

    router.push("/screens/company/projectdetails");
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      setPickerTarget(null);
      return;
    }

    if (!selectedDate || !pickerTarget) {
      setPickerTarget(null);
      return;
    }

    if (pickerTarget === "start") {
      setStartDateValue(selectedDate);
      setStartDate(formatDate(selectedDate));
    } else {
      setEndDateValue(selectedDate);
      setEndDate(formatDate(selectedDate));
    }

    setPickerTarget(null);
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
          <BackTitleHeader
            title="Create New Project"
            onBack={() => router.back()}
          />

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
                value={company?.name ?? "Company"}
                rightIconName="chevron-down"
                onPress={() => {}}
              />
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <ProjectInputField
                  label="Start Date"
                  placeholder="YYYY-MM-DD"
                  value={startDate}
                  onPress={() => setPickerTarget("start")}
                  rightIconName="calendar-outline"
                />
              </View>
              <View className="flex-1">
                <ProjectInputField
                  label="End Date"
                  placeholder="YYYY-MM-DD"
                  value={endDate}
                  onPress={() => setPickerTarget("end")}
                  rightIconName="calendar-outline"
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
              onPress={() => void handleCreateProject()}
              disabled={isPending}
              className="mt-6 h-[52px] items-center justify-center rounded-[12px] bg-[#1D4F6D] px-8"
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#EAEFE9" />
              ) : (
                <Text className="text-[16px] font-medium leading-6 text-[#EAEFE9]">
                  Create Project & Setup Floors
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        {pickerTarget ? (
          <DateTimePicker
            value={pickerTarget === "start" ? startDateValue : endDateValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={pickerTarget === "end" ? startDateValue : undefined}
          />
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
