import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProfileMenuItem from "@/components/company/ProfileMenuItem";
import ProfileSummaryCard from "@/components/company/ProfileSummaryCard";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const menuItems = [
  { label: "Assigned Projects", route: "/screens/company/assignedprojects" },
  { label: "Contacts", route: "/screens/company/contacts" },
  { label: "Documents", route: "/screens/company/documents" },
  { label: "Geofencing", route: "/screens/company/geofencing" },
];

const avatarUrl =
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop";

export default function CompanyProfileRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#e9edf1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <BackTitleHeader title="Company" onBack={() => router.back()} />

        <ProfileSummaryCard
          name="Maya Louis Matthew"
          handle="@maya.louis"
          avatarUrl={avatarUrl}
          completedProjects="12"
          annualRevenue="15"
          totalEmployees="50"
        />

        <View className="mx-5 mt-6 rounded-3xl border border-[#d4d9de] bg-[#f5f6f8] py-2">
          {menuItems.map((item) => (
            <ProfileMenuItem
              key={item.label}
              label={item.label}
              onPress={
                item.route
                  ? () =>
                      router.push(
                        item.route as
                          | "/screens/company/assignedprojects"
                          | "/screens/company/contacts"
                          | "/screens/company/documents"
                          | "/screens/company/geofencing",
                      )
                  : undefined
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
