import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createManagerQuote,
  deleteManagerQuote,
  getManagerQuotes,
  updateManagerQuote,
} from "@/api/manager/quotes.api";
import { useAuthStore } from "@/store/auth.store";
import AddCustomQuoteItemModal from "./quotes/AddCustomQuoteItemModal";
import ApplyDiscountModal from "./quotes/ApplyDiscountModal";
import EditQuoteItemModal from "./quotes/EditQuoteItemModal";
import QuoteBuilderForm from "./quotes/QuoteBuilderForm";
import QuoteFinalReviewStep from "./quotes/QuoteFinalReviewStep";
import {
  formatCurrency,
  type QuoteProjectType,
  type QuotePropertyType,
  type QuoteUnitType,
} from "./quotes/quoteTypes";
import { emailQuotePdf, generateQuotePdf } from "./quotes/quotePdf";
import QuoteStepIndicator from "./quotes/QuoteStepIndicator";
import type { QuoteSelectedWorkGroup } from "./quotes/QuoteWorkGroupCard";
import QuoteWorkItemsStep from "./quotes/QuoteWorkItemsStep";
import {
  addCustomQuoteWorkItem,
  calculateQuoteWorkTotals,
  deleteQuoteWorkItem,
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
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientName, setClientName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [projectType, setProjectType] =
    useState<QuoteProjectType>("New Build");
  const [propertyType, setPropertyType] =
    useState<QuotePropertyType>("Residential");
  const [unitType, setUnitType] = useState<QuoteUnitType>("Apartment");
  const [workGroups, setWorkGroups] = useState<QuoteSelectedWorkGroup[]>([]);
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
  const defaultClientName = currentUser?.fullName || currentUser?.name || "Walk-in Client";
  const defaultEmail = currentUser?.email || "";
  const defaultPhone = currentUser?.phone || "";
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
            selected: false,
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
    estimatedTime: estimatedTime || "",
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
    setWorkGroups([]);
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

    const nextQuantity = Number(customQuantity) || 1;
    const nextUnitPrice = Number(customUnitPrice) || 0;

    createManagerQuote({
      projectType: projectType.toLowerCase(),
      propertyType: propertyType.toLowerCase(),
      unitType: unitType.toLowerCase(),
      title: customTitle.trim(),
      quantity: nextQuantity,
      unit: customUnit.trim() || "pcs",
      unitPrice: nextUnitPrice,
      notes: "",
      isCustom: true,
    })
      .then((createdQuote) => {
        setWorkGroups((current) =>
          addCustomQuoteWorkItem(
            current,
            createdQuote.title,
            String(createdQuote.quantity),
            createdQuote.unit ?? "pcs",
            String(createdQuote.unitPrice),
          ),
        );
        void queryClient.fetchQuery({
          queryKey: ["manager", "quotes", projectType, propertyType, unitType],
          queryFn: () =>
            getManagerQuotes({
              projectType,
              propertyType,
              unitType,
            }),
        });
        setCustomTitle("");
        setCustomQuantity("1");
        setCustomUnit("pcs");
        setCustomUnitPrice("0");
        setCustomItemModalVisible(false);
      })
      .catch(() => {
        Alert.alert("Create Error", "Unable to add the custom item right now.");
      });
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

  const handleDeleteItem = (groupId: string, itemId: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteManagerQuote(itemId)
            .then(() => {
              setWorkGroups((current) =>
                deleteQuoteWorkItem(current, groupId, itemId),
              );
              void queryClient.fetchQuery({
                queryKey: ["manager", "quotes", projectType, propertyType, unitType],
                queryFn: () =>
                  getManagerQuotes({
                    projectType,
                    propertyType,
                    unitType,
                  }),
              });
            })
            .catch(() => {
              Alert.alert("Delete Error", "Unable to delete the quote item.");
            });
        },
      },
    ]);
  };

  const handleSaveEditItem = () => {
    if (!editTitle.trim()) {
      Alert.alert("Missing Service Name", "Enter a service name for the item.");
      return;
    }

    const nextQuantity = Number(editQuantity) || 0;
    const nextUnitPrice = Number(editUnitPrice) || 0;

    updateManagerQuote(editItemId, {
      title: editTitle,
      quantity: nextQuantity,
      unit: editUnit,
      unitPrice: nextUnitPrice,
      isCustom: true,
    })
      .then((updatedQuote) => {
        setWorkGroups((current) =>
          updateQuoteWorkItemDetails(current, editGroupId, editItemId, {
            title: updatedQuote.title,
            quantity: String(updatedQuote.quantity),
            unit: updatedQuote.unit ?? "pcs",
            unitPrice: String(updatedQuote.unitPrice),
          }),
        );
        void queryClient.fetchQuery({
          queryKey: ["manager", "quotes", projectType, propertyType, unitType],
          queryFn: () =>
            getManagerQuotes({
              projectType,
              propertyType,
              unitType,
            }),
        });
        setEditItemModalVisible(false);
      })
      .catch(() => {
        Alert.alert("Update Error", "Unable to save the quote update right now.");
      });
  };

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
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
              defaultClientName={defaultClientName}
              defaultPhone={defaultPhone}
              defaultEmail={defaultEmail}
              estimatedTime={estimatedTime}
              setEstimatedTime={setEstimatedTime}
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
              catalogTitle={backendQuotes.length ? "Backend Quote Items" : "No Backend Quote Items"}
              catalogDescription={
                backendQuotes.length
                  ? "These items are loaded from the server."
                  : "No quotes returned from the backend for this combination."
              }
              groups={workGroups}
              subtotal={subtotal}
              itemsSelected={itemsSelected}
              estimatedTotal={subtotal}
              estimatedTime={estimatedTime}
              onChangeEstimatedTime={setEstimatedTime}
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
              onDeleteItem={handleDeleteItem}
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
              clientName={clientName || defaultClientName}
              projectAddress={projectAddress || "Address pending"}
              projectType={projectType}
              propertyType={propertyType}
              unitType={unitType}
              estimatedTime={estimatedTime }
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
