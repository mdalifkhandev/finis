import BackTitleHeader from "@/components/common/BackTitleHeader";
import CompanyCard from "@/components/company/CompanyCard";
import { useCompaniesQuery } from "@/hooks/company/company";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Company() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, refetch } = useCompaniesQuery(
    page,
    limit,
  );

  const companies = data?.data ?? [];
  const meta = data?.meta;

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return companies;
    }

    return companies.filter((company) =>
      [company.name, company.industry, company.address, company.website]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [companies, search]);
  const refreshing = isFetching && !isLoading;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={16}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refetch}
              tintColor="#1f3d5c"
              colors={["#1f3d5c"]}
            />
          }
        >
          <BackTitleHeader title="Company" onBack={() => router.back()} />

          <View className="mt-5 px-5">
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Ionicons name="search" size={16} color="#94a3b8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search....."
                placeholderTextColor="#94a3b8"
                className="ml-2 flex-1 text-sm text-slate-700"
              />
            </View>
          </View>

          <View className="mt-2 px-5">
            {(isLoading || isFetching) && !filteredCompanies.length ? (
              <View className="mt-10 items-center">
                <ActivityIndicator size="small" color="#1f3d5c" />
                <Text className="mt-2 text-xs text-slate-500">
                  Loading companies...
                </Text>
              </View>
            ) : filteredCompanies.length ? (
              filteredCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  name={company.name}
                  type={company.industry}
                  revenue={company.revenue?.toLocaleString()}
                  projectLevel={String(company._count.projects)}
                  address={company.address}
                  website={company.website}
                  logoUrl={company.logoUrl}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/company/profile",
                      params: { id: company.id },
                    })
                  }
                />
              ))
            ) : (
              <View className="mt-10 items-center">
                <Text className="text-sm text-slate-500">
                  No companies found.
                </Text>
              </View>
            )}
          </View>

          <View className="mt-6 flex-row items-center justify-between px-5">
            <TouchableOpacity
              disabled={page === 1}
              onPress={() => setPage((current) => Math.max(1, current - 1))}
              className={`rounded-full px-4 py-2 ${
                page === 1 ? "bg-slate-200" : "bg-slate-900"
              }`}
              activeOpacity={0.85}
            >
              <Text
                className={`text-xs font-semibold ${
                  page === 1 ? "text-slate-400" : "text-white"
                }`}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <Text className="text-xs text-slate-500">
              Page {meta?.page ?? page}
            </Text>

            <TouchableOpacity
              disabled={meta ? page >= meta.totalPages : false}
              onPress={() => setPage((current) => current + 1)}
              className={`rounded-full px-4 py-2 ${
                meta && page >= meta.totalPages
                  ? "bg-slate-200"
                  : "bg-slate-900"
              }`}
              activeOpacity={0.85}
            >
              <Text
                className={`text-xs font-semibold ${
                  meta && page >= meta.totalPages
                    ? "text-slate-400"
                    : "text-white"
                }`}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6 px-5">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/screens/company/createcompany")}
              className="items-center justify-center rounded-xl bg-[#1f3d5c] py-3"
            >
              <Text className="text-sm font-semibold text-white">
                Create New Company
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
