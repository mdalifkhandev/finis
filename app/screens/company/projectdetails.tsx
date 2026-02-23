import BackTitleHeader from "@/components/common/BackTitleHeader";
import TaskViewCard from "@/components/company/taskdetails/TaskViewCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectDetailsRoute() {
  const mockTask = {
    workerName: "Mike Johnson",
    role: "Worker",
    dateRange: "Jan 1 - Jan 15, 2025",
    title: "Install electrical wiring",
    location: "Riverside Tower",
    city: "Dhaka",
    roomNo: "277",
    startTime: "8:00 PM",
    endTime: "6:00 AM",
    date: "3 Jan 2026",
    description: "An electric problem refers to any issue related to electrical systems, such as lights or switches not working, loose or damaged wiring, circuit breaker tripping, or irregular power supply. If not addressed promptly, these issues can disrupt work and pose safety risks.",
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F8F9FA]">
      <BackTitleHeader title="View Task" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <TaskViewCard
          {...mockTask}
          onStartTask={() => console.log("Task Started")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
