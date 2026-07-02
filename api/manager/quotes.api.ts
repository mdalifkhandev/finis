import { api } from "@/lib/api/client";

export type ManagerQuote = {
  id: string;
  createdById: string;
  projectType: string;
  propertyType: string;
  unitType: string;
  title: string;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  subtotal: number;
  notes: string | null;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
  };
};

export type ManagerQuotesResponse = {
  total: number;
  quotes: ManagerQuote[];
  requestedBy: string;
};

export type UpdateManagerQuotePayload = {
  title?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  notes?: string;
  isCustom?: boolean;
  projectType?: string;
  propertyType?: string;
  unitType?: string;
};

export type CreateManagerQuotePayload = {
  projectType: string;
  propertyType: string;
  unitType: string;
  title: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  notes?: string;
  isCustom?: boolean;
};

export type UploadedQuotePdfResponse = {
  url: string;
  originalName: string;
  mimeType: string;
};

export type SendManagerQuoteMailPayload = {
  clientEmail: string;
  clientName?: string;
  subject: string;
  body: string;
  attachments?: {
    name: string;
    url: string;
    size?: string;
  }[];
};

export async function getManagerQuotes(params?: {
  projectType?: string;
  propertyType?: string;
  unitType?: string;
}) {
  const normalizedParams = {
    projectType: params?.projectType?.toLowerCase(),
    propertyType: params?.propertyType?.toLowerCase(),
    unitType: params?.unitType?.toLowerCase(),
  };


  const { data } = await api.get<{ success: boolean; message: string; data: ManagerQuotesResponse }>(
    "/manager/quotes",
    { params: normalizedParams },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load quotes");
  }

  return data.data;
}

export async function updateManagerQuote(
  id: string,
  payload: UpdateManagerQuotePayload,
) {
  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: ManagerQuote;
  }>(`/manager/quotes/${id}`, payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to update quote");
  }

  return data.data;
}

export async function createManagerQuote(payload: CreateManagerQuotePayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: ManagerQuote;
  }>("/manager/quotes", payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to create quote");
  }

  return data.data;
}

export async function deleteManagerQuote(id: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
  }>(`/manager/quotes/${id}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to delete quote");
  }

  return data;
}

export async function sendManagerQuoteMail(
  payload: SendManagerQuoteMailPayload,
  file?: {
    uri: string;
    name: string;
    type: string;
  },
) {
  const formData = new FormData();
  formData.append("clientEmail", payload.clientEmail);
  formData.append("subject", payload.subject);
  formData.append("body", payload.body);

  if (payload.clientName) {
    formData.append("clientName", payload.clientName);
  }

  if (payload.attachments?.length) {
    formData.append("attachments", JSON.stringify(payload.attachments));
  }

  if (file) {
    formData.append("file", file as any);
  }

  const { data } = await api.post<{
    success?: boolean;
    message?: string;
    data?: unknown;
  }>("/mail/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (data.success === false) {
    throw new Error(data.message || "Failed to send quote");
  }

  return data;
}
