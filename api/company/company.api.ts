import type { DocumentItem } from "@/components/company/documents/types";
import { AxiosError } from "axios";
import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";
import type { AdminCompaniesResponse } from "@/types/admin.types";
import type { AdminCompanyDetailResponse } from "@/types/admin.types";
import type {
  CreateCompanyPayload,
  CreateProjectPayload,
  CompanyContactsResponse,
  CompanyProjectsResponse,
  CreateCompanyResponse,
  ProjectFloorPlanResponse,
  ProjectProfileResponse,
  UpdateProjectPayload,
  UpdateCompanyPayload,
  ProjectAnalysisResponse,
  TasksListResponse,
  AvailableManagersResponse,
  CompanyProjectTeamMember,
  ProjectFloorsResponse,
  ProjectRoomsResponse,
  CreateTaskPayload,
  CreateTaskResponse,
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

type ProjectPriority = "LOW" | "MEDIUM" | "HIGH";

function normalizeProjectPriority(
  priority: string | undefined,
  status: string,
): ProjectPriority {
  const normalized = (priority ?? "").trim().toUpperCase();

  if (normalized === "HIGH") return "HIGH";
  if (normalized === "LOW") return "LOW";
  if (normalized === "MEDIUM" || normalized === "MEDUIM") return "MEDIUM";

  const normalizedStatus = (status ?? "").trim().toLowerCase();
  if (normalizedStatus === "active") return "HIGH";
  if (normalizedStatus === "pending") return "MEDIUM";

  return "LOW";
}

type CompanyDocumentApiItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSizeMb: number;
  uploadedAt: string;
  uploadedByUser: {
    id: string;
    fullName: string;
  } | null;
};

function buildCompanyFormData(payload: CreateCompanyPayload | UpdateCompanyPayload) {
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

  return formData;
}

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

export async function getCompany(id: string) {
  const { data } = await api.get<AdminCompanyDetailResponse>(
    `/admin/companies/${id}`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load company");
  }

  return {
    ...data.data,
    logoUrl: resolveMediaUrl(data.data.logoUrl),
  };
}

export async function getCompanyProjects(id: string) {
  const { data } = await api.get<CompanyProjectsResponse>(
    `/admin/companies/${id}/projects`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load projects");
  }

  return data.data.map((project) => ({
    ...project,
    priority: normalizeProjectPriority(
      (project as { priority?: string }).priority,
      project.status,
    ),
    teamMembers: project.teamMembers.map((member) => ({
      ...member,
      user: {
        ...member.user,
        avatarUrl: resolveMediaUrl(member.user.avatarUrl),
      },
    })),
  }));
}

export async function getCompanyContacts(id: string) {
  const { data } = await api.get<CompanyContactsResponse>(
    `/admin/companies/${id}/contacts`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load contacts");
  }

  return data.data.map((contact) => ({
    ...contact,
    avatarUrl: resolveMediaUrl(contact.avatarUrl),
  }));
}

