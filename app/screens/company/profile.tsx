import BackTitleHeader from "@/components/common/BackTitleHeader";
import ProfileMenuItem from "@/components/company/ProfileMenuItem";
import ProfileSummaryCard from "@/components/company/ProfileSummaryCard";
import { useCompanyQuery } from "@/hooks/company/company";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const menuItems = [
  { label: "Assigned Projects", route: "/screens/company/assignedprojects" },
  { label: "Contacts", route: "/screens/company/contacts" },
  { label: "Documents", route: "/screens/company/documents" },
  { label: "Geofencing", route: "/screens/company/geofencing" },
];

const placeholderAvatar = require("../../../assets/images/placeholder-person.png");

export default function CompanyProfileRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const companyId = typeof id === "string" ? id : undefined;
  const { data, isLoading, error } = useCompanyQuery(companyId);

  const isSuspended =
    data?.isActive === false ||
    (error as any)?.response?.status === 403 ||
    (error as any)?.statusCode === 403 ||
    (error instanceof Error && error.message.toLowerCase().includes("suspended"));

  return (
    <SafeAreaView className="flex-1 bg-[#e9edf1]" edges={['top','left',"right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <BackTitleHeader title="Company" onBack={() => router.back()} />

        {isLoading && !data && !isSuspended ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#1f3d5c" />
            <Text className="mt-2 text-xs text-slate-500">
              Loading company...
            </Text>
          </View>
        ) : isSuspended ? (
          <View className="mx-5 my-10 items-center justify-center rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-100">
              <Ionicons name="shield-outline" size={32} color="#dc2626" />
            </View>
            <Text className="text-xl font-bold text-slate-900 text-center">
              Company Suspended
            </Text>
            <Text className="mt-2 px-2 text-center text-sm text-slate-600 leading-5">
              This company has been suspended by Super Admin. Access to company details, projects, documents, and contacts is restricted.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              className="mt-6 rounded-xl bg-[#1D4F6D] px-6 py-3"
            >
              <Text className="font-semibold text-white">Back to Companies</Text>
            </TouchableOpacity>
          </View>
        ) : data ? (
          <>
            <ProfileSummaryCard
              name={data.name}
              handle={data.industry}
              avatarSource={
                data.logoUrl ? { uri: data.logoUrl } : placeholderAvatar
              }
              completedProjects={String(data._count.projects)}
              annualRevenue={data.revenue?.toLocaleString()}
              totalEmployees={String(data._count.members)}
              onEdit={
                companyId
                  ? () =>
                      router.push({
                        pathname: "/screens/company/createcompany",
                        params: { id: companyId },
                      })
                  : undefined
              }
            />

            <View className="mx-5 mt-6 rounded-3xl border border-[#d4d9de] bg-[#f5f6f8] py-2">
              {menuItems.map((item) => (
                <ProfileMenuItem
                  key={item.label}
                  label={item.label}
                  onPress={
                    (item.label === "Assigned Projects" ||
                      item.label === "Contacts" ||
                      item.label === "Documents" ||
                      item.label === "Geofencing") &&
                    companyId
                      ? () =>
                          router.push({
                            pathname:
                              item.label === "Assigned Projects"
                                ? "/screens/company/assignedprojects"
                                : item.label === "Contacts"
                                  ? "/screens/company/contacts"
                                  : item.label === "Documents"
                                    ? "/screens/company/documents"
                                    : "/screens/company/geofencing",
                            params: { id: companyId },
                          })
                      : item.route
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
          </>
        ) : (
          <View className="mt-10 items-center">
            <Text className="text-sm text-slate-500">Company not found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
