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
import {
  useProjectProfileQuery,
  useUpdateProjectMutation,
} from "@/hooks/company/company";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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

type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled"
  | "delayed";

const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
  "planning",
  "active",
  "on_hold",
  "completed",
  "cancelled",
  "delayed",
];

function formatDate(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateFromObject(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mapSectionToApiValue(section: string) {
  const normalized = section.trim().toLowerCase();
  if (normalized === "main floor") return "main_floor";
  return normalized.replace(/\s+/g, "_");
}

function mapApiSectionToLabel(section: string) {
  const normalized = section.trim().toLowerCase();
  if (normalized === "main_floor") return "Main floor";
  if (normalized === "basement") return "Basement";
  if (normalized === "upstairs") return "Upstairs";
  if (normalized === "exterior") return "Exterior";
  return section;
}

export default function EditProjectRoute() {
  const { id, companyId } = useLocalSearchParams<{ id?: string; companyId?: string }>();
  const projectId = typeof id === "string" ? id : undefined;
  const companyIdValue = typeof companyId === "string" ? companyId : undefined;
  const { data: projectProfile, isLoading } = useProjectProfileQuery(projectId);
  const { updateProject, isPending } = useUpdateProjectMutation(
    projectId,
    companyIdValue,
  );
  const currentProject = useProjectData();

  const [projectName, setProjectName] = useState(currentProject.projectName);
  const [company, setCompany] = useState(currentProject.company || "CC.LTD");
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
  const [status, setStatus] = useState("active");
  const [spent, setSpent] = useState("0");
  const [progress, setProgress] = useState("0");
  const [statusOpen, setStatusOpen] = useState(false);
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

  useEffect(() => {
    if (!projectProfile) return;

    setProjectName(projectProfile.name ?? "");
    setCompany(projectProfile.client.companyName ?? "CC.LTD");
    const parsedStartDate = new Date(projectProfile.startDate);
    const parsedEndDate = new Date(projectProfile.endDate);
    setStartDateValue(parsedStartDate);
    setEndDateValue(parsedEndDate);
    setStartDate(formatDate(projectProfile.startDate));
    setEndDate(formatDate(projectProfile.endDate));
    setProjectType(
      projectProfile.type?.toLowerCase() === "apartment"
        ? "Apartment Building"
        : "House",
    );
    if (projectProfile.type?.toLowerCase() === "house") {
      const wholeHouse = projectProfile.isWholeHouse !== false;
      setHouseScope(wholeHouse ? "whole" : "sections");
      setSelectedSections(
        wholeHouse
          ? []
          : (projectProfile.houseSections ?? []).map(mapApiSectionToLabel),
      );
    } else {
      setHouseScope("whole");
      setSelectedSections([]);
    }
    setFloors(String(projectProfile.numFloors ?? ""));
    setRoomsPerFloor(String(projectProfile.roomsPerFloor ?? ""));
    setBudget(String(projectProfile.budget ?? ""));
    setLocation(projectProfile.location ?? "");
    setDescription(projectProfile.description ?? "");
    setBudgetEnabled(Boolean(projectProfile.budget && projectProfile.budget > 0));
    const incomingStatus = (projectProfile.status ?? "active") as ProjectStatus;
    setStatus(
      PROJECT_STATUS_OPTIONS.includes(incomingStatus)
        ? incomingStatus
        : "active",
    );
    setSpent(String(projectProfile.spent ?? 0));
    setProgress(String(projectProfile.progress ?? 0));
  }, [projectProfile]);

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
      setStartDate(formatDateFromObject(selectedDate));
      if (selectedDate > endDateValue) {
        setEndDateValue(selectedDate);
        setEndDate(formatDateFromObject(selectedDate));
      }
    } else {
      setEndDateValue(selectedDate);
      setEndDate(formatDateFromObject(selectedDate));
    }

    setPickerTarget(null);
  };

  const handleSave = async () => {
    if (!projectId) {
      toast.error("Project not found");
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

    const budgetNumber = Number(budget || "0");
    const progressNumber = Number(progress || "0");
    const floorsNumber = Number(floors || "0");
    const roomsNumber = Number(roomsPerFloor || "0");
    const type = projectType === "Apartment Building" ? "apartment" : "house";
    const mappedHouseSections = selectedSections.map(mapSectionToApiValue);

    if (
      Number.isNaN(budgetNumber) ||
      Number.isNaN(progressNumber) ||
      Number.isNaN(floorsNumber) ||
      Number.isNaN(roomsNumber)
    ) {
      toast.error("Please enter valid numeric values.");
      return;
    }

    if (type === "house" && houseScope === "sections" && !mappedHouseSections.length) {
      toast.error("Please select at least one house section.");
      return;
    }

    await updateProject({
      id: projectId,
      payload: {
        name: projectName.trim(),
        status: (status.trim() || "active") as ProjectStatus,
        spent: spent.trim() || "0",
        progress: Math.max(0, Math.min(100, progressNumber)),
        type,
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        budget: budgetEnabled ? budgetNumber : 0,
        location: location.trim(),
        description: description.trim(),
        ...(type === "apartment"
          ? {
              numFloors: floorsNumber,
              roomsPerFloor: roomsNumber,
            }
          : {
              isWholeHouse: houseScope === "whole",
              ...(houseScope === "sections"
                ? {
                    houseSections: mappedHouseSections,
                  }
                : {}),
            }),
        autoGenerateFloors: type === "apartment",
      },
    });

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

    toast.success("Project updated");
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
                editable={false}
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
                      label="Units per Floor"
                      placeholder="e.g. 20"
                      value={roomsPerFloor}
                      onChangeText={setRoomsPerFloor}
                      keyboardType="number-pad"
                    />
                  </View>
                </>
              ):(
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

            <View className="mt-4">
              <ProjectInputField
                label="Status"
                placeholder="Select status"
                value={status}
                onPress={() => setStatusOpen((prev) => !prev)}
                rightIconName={statusOpen ? "chevron-up" : "chevron-down"}
              />
              {statusOpen ? (
                <View className="mt-2 overflow-hidden rounded-xl border border-[#D5DBE2] bg-[#F8FAFC]">
                  {PROJECT_STATUS_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.85}
                      onPress={() => {
                        setStatus(option);
                        setStatusOpen(false);
                      }}
                      className={`h-11 flex-row items-center px-3 ${
                        option === status ? "bg-[#E9F2F8]" : "bg-[#F8FAFC]"
                      }`}
                    >
                      <Text
                        className={`text-[15px] ${
                          option === status
                            ? "font-medium text-[#1D4F6D]"
                            : "text-[#374151]"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <View className="mt-4">
              <ProjectInputField
                label="Spent"
                placeholder="0"
                value={spent}
                onChangeText={setSpent}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mt-4">
              <ProjectInputField
                label="Progress (%)"
                placeholder="0"
                value={progress}
                onChangeText={setProgress}
                keyboardType="number-pad"
              />
            </View>

            {isLoading ? (
              <View className="mt-6 items-center">
                <ActivityIndicator size="small" color="#1D4F6D" />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => void handleSave()}
                disabled={isPending}
                className="mt-6 h-[52px] items-center justify-center rounded-[12px] bg-[#1D4F6D] px-8"
              >
                {isPending ? (
                  <ActivityIndicator size="small" color="#EAEFE9" />
                ) : (
                  <Text className="text-[16px] font-medium leading-6 text-[#EAEFE9]">
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            )}
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