export async function createCompany(payload: CreateCompanyPayload) {
  const formData = buildCompanyFormData(payload);

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

export async function updateCompany(
  id: string,
  payload: UpdateCompanyPayload,
) {
  const formData = buildCompanyFormData(payload);

  try {
    const { data } = await api.put<CreateCompanyResponse>(
      `/admin/companies/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to update company");
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

export async function createProject(payload: CreateProjectPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: { id: string };
  }>("/admin/projects", payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to create project");
  }

  return data.data;
}

export async function getProjectProfile(id: string) {
  const { data } = await api.get<ProjectProfileResponse>(
    `/admin/projects/${id}/profile`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load project profile");
  }

  return {
    ...data.data,
    priority: normalizeProjectPriority(data.data.priority, data.data.status),
    client: {
      ...data.data.client,
      logoUrl: resolveMediaUrl(data.data.client.logoUrl),
    },
  };
}

export async function getProjectFloorPlan(id: string) {
  const { data } = await api.get<ProjectFloorPlanResponse>(
    `/admin/projects/${id}/floor-plan`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load floor plan");
  }

  return data.data;
}

export async function updateProject(id: string, payload: UpdateProjectPayload) {
  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: { id: string };
  }>(`/admin/projects/${id}`, payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to update project");
  }

  return data.data;
}

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

export async function getCompanyDocuments(id: string): Promise<DocumentItem[]> {
  try {
    const { data } = await api.get<{
      success: boolean;
      statusCode: number;
      message: string;
      data: CompanyDocumentApiItem[];
    }>(`/admin/companies/${id}/documents`);

    if (!data.success) {
      throw new Error(data.message || "Failed to load company documents");
    }

    return data.data.map((document) => ({
      id: document.id,
      fileName: document.fileName,
      fileType: document.fileType,
      fileSize: `${document.fileSizeMb} MB`,
      uploadedBy: document.uploadedByUser?.fullName ?? "Unknown",
      uploadedDate: new Date(document.uploadedAt).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }),
      fileUrl: resolveMediaUrl(document.fileUrl) ?? "",
    }));
  } catch (error) {
    if (error instanceof AxiosError) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ||
        error.message ||
        "Failed to load company documents";
      throw new Error(message);
    }

    throw error;
  }
}

export async function getProjectDocuments(
  projectId: string,
): Promise<DocumentItem[]> {
  return simulateNetwork(projectDocuments[projectId] ?? []);
}

export async function getProjectAnalysis(id: string) {
  const { data } = await api.get<ProjectAnalysisResponse>(
    `/admin/projects/${id}/analysis`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load project analysis");
  }

  return data.data;
}

type GetTasksParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  projectId?: string;
};

export async function getTasks(params: GetTasksParams = {}) {
  const { data } = await api.get<TasksListResponse>("/admin/tasks", {
    params,
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to load tasks");
  }

  return {
    data: data.data.map((task) => ({
      ...task,
      assignee: task.assignee ? {
        ...task.assignee,
        avatarUrl: resolveMediaUrl(task.assignee.avatarUrl),
      } : null,
    })),
    meta: data.meta,
  };
}

export async function updateTaskStatusApi(id: string, status: string) {
  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/tasks/${id}/status`, { status });

  if (!data.success) {
    throw new Error(data.message || "Failed to update task status");
  }

  return data.data;
}

export async function createProjectFloor(projectId: string, name: string) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/floors`, { name });

  if (!data.success) {
    throw new Error(data.message || "Failed to add floor");
  }

  return data.data;
}

export async function createProjectFloorRooms(
  projectId: string,
  floorId: string,
  startRoomNumber: string,
  endRoomNumber: string,
) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/floors/${floorId}/rooms`, {
    startRoomNumber,
    endRoomNumber,
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to add rooms");
  }

  return data.data;
}

export async function updateProjectFloor(
  projectId: string,
  floorId: string,
  payload: { name: string; status: string; progress: number }
) {
  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/floors/${floorId}`, payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to update floor");
  }

  return data.data;
}

export async function updateProjectRoom(
  projectId: string,
  roomId: string,
  payload: {
    name: string;
    type: string;
    sizeSqft: number;
    status: string;
    progress: number;
  }
) {
  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/rooms/${roomId}`, payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to update room");
  }

  return data.data;
}

export async function deleteProjectFloor(projectId: string, floorId: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/floors/${floorId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to delete floor");
  }

  return data.data;
}

export async function deleteProjectRoom(projectId: string, roomId: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/rooms/${roomId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to delete room");
  }

  return data.data;
}

export async function getAvailableManagers() {
  const { data } = await api.get<AvailableManagersResponse>(
    "/admin/team/available-managers"
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load available managers");
  }

  return data.data.map((manager) => ({
    ...manager,
    avatarUrl: resolveMediaUrl(manager.avatarUrl),
  }));
}

export async function getProjectTeam(projectId: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: { managers: CompanyProjectTeamMember[], workers: any[] };
  }>(`/admin/projects/${projectId}/team`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load project team");
  }

  return {
    managers: data.data.managers.map((member) => ({
      ...member,
      user: {
        ...member.user,
        avatarUrl: resolveMediaUrl(member.user.avatarUrl),
      },
    })),
    workers: data.data.workers,
  };
}

export async function addProjectManager(projectId: string, userId: string) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/team/managers`, { userId });

  if (!data.success) {
    throw new Error(data.message || "Failed to add manager");
  }

  return data.data;
}

export async function getProjectFloors(projectId: string) {
  const { data } = await api.get<ProjectFloorsResponse>(
    `/admin/projects/${projectId}/floors`
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load floors");
  }

  return data.data;
}

export async function getFloorRooms(projectId: string, floorId: string) {
  const { data } = await api.get<ProjectRoomsResponse>(
    `/admin/projects/${projectId}/floors/${floorId}/rooms`
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load rooms");
  }

  return data.data;
}

export async function createTask(payload: CreateTaskPayload) {
  const { data } = await api.post<CreateTaskResponse>(
    `/admin/tasks`,
    payload
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.data;
}
