import React from "react";
import { Text, View } from "react-native";

type QuoteStepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export default function QuoteStepIndicator({
  currentStep,
  totalSteps,
}: QuoteStepIndicatorProps) {
  return (
    <View className="flex-row items-center justify-between py-1">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isFilled = step <= currentStep;
        const isLast = step === totalSteps;

        return (
          <React.Fragment key={step}>
            <View
              className={`h-10 w-10 items-center justify-center rounded-full ${isFilled ? "bg-[#1F5577]" : "bg-[#E7ECF2]"}`}
            >
              <Text
                className={`text-[18px] font-semibold ${isFilled ? "text-white" : "text-[#8B94A1]"}`}
              >
                {step}
              </Text>
            </View>
            {!isLast ? (
              <View className="mx-3 h-[2px] flex-1 bg-[#E5EAF0]" />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}
