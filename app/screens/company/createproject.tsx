import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProjectCheckboxOption from "@/components/company/project/ProjectCheckboxOption";
import ProjectInputField from "@/components/company/project/ProjectInputField";
import ProjectTypeDropdown, {
  ProjectTypeValue,
} from "@/components/company/project/ProjectTypeDropdown";
import { saveProject } from "@/components/company/project/projectStore";
import {
  useCompanyQuery,
  useCreateProjectMutation,
} from "@/hooks/company/company";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
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

function parseOptionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function mapSectionToApiValue(section: string) {
  const normalized = section.trim().toLowerCase();
  if (normalized === "main floor") return "main_floor";
  return normalized.replace(/\s+/g, "_");
}

function mapProjectTypeToApiValue(type: ProjectTypeValue) {
  if (type === "Apartment Building") return "apartment";
  if (type === "House") return "house";
  if (type === "Commercial") return "commercial";
  if (type === "Industrial") return "industrial";
  return "house";
}

export default function CreateProjectRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const companyId = typeof id === "string" ? id : undefined;
  const { data: company, refetch: refetchCompany } = useCompanyQuery(companyId);
  const { createProject, isPending } = useCreateProjectMutation(companyId);
  const [refreshing, setRefreshing] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectType, setProjectType] =
    useState<ProjectTypeValue>("Apartment Building");
  const [floors, setFloors] = useState("");
  const [roomsPerFloor, setRoomsPerFloor] = useState("");
  const [numFloorsMin, setNumFloorsMin] = useState("");
  const [numFloorsMax, setNumFloorsMax] = useState("");
  const [unitPerFloorMin, setUnitPerFloorMin] = useState("");
  const [unitPerFloorMax, setUnitPerFloorMax] = useState("");
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
    setNumFloorsMin("");
    setNumFloorsMax("");
    setUnitPerFloorMin("");
    setUnitPerFloorMax("");

    if (nextType !== "House") {
      setHouseScope("whole");
      setSelectedSections([]);
    }
  };

  const toggleHouseSection = (name: string) => {
    setSelectedSections((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      }

      return [...prev, name];
    });
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchCompany();
    } finally {
      setRefreshing(false);
    }
  }, [refetchCompany]);

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

    const floorsMinNumber = parseOptionalNumber(numFloorsMin);
    const floorsMaxNumber = parseOptionalNumber(numFloorsMax);
    const unitMinNumber = parseOptionalNumber(unitPerFloorMin);
    const unitMaxNumber = parseOptionalNumber(unitPerFloorMax);
    const mappedHouseSections = selectedSections.map(mapSectionToApiValue);

    if (
      projectType !== "House" &&
      (floorsMinNumber == null ||
        floorsMaxNumber == null ||
        unitMinNumber == null ||
        unitMaxNumber == null)
    ) {
      toast.error("Please enter valid floor and unit range values.");
      return;
    }

    if (projectType === "House" && houseScope === "sections" && !mappedHouseSections.length) {
      toast.error("Please select at least one house section.");
      return;
    }

    const type = mapProjectTypeToApiValue(projectType);

    try {
      await createProject({
        name: projectName.trim(),
        companyId,
        type,
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        budget: budgetNumber,
        location: location.trim(),
        description: description.trim(),
        ...(type !== "house"
          ? {
              ...(floorsMinNumber != null ? { numFloorsMin: floorsMinNumber } : {}),
              ...(floorsMaxNumber != null ? { numFloorsMax: floorsMaxNumber } : {}),
              ...(unitMinNumber != null ? { unitPerFloorMin: unitMinNumber } : {}),
              ...(unitMaxNumber != null ? { unitPerFloorMax: unitMaxNumber } : {}),
            }
          : projectType === "House"
            ? {
                isWholeHouse: houseScope === "whole",
                ...(houseScope === "sections"
                  ? {
                      houseSections: mappedHouseSections,
                    }
                  : {}),
              }
            : {}),
        autoGenerateFloors: type !== "house",
      });
    } catch {
      return;
    }

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

    router.push({
      pathname: "/screens/company/assignedprojects",
      params: { id: companyId },
    });
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
    <SafeAreaView className="flex-1 bg-[#E9EDF1]" edges={['bottom','top','right','left']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={16}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
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

              {projectType !== "House" ? (
                <>
                  <View className="mt-3">
                    <Text className="mb-2 text-[15px] font-medium text-[#1F2937]">
                      Floor Range
                    </Text>
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <ProjectInputField
                          label="Min Floors"
                          placeholder="e.g. 3"
                          value={numFloorsMin}
                          onChangeText={setNumFloorsMin}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View className="flex-1">
                        <ProjectInputField
                          label="Max Floors"
                          placeholder="e.g. 8"
                          value={numFloorsMax}
                          onChangeText={setNumFloorsMax}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>

                  <View className="mt-3">
                    <Text className="mb-2 text-[15px] font-medium text-[#1F2937]">
                      Unit Range
                    </Text>
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <ProjectInputField
                          label="Min Units"
                          placeholder="e.g. 12"
                          value={unitPerFloorMin}
                          onChangeText={setUnitPerFloorMin}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View className="flex-1">
                        <ProjectInputField
                          label="Max Units"
                          placeholder="e.g. 20"
                          value={unitPerFloorMax}
                          onChangeText={setUnitPerFloorMax}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>
                </>
              ) : projectType === "House" ? (
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
              ) : null}

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
