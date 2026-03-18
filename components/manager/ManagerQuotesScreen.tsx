import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuoteBuilderForm from "./quotes/QuoteBuilderForm";
import QuoteFinalReviewStep from "./quotes/QuoteFinalReviewStep";
import QuoteStepIndicator from "./quotes/QuoteStepIndicator";
import QuoteWorkItemsStep from "./quotes/QuoteWorkItemsStep";
import ApplyDiscountModal from "./quotes/ApplyDiscountModal";
import { formatCurrency, getQuoteEstimate, getQuoteWorkGroups, type QuoteProjectType, type QuotePropertyType, type QuoteUnitType } from "./quotes/quoteMockData";
import { generateQuotePdf } from "./quotes/quotePdf";
import type { QuoteSelectedWorkGroup } from "./quotes/QuoteWorkGroupCard";

function buildInitialGroups(projectType: QuoteProjectType, propertyType: QuotePropertyType, unitType: QuoteUnitType): QuoteSelectedWorkGroup[] {
  return getQuoteWorkGroups(projectType, propertyType, unitType).map((group, groupIndex) => ({
    id: group.id,
    title: group.title,
    expanded: groupIndex === 0,
    items: group.items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: String(item.defaultQuantity),
      unitOptions: item.unitOptions,
      selectedUnit: item.unitOptions[0].unit,
      selectedUnitPrice: item.unitOptions[0].price,
      selected: true,
    })),
  }));
}

function getProjectMeta(unitType: QuoteUnitType) {
  switch (unitType) {
    case "House":
      return "2,500 sq ft • 2 floors";
    case "Apartment":
      return "1,250 sq ft • 1 unit";
    case "Office":
      return "3,200 sq ft • 1 office suite";
    case "Hotel":
      return "4,800 sq ft • 8 rooms";
    default:
      return "Project meta pending";
  }
}

function getValidUntilLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ManagerQuotesScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientName, setClientName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<QuoteProjectType>("New Build");
  const [propertyType, setPropertyType] = useState<QuotePropertyType>("Residential");
  const [unitType, setUnitType] = useState<QuoteUnitType>("Apartment");
  const [workGroups, setWorkGroups] = useState<QuoteSelectedWorkGroup[]>(() => buildInitialGroups("New Build", "Residential", "Apartment"));
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [discountPercentInput, setDiscountPercentInput] = useState("0");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);

  useEffect(() => {
    setWorkGroups(buildInitialGroups(projectType, propertyType, unitType));
  }, [projectType, propertyType, unitType]);

  const estimate = useMemo(() => getQuoteEstimate(projectType, propertyType, unitType), [projectType, propertyType, unitType]);

  const subtotal = useMemo(
    () => workGroups.reduce(
      (groupTotal, group) =>
        groupTotal +
        group.items.reduce((itemTotal, item) => {
          if (!item.selected) return itemTotal;
          return itemTotal + (Number(item.quantity) || 0) * item.selectedUnitPrice;
        }, 0),
      0,
    ),
    [workGroups],
  );

  const itemsSelected = useMemo(
    () => workGroups.reduce((total, group) => total + group.items.filter((item) => item.selected).length, 0),
    [workGroups],
  );

  const rushTimelineFee = useMemo(() => subtotal * 0.15, [subtotal]);
  const afterHoursFee = useMemo(() => (itemsSelected > 0 ? 1200 : 0), [itemsSelected]);
  const discountAmount = useMemo(() => subtotal * (appliedDiscountPercent / 100), [subtotal, appliedDiscountPercent]);
  const finalTotal = subtotal + rushTimelineFee + afterHoursFee - discountAmount;
  const visibleStep = step;
  const validUntilLabel = getValidUntilLabel();
  const projectDetailsLabel = `${projectType} • ${propertyType}`;
  const projectMetaLabel = getProjectMeta(unitType);

  const handleGeneratePdf = async () => {
    try {
      await generateQuotePdf({
        clientName,
        projectAddress,
        projectType,
        propertyType,
        unitType,
        estimate,
        projectMetaLabel,
        validUntilLabel,
        workGroups,
        subtotal,
        rushTimelineFee,
        afterHoursFee,
        discountAmount,
        finalTotal,
      });
    } catch {
      Alert.alert("PDF Error", "Unable to generate the quote PDF right now.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-5">
          <Text className="text-center text-[18px] font-semibold text-[#2B2B2B]">Quotes</Text>
        </View>

        <View className="mt-8 px-5">
          <View className="rounded-[20px] border border-[#D7E0E8] bg-white px-5 py-5 shadow-sm">
            <Text className="text-[18px] font-semibold text-[#1F2937]">Construction Quote Builder</Text>
            <View className="mt-5">
              <QuoteStepIndicator currentStep={visibleStep} totalSteps={3} />
            </View>
          </View>

          {step === 1 ? (
            <QuoteBuilderForm
              clientName={clientName}
              setClientName={setClientName}
              projectAddress={projectAddress}
              setProjectAddress={setProjectAddress}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={email}
              setEmail={setEmail}
              projectType={projectType}
              setProjectType={setProjectType}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              unitType={unitType}
              setUnitType={setUnitType}
              onNext={() => setStep(2)}
            />
          ) : step === 2 ? (
            <QuoteWorkItemsStep
              groups={workGroups}
              subtotal={subtotal}
              itemsSelected={itemsSelected}
              estimatedTotal={finalTotal}
              onToggleGroup={(groupId) =>
                setWorkGroups((current) => current.map((group) => (group.id === groupId ? { ...group, expanded: !group.expanded } : group)))
              }
              onToggleItem={(groupId, itemId) =>
                setWorkGroups((current) =>
                  current.map((group) =>
                    group.id === groupId
                      ? {
                          ...group,
                          items: group.items.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)),
                        }
                      : group,
                  ),
                )
              }
              onChangeItemQuantity={(groupId, itemId, value) =>
                setWorkGroups((current) =>
                  current.map((group) =>
                    group.id === groupId
                      ? {
                          ...group,
                          items: group.items.map((item) => (item.id === itemId ? { ...item, quantity: value } : item)),
                        }
                      : group,
                  ),
                )
              }
              onSelectItemUnit={(groupId, itemId, unit) =>
                setWorkGroups((current) =>
                  current.map((group) =>
                    group.id === groupId
                      ? {
                          ...group,
                          items: group.items.map((item) => {
                            if (item.id !== itemId) return item;
                            const option = item.unitOptions.find((unitOption) => unitOption.unit === unit);
                            return option
                              ? { ...item, selectedUnit: option.unit, selectedUnitPrice: option.price }
                              : item;
                          }),
                        }
                      : group,
                  ),
                )
              }
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : (
            <QuoteFinalReviewStep
              clientName={clientName}
              projectAddress={projectAddress}
              projectType={projectType}
              propertyType={propertyType}
              unitType={unitType}
              estimate={estimate}
              workGroups={workGroups}
              subtotal={subtotal}
              itemsSelected={itemsSelected}
              rushTimelineFee={rushTimelineFee}
              afterHoursFee={afterHoursFee}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              validUntilLabel={validUntilLabel}
              projectDetailsLabel={projectDetailsLabel}
              projectMetaLabel={projectMetaLabel}
              onEditSummary={() => setStep(1)}
              onEditWorkItems={() => setStep(2)}
              onOpenDiscount={() => {
                setDiscountPercentInput(String(appliedDiscountPercent || 0));
                setDiscountModalVisible(true);
              }}
              onGeneratePdf={handleGeneratePdf}
            />
          )}
        </View>
      </ScrollView>

      <ApplyDiscountModal
        visible={discountModalVisible}
        value={discountPercentInput}
        onChangeValue={setDiscountPercentInput}
        discountAmountLabel={formatCurrency(subtotal * ((Number(discountPercentInput) || 0) / 100))}
        onClose={() => setDiscountModalVisible(false)}
        onApply={() => {
          setAppliedDiscountPercent(Number(discountPercentInput) || 0);
          setDiscountModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
