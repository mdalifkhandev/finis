import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function FaqRoute() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleClose = () => {
    toast.error("Please accept the Terms & Conditions to continue.");
  };

  const handleNext = () => {
    if (!accepted) {
      toast.error("Please accept the Terms & Conditions to continue.");
      return;
    }

    router.push("/screens/auth/welcome");
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#A8A8A8]">
      <View className="flex-1 justify-center px-5">
        <View className="rounded-3xl bg-[#F5F5F5] p-4">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-[32px] font-semibold text-[#262626]">
              Terms & Condition
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#141414" />
            </TouchableOpacity>
          </View>

          <Text className="text-[18px] font-medium text-[#303030]">
            Welcome to Services App !
          </Text>

          <Text className="mt-4 text-[14px] leading-6 text-[#4A4A4A]">
            Accessing or using our services, you agree to be bound by these
            Terms of Service. If you do not agree with any part of the terms,
            you must not use our services.
          </Text>

          <Text className="mt-5 text-[16px] font-medium text-[#1C1C1C]">
            2. User Responsibilities As a user, you agree to:
          </Text>

          <Text className="mt-2 text-[14px] leading-6 text-[#4A4A4A]">
            • Use the service only for lawful purposes.
          </Text>
          <Text className="text-[14px] leading-6 text-[#4A4A4A]">
            • Provide accurate and complete information when required.
          </Text>
          <Text className="text-[14px] leading-6 text-[#4A4A4A]">
            • Maintain the confidentiality of your account password.
          </Text>

          <Text className="mt-5 text-[16px] font-medium text-[#1C1C1C]">
            3. Intellectual Property
          </Text>
          <Text className="mt-2 text-[14px] leading-6 text-[#4A4A4A]">
            All content, trademarks, and data on this service, including but not
            limited to text, graphics, logos, and images, are the property of
            [Your Company Name]
          </Text>

          <Text className="mt-5 text-[16px] font-medium text-[#1C1C1C]">
            4. Disclaimers
          </Text>
          <Text className="mt-2 text-[14px] leading-6 text-[#4A4A4A]">
            The service is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. [Your Company Name] makes no warranties,
            expressed or implied, regarding the operation.
          </Text>

          <Pressable
            className="mt-5 flex-row items-center"
            onPress={() => setAccepted((value) => !value)}
          >
            <View className="h-5 w-5 items-center justify-center rounded border border-[#19557A]">
              {accepted ? (
                <Ionicons name="checkmark" size={14} color="#19557A" />
              ) : null}
            </View>
            <Text className="ml-2 text-[14px] text-[#2C2C2C]">
              Accept{" "}
              <Text className="text-[#19557A] underline">
                terms & conditions
              </Text>
            </Text>
          </Pressable>

          <TouchableOpacity
            className={`mt-6 h-14 items-center justify-center rounded-xl border ${
              accepted
                ? "border-[#19557A] bg-white"
                : "border-[#A8B0B8] bg-[#E7EAED]"
            }`}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text
              className={`text-[18px] font-semibold ${
                accepted ? "text-[#19557A]" : "text-[#8C96A0]"
              }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
