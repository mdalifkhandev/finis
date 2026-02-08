import BackTitleHeader from "@/components/common/BackTitleHeader";
import ContactCard from "@/components/company/contacts/ContactCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const contacts = [
  {
    name: "John Smith",
    designation: "Site Engineer",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  },
  {
    name: "Emily Chen",
    designation: "Project Coordinator",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  },
  {
    name: "Michael Davis",
    designation: "Safety Officer",
    avatarUrl:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=256&auto=format&fit=crop",
  },
];

export default function ContactsRoute() {
  return (
    <SafeAreaView className="flex-1 bg-[#e9edf1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <BackTitleHeader title="Contacts" onBack={() => router.back()} />
        <View className="mt-6 px-5">
          {contacts.map((contact, index) => (
            <View
              key={`${contact.name}-${index}`}
              className={index > 0 ? "mt-4" : ""}
            >
              <ContactCard
                name={contact.name}
                designation={contact.designation}
                avatarUrl={contact.avatarUrl}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
