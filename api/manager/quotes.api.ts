import { api } from "@/lib/api/client";

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


  const { data } = await api.get<{ success: boolean; message: string; data: unknown }>(
    "/manager/quotes",
    { params: normalizedParams },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load quotes");
  }

  return data.data;
}
