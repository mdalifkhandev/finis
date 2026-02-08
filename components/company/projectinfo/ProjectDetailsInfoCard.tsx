import React from "react";
import { Text, View } from "react-native";
import ProjectInfoRow from "./ProjectInfoRow";

export default function ProjectDetailsInfoCard() {
  return (
    <View className="mt-3.5 rounded-xl border border-[#D8DEE5] bg-[#F7F9FB] px-3.5 py-3.5">
      <Text className="text-[16px] font-medium text-[#111827]">Project details</Text>

      <Text className="mt-3 text-[15px] text-[#6B7687]">Description</Text>
      <Text className="mt-1 text-[16px] leading-[28px] text-[#222B37]">
        We partner with industry-leading print providers to ensure your creations
        come to life with exceptional quality
      </Text>

      <View className="mt-3 border-t border-[#D4D9E0]" />

      <Text className="mt-3 text-[16px] font-medium text-[#4B5563]">Client Info</Text>

      <ProjectInfoRow label="Name" value="Kristin Watson" />
      <ProjectInfoRow
        label="Company"
        value={
          <View className="flex-row items-center">
            <Text className="mr-1 text-[15px] font-bold text-[#74B816]">x</Text>
            <Text className="text-[15px] text-[#111827]">Xing</Text>
          </View>
        }
      />
      <ProjectInfoRow
        label="Connection"
        value={
          <View className="rounded-md bg-[#DDE4FF] px-2 py-0.5">
            <Text className="text-[11px] font-medium text-[#1F4BFF]">eEmployee</Text>
          </View>
        }
      />
      <ProjectInfoRow label="Email" value="kristinwatson@mail.com" />
      <ProjectInfoRow label="Phone number" value="(303) 555-0105" />
    </View>
  );
}

