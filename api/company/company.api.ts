import type { DocumentItem } from "@/components/company/documents/types";
import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type { AdminCompaniesResponse } from "@/types/admin.types";
import type {
  CreateCompanyPayload,
  CreateCompanyResponse,
} from "@/types/company.types";

function resolveMediaUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

type CompaniesParams = {
  page?: number;
  limit?: number;
};

export async function getCompanies(params: CompaniesParams = {}) {
  const { page = 1, limit = 10 } = params;
  const { data } = await api.get<AdminCompaniesResponse>("/admin/companies", {
    params: { page, limit },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to load companies");
  }

  return {
    data: data.data.map((company) => ({
      ...company,
      logoUrl: resolveMediaUrl(company.logoUrl),
    })),
    meta: data.meta,
  };
}

export async function createCompany(payload: CreateCompanyPayload) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("industry", payload.industry);
  formData.append("description", payload.description);
  formData.append("phone", payload.phone);
  formData.append("email", payload.email);
  formData.append("website", payload.website);
  formData.append("address", payload.address);
  formData.append("revenue", payload.revenue);
  formData.append("projectLevel", payload.projectLevel);

  if (payload.logo) {
    formData.append("logo", {
      uri: payload.logo.uri,
      name: payload.logo.name,
      type: payload.logo.type,
    } as any);
  }

  try {
    const { data } = await api.post<CreateCompanyResponse>(
      "/admin/companies",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to create company");
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

const companyDocuments: DocumentItem[] = [
  {
    id: "company-doc-1",
    fileName: "Project Blueprint.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "John Smith",
    uploadedDate: "1/15/2025",
  },
  {
    id: "company-doc-2",
    fileName: "Safety Guidelines.docx",
    fileType: "DOCX",
    fileSize: "856 KB",
    uploadedBy: "Emily Chen",
    uploadedDate: "1/16/2025",
  },
  {
    id: "company-doc-3",
    fileName: "Budget Breakdown.xlsx",
    fileType: "XLSX",
    fileSize: "1.2 MB",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "1/17/2025",
  },
  {
    id: "company-doc-4",
    fileName: "Site Photos.zip",
    fileType: "ZIP",
    fileSize: "15.8 MB",
    uploadedBy: "Mike Davis",
    uploadedDate: "1/18/2025",
  },
];

const projectDocuments: Record<string, DocumentItem[]> = {
  "riverside-tower": [
    {
      id: "project-doc-1",
      fileName: "Floor Plan v2.pdf",
      fileType: "PDF",
      fileSize: "3.1 MB",
      uploadedBy: "Kristin Watson",
      uploadedDate: "1/20/2025",
    },
    {
      id: "project-doc-2",
      fileName: "Electrical Rough-in Spec.docx",
      fileType: "DOCX",
      fileSize: "1.1 MB",
      uploadedBy: "John Smith",
      uploadedDate: "1/21/2025",
    },
    {
      id: "project-doc-3",
      fileName: "Inspection Checklist.xlsx",
      fileType: "XLSX",
      fileSize: "780 KB",
      uploadedBy: "Emily Chen",
      uploadedDate: "1/22/2025",
    },
  ],
};

const simulateNetwork = async <T>(value: T, delayMs = 200): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });

export async function getCompanyDocuments(): Promise<DocumentItem[]> {
  return simulateNetwork(companyDocuments);
}

export async function getProjectDocuments(
  projectId: string,
): Promise<DocumentItem[]> {
  return simulateNetwork(projectDocuments[projectId] ?? []);
}
