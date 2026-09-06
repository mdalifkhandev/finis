import { api } from "@/lib/api/client";

export type PublicSubscriptionPlan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly?: number | null;
  maxCompanies?: number | null;
  maxProjects?: number | null;
  maxUsers?: number | null;
  hasGeofencing: boolean;
  hasAdvancedReporting: boolean;
  hasCustomReporting: boolean;
  hasWhiteLabel: boolean;
  supportLevel?: string | null;
  isActive: boolean;
};

export type PublicPlansResponse = {
  plans: PublicSubscriptionPlan[];
};

export type MobileSubscribePayload = {
  planId: string;
  interval: "monthly" | "yearly";
};

export type MobileSubscribeResponse = {
  requiresPayment: boolean;
  subscriptionId?: string;
  paymentIntentClientSecret?: string;
  setupIntentClientSecret?: string;
  customerEphemeralKeySecret?: string;
  customerId?: string;
  publishableKey?: string;
  switched?: boolean;
  message?: string;
};

export type MobileConfirmPayload = {
  subscriptionId: string;
};

export type MobileConfirmResponse = {
  success: boolean;
  subscriptionStatus: string;
  message: string;
};

export async function getPublicPlans(): Promise<PublicSubscriptionPlan[]> {
  const { data } = await api.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: PublicPlansResponse;
  }>("/public/plans");

  if (!data.success) {
    throw new Error(data.message || "Failed to load subscription plans");
  }

  return data.data?.plans ?? [];
}

export async function createMobileSubscription(
  payload: MobileSubscribePayload,
): Promise<MobileSubscribeResponse> {
  const { data } = await api.post<{
    success: boolean;
    statusCode: number;
    message: string;
    data: MobileSubscribeResponse;
  }>("/admin/subscription/mobile/subscribe", payload);

  if (!data.success && !data.data) {
    throw new Error(data.message || "Failed to initialize mobile subscription");
  }

  return data.data;
}

export async function confirmMobileSubscription(
  payload: MobileConfirmPayload,
): Promise<MobileConfirmResponse> {
  const { data } = await api.post<{
    success: boolean;
    statusCode: number;
    message: string;
    data: MobileConfirmResponse;
  }>("/admin/subscription/mobile/confirm", payload);

  if (!data.success && !data.data) {
    throw new Error(data.message || "Failed to confirm mobile subscription");
  }

  return data.data;
}
