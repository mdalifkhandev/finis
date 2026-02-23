import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

type WorkerTaskCardProps = {
    priority: TaskPriority;
    title: string;
    location: string;
    assignedAvatars: string[];
    commentsCount: number;
    onPress?: () => void;
};

export default function WorkerTaskCard({
    priority,
    title,
    location,
    assignedAvatars,
    commentsCount,
    onPress,
}: WorkerTaskCardProps) {
    const priorityColor =
        priority === "HIGH" ? "bg-red-50" : priority === "MEDIUM" ? "bg-yellow-50" : "bg-blue-50";
    const priorityText =
        priority === "HIGH" ? "text-red-500" : priority === "MEDIUM" ? "text-yellow-500" : "text-blue-500";

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            className="mx-5 mb-4 rounded-3xl bg-white p-5 border border-slate-100 shadow-sm"
        >
            <View className="flex-row items-center justify-between">
                <View className={`rounded-md px-2 py-1 ${priorityColor}`}>
                    <Text className={`text-[10px] font-bold ${priorityText}`}>{priority}</Text>
                </View>
                <FontAwesome5 name="home" size={14} color="#1e293b" />
            </View>

            <Text className="mt-3 text-base font-bold text-slate-900">{title}</Text>
            <Text className="text-sm text-slate-400">{location}</Text>

            <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    {assignedAvatars.slice(0, 3).map((uri, index) => (
                        <Image
                            key={index}
                            source={{ uri }}
                            className={`h-7 w-7 rounded-full border-2 border-white ${index > 0 ? "-ml-2" : ""}`}
                        />
                    ))}
                    {assignedAvatars.length > 3 && (
                        <View className="-ml-2 h-7 w-7 items-center justify-center rounded-full bg-green-500 border-2 border-white">
                            <Text className="text-[8px] font-bold text-white">+{assignedAvatars.length - 3}</Text>
                        </View>
                    )}
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="chatbubble-outline" size={14} color="#94a3b8" />
                    <Text className="ml-1 text-xs text-slate-400">{commentsCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
