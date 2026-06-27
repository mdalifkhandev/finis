import type { DocumentItem } from "@/components/company/documents/types";
import { AxiosError } from "axios";
import { api } from "@/lib/api/client";
import type { AdminCompaniesResponse } from "@/types/admin.types";
import type { AdminCompanyDetailResponse } from "@/types/admin.types";
import type { ApiResponse } from "@/types/auth.types";
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
  return path;
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
      logoUrl: company.logoUrl,
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
    logoUrl: data.data.logoUrl,
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
        avatarUrl: member.user.avatarUrl,
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
    avatarUrl: contact.avatarUrl,
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
  const { data } = await api.get<ApiResponse<DocumentItem[]>>(
    `/admin/projects/${projectId}/documents`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load project documents");
  }

  return data.data;
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
  try {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: any;
    }>(`/admin/projects/${projectId}/team/managers`, { userId });

    if (!data.success) {
      throw new Error(data.message || "Failed to add manager");
    }

    return data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
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
    `/admin/projects/${projectId}/floors/${floorId}/units`
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load units");
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

export async function removeProjectManager(projectId: string, userId: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/team/${userId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to remove manager");
  }

  return data.data;
}

export async function getProjectManagers(projectId: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: any[];
  }>(`/admin/projects/${projectId}/team/managers`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load project managers");
  }

  return data.data.map((manager: any) => ({
    ...manager,
    avatarUrl: resolveMediaUrl(manager.avatarUrl),
  }));
}

export async function getAvailableWorkers() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: any[];
  }>("/admin/team/available-workers");

  if (!data.success) {
    throw new Error(data.message || "Failed to load available workers");
  }

  return data.data.map((worker: any) => ({
    ...worker,
    avatarUrl: resolveMediaUrl(worker.avatarUrl),
  }));
}

export async function addProjectWorker(projectId: string, payload: { userId: string; managerId: string }) {
  try {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: any;
    }>(`/admin/projects/${projectId}/team/workers`, payload);

    if (!data.success) {
      throw new Error(data.message || "Failed to add worker");
    }

    return data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function getAssignedWorkers(projectId: string, managerId: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: any[];
  }>(`/admin/projects/${projectId}/team/managers/${managerId}/workers`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load assigned workers");
  }

  return data.data.map((worker: any) => ({
    ...worker,
    avatarUrl: resolveMediaUrl(worker.avatarUrl),
  }));
}

export async function removeProjectWorker(projectId: string, userId: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/team/${userId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to remove worker");
  }

  return data.data;
}

export async function getTaskAvailableWorkers(taskId: string, search?: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: any[];
    meta: any;
  }>(`/admin/tasks/${taskId}/available-workers`, {
    params: search ? { search } : undefined,
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to load available workers");
  }

  return {
    data: data.data.map((worker: any) => ({
      ...worker,
      avatarUrl: resolveMediaUrl(worker.avatarUrl),
    })),
    meta: data.meta,
  };
}

export async function assignTaskWorker(taskId: string, userIds: string[]) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/tasks/${taskId}/assign`, { userIds });

  if (!data.success) {
    throw new Error(data.message || "Failed to assign worker");
  }

  return data.data;
}

export type GeofencePoint = { lat: number; lng: number };
export type CompanyGeofence = {
  id: string;
  projectId: string;
  zoneName: string;
  polygonCoords: GeofencePoint[];
  totalAreaSqft: number | null;
  perimeterFt: number | null;
  isActive: boolean;
};

export async function getProjectGeofences(projectId: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: CompanyGeofence[];
  }>(`/admin/projects/${projectId}/geofences`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load geofences");
  }

  return data.data;
}

export async function createProjectGeofence(
  projectId: string,
  payload: {
    zoneName: string;
    polygonCoords: GeofencePoint[];
    totalAreaSqft?: number;
    perimeterFt?: number;
  },
) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: CompanyGeofence;
  }>(`/admin/projects/${projectId}/geofences`, payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to create geofence");
  }

  return data.data;
}

export async function updateProjectGeofence(
  projectId: string,
  geofenceId: string,
  payload: {
    zoneName?: string;
    polygonCoords?: GeofencePoint[];
    totalAreaSqft?: number;
    perimeterFt?: number;
    isActive?: boolean;
  },
) {
  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: CompanyGeofence;
  }>(`/admin/projects/${projectId}/geofences/${geofenceId}`, payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to update geofence");
  }

  return data.data;
}

export async function deleteProjectGeofence(projectId: string, geofenceId: string) {
  const { data } = await api.delete<{
    success: boolean;
    message: string;
    data: CompanyGeofence;
  }>(`/admin/projects/${projectId}/geofences/${geofenceId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to delete geofence");
  }

  return data.data;
}

export async function getProjectGeofenceLocationLogs(projectId: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: Array<{
      id: string;
      worker: { id: string; fullName: string; avatarUrl: string | null; role: string };
      lat: number;
      lng: number;
      eventType: string;
      zoneName: string | null;
      loggedAt: string;
    }>;
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>(`/admin/projects/${projectId}/geofences/location-logs`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load location logs");
  }

  return data;
}

export async function getProjectGeofenceViolations(projectId: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: Array<{
      id: string;
      geofenceName: string;
      distanceM: number;
      description: string;
      isResolved: boolean;
      occurredAt: string;
    }>;
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>(`/admin/projects/${projectId}/geofences/violations`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load violations");
  }

  return data;
}

export async function getProjectGeofenceTimeSummary(projectId: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/projects/${projectId}/geofences/time-summary`);

  if (!data.success) {
    throw new Error(data.message || "Failed to load geofence summary");
  }

  return data.data;
}

import type { TaskDetailsData, TaskDetailsApiResponse } from "../../types/company.types";

export async function getTaskDetails(taskId: string): Promise<TaskDetailsData> {
  const { data } = await api.get<TaskDetailsApiResponse>(`/admin/tasks/${taskId}`);
  
  if (!data.success) {
    throw new Error(data.message || "Failed to load task details");
  }

  return data.data;
}


export async function reviewTaskReport(taskId: string, reportId: string, reviewDecision: string) {
  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: any;
  }>(`/admin/tasks/${taskId}/reports/${reportId}/review`, { reviewDecision });

  if (!data.success) {
    throw new Error(data.message || "Failed to submit review");
  }

  return data.data;
}

export type UpdateAdminTaskPayload = {
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  expenseDescription?: string;
  expenseAmount?: number;
};

export async function updateTask(
  taskId: string,
  payload: UpdateAdminTaskPayload,
  file?: { uri: string; name?: string | null; type?: string | null } | null,
) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });

  if (file?.uri && !file.uri.startsWith("http")) {
    formData.append("file", {
      uri: file.uri,
      name: file.name || "task-expense.jpg",
      type: file.type || "image/jpeg",
    } as any);
  }

  const { data } = await api.put<{
    success: boolean;
    message: string;
    data: TaskDetailsData & { expense?: unknown };
  }>(`/admin/tasks/${taskId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to update task");
  }

  return data.data;
}

