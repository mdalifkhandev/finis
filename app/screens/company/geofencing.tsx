import BackTitleHeader from "@/components/common/BackTitleHeader";
import GeofenceMapCard from "@/components/company/geofencing/GeofenceMapCard";
import GeofencingSummaryCard from "@/components/company/geofencing/GeofencingSummaryCard";
import LiveTrackerCard from "@/components/company/geofencing/LiveTrackerCard";
import LocationLogsCard from "@/components/company/geofencing/LocationLogsCard";
import ZoneConfigurationCard from "@/components/company/geofencing/ZoneConfigurationCard";
import ZoneViolationAlertCard from "@/components/company/geofencing/ZoneViolationAlertCard";
import { LocationLog } from "@/components/company/geofencing/types";
import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const logs: LocationLog[] = [
  {
    name: "Carlos Martinez",
    time: "12:30:00 PM",
    location: "43.6333, -79.4187",
    status: "Tracking",
  },
  {
    name: "Carlos Martinez",
    time: "10:00:00 AM",
    location: "43.6335, -79.4188",
    status: "Tracking",
  },
  {
    name: "David Chen",
    time: "8:15:00 AM",
    location: "43.6332, -79.4186",
    status: "Check In",
  },
  {
    name: "Carlos Martinez",
    time: "7:58:00 AM",
    location: "43.6332, -79.4186",
    status: "Check In",
  },
];

export default function GeofencingRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <BackTitleHeader title="Geofencing" onBack={() => router.back()} />

        <GeofencingSummaryCard />
        <GeofenceMapCard />
        <ZoneConfigurationCard />
        <LiveTrackerCard />
        <LocationLogsCard logs={logs} />
        <ZoneViolationAlertCard />
      </ScrollView>
    </SafeAreaView>
  );
}
