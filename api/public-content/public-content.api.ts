import { api } from "@/lib/api/client";

export type PublicContentPage = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  body?: unknown;
  sections?: unknown;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type WorkerSupportRequestPayload = {
  sendTo: "admin" | "manager";
  message: string;
};

export async function getPublicContentPage(slug: string) {
  return api
    .get<ApiResponse<PublicContentPage>>(`/public/content/${slug}`)
    .then((response) => response.data.data);
}

export async function createWorkerSupportRequest(
  payload: WorkerSupportRequestPayload,
) {
  return api
    .post<ApiResponse<{ notification?: unknown }>>("/worker/support", payload)
    .then((response) => response.data);
}
