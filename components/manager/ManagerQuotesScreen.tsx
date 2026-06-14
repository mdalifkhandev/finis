import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getManagerQuotes } from "@/api/manager/quotes.api";
import AddCustomQuoteItemModal from "./quotes/AddCustomQuoteItemModal";
import ApplyDiscountModal from "./quotes/ApplyDiscountModal";
import EditQuoteItemModal from "./quotes/EditQuoteItemModal";
import QuoteBuilderForm from "./quotes/QuoteBuilderForm";
import QuoteFinalReviewStep from "./quotes/QuoteFinalReviewStep";
import {
  formatCurrency,
  getQuoteCatalog,
  getQuoteEstimate,
  type QuoteProjectType,
  type QuotePropertyType,
  type QuoteUnitType,
} from "./quotes/quoteMockData";
import { emailQuotePdf, generateQuotePdf } from "./quotes/quotePdf";
import QuoteStepIndicator from "./quotes/QuoteStepIndicator";
import type { QuoteSelectedWorkGroup } from "./quotes/QuoteWorkGroupCard";
import QuoteWorkItemsStep from "./quotes/QuoteWorkItemsStep";
import {
  addCustomQuoteWorkItem,
  buildQuoteSelectedWorkGroups,
  calculateQuoteWorkTotals,
  toggleQuoteWorkGroup,
  toggleQuoteWorkItem,
  updateQuoteWorkItemQuantity,
  updateQuoteWorkItemUnit,
  updateQuoteWorkItemDetails,
} from "./quotes/quoteWorkState";

function getProjectMeta(unitType: QuoteUnitType) {
  switch (unitType) {
    case "House":
      return "2,500 sq ft • 2 floors";
    case "Apartment":
    default:
      return "1,250 sq ft • 1 unit";
  }
}

function getValidUntilLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ManagerQuotesScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientName, setClientName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] =
    useState<QuoteProjectType>("New Build");
  const [propertyType, setPropertyType] =
    useState<QuotePropertyType>("Residential");
  const [unitType, setUnitType] = useState<QuoteUnitType>("Apartment");
  const [workGroups, setWorkGroups] = useState<QuoteSelectedWorkGroup[]>(() =>
    buildQuoteSelectedWorkGroups(
      getQuoteCatalog("New Build", "Residential", "Apartment"),
    ),
  );
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [discountPercentInput, setDiscountPercentInput] = useState("0");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [customItemModalVisible, setCustomItemModalVisible] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customQuantity, setCustomQuantity] = useState("1");
  const [customUnit, setCustomUnit] = useState("pcs");
  const [customUnitPrice, setCustomUnitPrice] = useState("0");
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [editGroupId, setEditGroupId] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editQuantity, setEditQuantity] = useState("1");
  const [editUnit, setEditUnit] = useState("pcs");
  const [editUnitPrice, setEditUnitPrice] = useState("0");

  const quoteFilterQuery = useQuery({
    queryKey: ["manager", "quotes", projectType, propertyType, unitType],
    queryFn: () =>
      getManagerQuotes({
        projectType,
        propertyType,
        unitType,
      }),
    enabled: step === 1,
  });

  // React.useEffect(() => {
  //   if (step !== 1) return;
  //   if (quoteFilterQuery.data !== undefined) {
  //     console.log("[ManagerQuotes] filtered quotes:", quoteFilterQuery.data);
  //   }
  // }, [quoteFilterQuery.data, step]);

  // React.useEffect(() => {
  //   if (step !== 1) return;
  //   console.log("[ManagerQuotes] filter params:", {
  //     projectType,
  //     propertyType,
  //     unitType,
  //   });
  // }, [projectType, propertyType, step, unitType]);

  const catalog = useMemo(
    () => getQuoteCatalog(projectType, propertyType, unitType),
    [projectType, propertyType, unitType],
  );
  const backendQuotes = quoteFilterQuery.data?.quotes ?? [];

  const backendWorkGroups = useMemo(
    () =>
      backendQuotes.map((quote, index) => ({
        id: quote.id,
        title: quote.title,
        expanded: index === 0,
        items: [
          {
            id: quote.id,
            title: quote.title,
            quantity: String(quote.quantity ?? 0),
            unitOptions: [{ unit: quote.unit ?? "pcs", price: quote.unitPrice ?? 0 }],
            selectedUnit: quote.unit ?? "pcs",
            selectedUnitPrice: quote.unitPrice ?? 0,
            selected: true,
            isCustom: quote.isCustom,
          },
        ],
      })),
    [backendQuotes],
  );

  useEffect(() => {
    if (step !== 2 || backendWorkGroups.length === 0) return;
    setWorkGroups(backendWorkGroups);
  }, [backendWorkGroups, step]);
  const estimate = useMemo(
    () => getQuoteEstimate(projectType, propertyType, unitType),
    [projectType, propertyType, unitType],
  );

  const { subtotal, itemsSelected } = useMemo(
    () => calculateQuoteWorkTotals(workGroups),
    [workGroups],
  );

  const discountAmount = useMemo(
    () => subtotal * (appliedDiscountPercent / 100),
    [subtotal, appliedDiscountPercent],
  );
  const finalTotal = subtotal - discountAmount;
  const validUntilLabel = getValidUntilLabel();
  const projectDetailsLabel = `${projectType} • ${propertyType}`;
  const projectMetaLabel = getProjectMeta(unitType);

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
    discountAmount,
    finalTotal,
  };

  const syncCombination = (
    nextProjectType: QuoteProjectType,
    nextPropertyType: QuotePropertyType,
    nextUnitType: QuoteUnitType,
  ) => {
    setProjectType(nextProjectType);
    setPropertyType(nextPropertyType);
    setUnitType(nextUnitType);
    setWorkGroups(
      buildQuoteSelectedWorkGroups(
        getQuoteCatalog(nextProjectType, nextPropertyType, nextUnitType),
      ),
    );
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
      Alert.alert(
        "Email Error",
        "Unable to prepare the quote email right now.",
      );
    }
  };

  const handleAddCustomItem = () => {
    if (!customTitle.trim()) {
      Alert.alert(
        "Missing Service Name",
        "Enter a service name for the custom item.",
      );
      return;
    }

    setWorkGroups((current) =>
      addCustomQuoteWorkItem(
        current,
        customTitle,
        customQuantity,
        customUnit,
        customUnitPrice,
      ),
    );
    setCustomTitle("");
    setCustomQuantity("1");
    setCustomUnit("pcs");
    setCustomUnitPrice("0");
    setCustomItemModalVisible(false);
  };

  const handleOpenEditItem = (groupId: string, itemId: string) => {
    const currentGroup = workGroups.find((group) => group.id === groupId);
    const currentItem = currentGroup?.items.find((item) => item.id === itemId);
    if (!currentItem) return;

    setEditGroupId(groupId);
    setEditItemId(itemId);
    setEditTitle(currentItem.title);
    setEditQuantity(currentItem.quantity);
    setEditUnit(currentItem.selectedUnit);
    setEditUnitPrice(String(currentItem.selectedUnitPrice));
    setEditItemModalVisible(true);
  };

  const handleSaveEditItem = () => {
    if (!editTitle.trim()) {
      Alert.alert("Missing Service Name", "Enter a service name for the item.");
      return;
    }

    setWorkGroups((current) =>
      updateQuoteWorkItemDetails(current, editGroupId, editItemId, {
        title: editTitle,
        quantity: editQuantity,
        unit: editUnit,
        unitPrice: editUnitPrice,
      }),
    );
    setEditItemModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-5 pt-5">
          <Text className="text-center text-[18px] font-semibold text-[#2B2B2B]">
            Quotes
          </Text>
        </View>

        <View className="mt-8 px-5">
          <View className="rounded-[20px] border border-[#D7E0E8] bg-white px-5 py-5 shadow-sm">
            <Text className="text-[18px] font-semibold text-[#1F2937]">
              Construction Quote Builder
            </Text>
            <View className="mt-5">
              <QuoteStepIndicator currentStep={step} totalSteps={3} />
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
              setProjectType={(value) =>
                syncCombination(value, propertyType, unitType)
              }
              propertyType={propertyType}
              setPropertyType={(value) =>
                syncCombination(projectType, value, unitType)
              }
              unitType={unitType}
              setUnitType={(value) =>
                syncCombination(projectType, propertyType, value)
              }
              onNext={() => setStep(2)}
            />
          ) : step === 2 ? (
            <QuoteWorkItemsStep
              catalogTitle={catalog.title}
              catalogDescription={catalog.description}
              groups={workGroups}
              subtotal={subtotal}
              itemsSelected={itemsSelected}
              estimatedTotal={subtotal}
              backendQuotes={backendQuotes}
              onAddCustomItem={() => setCustomItemModalVisible(true)}
              onToggleGroup={(groupId) =>
                setWorkGroups((current) => toggleQuoteWorkGroup(current, groupId))
              }
              onToggleItem={(groupId, itemId) =>
                setWorkGroups((current) =>
                  toggleQuoteWorkItem(current, groupId, itemId),
                )
              }
              onEditItem={handleOpenEditItem}
              onChangeItemQuantity={(groupId, itemId, value) =>
                setWorkGroups((current) =>
                  updateQuoteWorkItemQuantity(current, groupId, itemId, value),
                )
              }
              onSelectItemUnit={(groupId, itemId, unit) =>
                setWorkGroups((current) =>
                  updateQuoteWorkItemUnit(current, groupId, itemId, unit),
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
        discountAmountLabel={formatCurrency(
          subtotal * ((Number(discountPercentInput) || 0) / 100),
        )}
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

      <EditQuoteItemModal
        visible={editItemModalVisible}
        title={editTitle}
        quantity={editQuantity}
        unit={editUnit}
        unitPrice={editUnitPrice}
        onChangeTitle={setEditTitle}
        onChangeQuantity={setEditQuantity}
        onChangeUnit={setEditUnit}
        onChangeUnitPrice={setEditUnitPrice}
        onClose={() => setEditItemModalVisible(false)}
        onSave={handleSaveEditItem}
      />
    </SafeAreaView>
  );
}
