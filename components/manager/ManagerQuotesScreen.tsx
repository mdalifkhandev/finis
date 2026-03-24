import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuoteBuilderForm, { type QuoteProjectDetailSelection } from "./quotes/QuoteBuilderForm";
import QuoteFinalReviewStep from "./quotes/QuoteFinalReviewStep";
import QuoteStepIndicator from "./quotes/QuoteStepIndicator";
import QuoteWorkItemsStep from "./quotes/QuoteWorkItemsStep";
import ApplyDiscountModal from "./quotes/ApplyDiscountModal";
import AddCustomQuoteItemModal from "./quotes/AddCustomQuoteItemModal";
import { formatCurrency, getQuoteEstimate, getQuoteWorkGroups, type QuoteProjectType, type QuotePropertyType, type QuoteUnitType } from "./quotes/quoteMockData";
import { emailQuotePdf, generateQuotePdf } from "./quotes/quotePdf";
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
      selected: false,
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

function getCatalogLabel(projectType: QuoteProjectType, propertyType: QuotePropertyType, unitType: QuoteUnitType) {
  return `${projectType} ${propertyType} ${unitType}`;
}

function mapProjectDetailSelection(value: QuoteProjectDetailSelection): {
  projectType: QuoteProjectType;
  propertyType: QuotePropertyType;
} {
  switch (value) {
    case "Renovation":
      return { projectType: "Renovation", propertyType: "Residential" };
    case "Commercial":
      return { projectType: "New Build", propertyType: "Commercial" };
    case "Residential":
      return { projectType: "New Build", propertyType: "Residential" };
    case "New Build":
    default:
      return { projectType: "New Build", propertyType: "Residential" };
  }
}

export default function ManagerQuotesScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientName, setClientName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [projectDetailSelection, setProjectDetailSelection] = useState<QuoteProjectDetailSelection>("New Build");
  const [projectType, setProjectType] = useState<QuoteProjectType>("New Build");
  const [propertyType, setPropertyType] = useState<QuotePropertyType>("Residential");
  const [unitType, setUnitType] = useState<QuoteUnitType>("Apartment");
  const [workGroups, setWorkGroups] = useState<QuoteSelectedWorkGroup[]>(() => buildInitialGroups("New Build", "Residential", "Apartment"));
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [discountPercentInput, setDiscountPercentInput] = useState("0");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [customItemModalVisible, setCustomItemModalVisible] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customQuantity, setCustomQuantity] = useState("1");
  const [customUnit, setCustomUnit] = useState("pcs");
  const [customUnitPrice, setCustomUnitPrice] = useState("0");

  useEffect(() => {
    const mappedSelection = mapProjectDetailSelection(projectDetailSelection);
    setProjectType(mappedSelection.projectType);
    setPropertyType(mappedSelection.propertyType);
  }, [projectDetailSelection]);

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
  const catalogLabel = getCatalogLabel(projectType, propertyType, unitType);

  const quoteParams = {
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
  };

  const handleGeneratePdf = async () => {
    try {
      await generateQuotePdf(quoteParams);
    } catch {
      Alert.alert("PDF Error", "Unable to generate the quote PDF right now.");
    }
  };

  const handleEmailQuote = async () => {
    try {
      await emailQuotePdf({ ...quoteParams, recipientEmail: email });
    } catch {
      Alert.alert("Email Error", "Unable to prepare the quote email right now.");
    }
  };

  const handleAddCustomItem = () => {
    if (!customTitle.trim()) {
      Alert.alert("Missing Service Name", "Enter a service name for the custom item.");
      return;
    }

    const quantityValue = Number(customQuantity) || 0;
    const unitPriceValue = Number(customUnitPrice) || 0;
    const unitLabel = customUnit.trim() || "pcs";

    setWorkGroups((current) => {
      const customGroup = current.find((group) => group.id === "custom-items");
      const customItem = {
        id: `custom-${Date.now()}`,
        title: customTitle.trim(),
        quantity: String(quantityValue || 1),
        unitOptions: [{ unit: unitLabel, price: unitPriceValue }],
        selectedUnit: unitLabel,
        selectedUnitPrice: unitPriceValue,
        selected: true,
        isCustom: true,
      };

      if (customGroup) {
        return current.map((group) =>
          group.id === "custom-items"
            ? { ...group, expanded: true, items: [...group.items, customItem] }
            : group,
        );
      }

      return [
        ...current,
        {
          id: "custom-items",
          title: "Custom Items",
          expanded: true,
          items: [customItem],
        },
      ];
    });

    setCustomTitle("");
    setCustomQuantity("1");
    setCustomUnit("pcs");
    setCustomUnitPrice("0");
    setCustomItemModalVisible(false);
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
              projectDetailSelection={projectDetailSelection}
              onSelectProjectDetail={setProjectDetailSelection}
              unitType={unitType}
              setUnitType={setUnitType}
              onNext={() => setStep(2)}
            />
          ) : step === 2 ? (
            <QuoteWorkItemsStep
              catalogLabel={catalogLabel}
              groups={workGroups}
              subtotal={subtotal}
              itemsSelected={itemsSelected}
              estimatedTotal={finalTotal}
              onAddCustomItem={() => setCustomItemModalVisible(true)}
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
              onEmailQuote={handleEmailQuote}
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

      <AddCustomQuoteItemModal
        visible={customItemModalVisible}
        title={customTitle}
        quantity={customQuantity}
        unit={customUnit}
        unitPrice={customUnitPrice}
        onChangeTitle={setCustomTitle}
        onChangeQuantity={setCustomQuantity}
        onChangeUnit={setCustomUnit}
        onChangeUnitPrice={setCustomUnitPrice}
        onClose={() => setCustomItemModalVisible(false)}
        onAdd={handleAddCustomItem}
      />
    </SafeAreaView>
  );
}
