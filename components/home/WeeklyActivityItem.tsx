import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type WeeklyActivityItemProps = {
    day: string;
    status: string;
    type: "completed" | "in-progress" | "scheduled";
};

export default function WeeklyActivityItem({ day, status, type }: WeeklyActivityItemProps) {
    return (
        <View className="flex-row items-center justify-between py-3 border-b border-slate-50 last:border-b-0">
            <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Text className="text-sm font-bold text-slate-600">M</Text>
                </View>
                <View className="ml-3">
                    <Text className="text-sm font-semibold text-slate-900">{day}</Text>
                    <Text className="text-xs text-slate-400">{status}</Text>
                </View>
            </View>
            {type === "completed" ? (
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            ) : type === "in-progress" ? (
                <View className="h-2 w-2 rounded-full bg-orange-400" />
            ) : null}
        </View>
    );
}
