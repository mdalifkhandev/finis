import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME = {
  colors: {
    background: "#FFFFFF",
    white: "#FFFFFF",
    textMain: "#1A1C1E",
    textSecondary: "#475569",
    border: "#F1F5F9",
    accent: "#1D4F6D",
  },
};

const FAQItem = ({
  number,
  question,
  answer,
  isExpanded,
  onPress,
}: {
  number: number;
  question: string;
  answer: string;
  isExpanded: boolean;
  onPress: () => void;
}) => (
  <View
    style={{ borderBottomWidth: 1, borderBottomColor: THEME.colors.border }}
  >
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 24,
      }}
    >
      <Text
        style={{ fontSize: 16, color: "#475569", fontWeight: "500", width: 24 }}
      >
        {number}.
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          color: "#1D4F6D",
          fontWeight: "600",
          marginLeft: 4,
        }}
      >
        {question}
      </Text>
      <Feather
        name={isExpanded ? "chevron-down" : "chevron-right"}
        size={20}
        color="#94A3B8"
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>

    {isExpanded && (
      <View style={{ paddingBottom: 24, paddingLeft: 28 }}>
        <Text style={{ fontSize: 14, color: "#64748B", lineHeight: 22 }}>
          {answer}
        </Text>
      </View>
    )}
  </View>
);

const FAQScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a delivery?",
      answer:
        "To book a delivery, navigate to the Home screen, select 'New Task', and follow the prompts to enter package details, pickup location, and destination. Once confirmed, you'll be matched with a carrier.",
    },
    {
      question: "What items can I send?",
      answer:
        "You can send most household goods, documents, and retail items. Ensure that items are properly packaged to prevent damage during transit.",
    },
    {
      question: "What items are not allowed?",
      answer:
        "Hazardous materials, illegal substances, perishable goods without proper cooling, and extremely fragile items without insurance are generally not allowed. Please refer to our full terms of service for a complete list.",
    },
    {
      question: "How much does delivery cost?",
      answer:
        "Pricing depends on distance, item size, and weight. You'll receive a transparent quote before finalize your booking. Standard rates apply, and premium options are available for faster delivery.",
    },
    {
      question: "Can I negotiate the delivery price?",
      answer:
        "Currently, our pricing is fixed based on a standardized algorithm to ensure fairness for both customers and workers. However, we occasionally offer promotion codes and volume discounts.",
    },
    {
      question: "How do I track my delivery?",
      answer:
        "Once a task is in progress, you can track it in real-time through the 'Active Tasks' section. You'll see the current location of the worker and get live updates on the delivery status.",
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      edges={['top','left',"right"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 20 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name="chevron-left"
            size={32}
            color={THEME.colors.textMain}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: THEME.colors.textMain,
          }}
        >
          FAQ
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            number={index + 1}
            question={faq.question}
            answer={faq.answer}
            isExpanded={expandedIndex === index}
            onPress={() => toggleExpand(index)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;
