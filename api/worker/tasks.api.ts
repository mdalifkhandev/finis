import { api } from "@/lib/api/client";
import { appendImageToFormData } from "@/lib/uploads/image-upload";
import { ApiResponse } from "@/types/auth.types";
import { isAxiosError } from "axios";

export type WorkerTaskKind = "main" | "subtask";

export type WorkerTaskDetail = {
  id: string;
  projectId: string;
  floorId: string | null;
  roomId: string | null;
  assignedTo: string;
  assignedUser?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
  } | null;
  createdBy: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  approvalDecision?: string | null;
  dueDate: string;
  estimatedHours: number | null;
  actualHours: number | null;
  startTime?: string | null;
  endTime?: string | null;
  date?: string | null;
  roomNo?: string | null;
  priorityLabel?: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    location: string | null;
    geofences: any[];
  };
  floor: {
    id: string;
    name: string;
    floorNumber: number;
  } | null;
  room: {
    id: string;
    name: string;
    type: string | null;
  } | null;
  creator: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  beforePhotoUrl?: string | null;
  afterPhotoUrl?: string | null;
  receiptUrl?: string | null;
  note?: string | null;
  reviewDecision?: string | null;
  reviewDescription?: string | null;
  availableInventory?: any[];
  inventoryUsed?: any[];
  latestReport?: any | null;
  workflow?: any | null;
  reports: any[];
  taskInventories: any[];
};

type WorkerTaskDetailResponse = {
  id: string;
  taskId?: string;
  unitId?: string | null;
  createdBy?: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  approvalDecision?: string | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
  dueDate: string;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
  updatedAt: string;
  taskDetails?: {
    project?: {
      id: string;
      name: string;
      location: string | null;
      inventoryItems?: any[];
      geofences?: any[];
    } | null;
    assignedTo?: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
      role: string;
    } | null;
    projectName?: string | null;
    location?: string | null;
    roomNo?: string | null;
    date?: string | null;
    dueDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    estimatedHours?: number | null;
    priority?: string | null;
    priorityLabel?: string | null;
  } | null;
  beforePhotoUrl?: string | null;
  afterPhotoUrl?: string | null;
  receiptUrl?: string | null;
  note?: string | null;
  reviewDecision?: string | null;
  reviewDescription?: string | null;
  availableInventory?: any[];
  inventoryUsed?: any[];
  latestReport?: any | null;
  task?: {
    id: string;
    title?: string;
    priority?: string | null;
    dueDate?: string | null;
    status?: string;
    project?: {
      id: string;
      name: string;
      location: string | null;
      geofences: any[];
    } | null;
    floor?: {
      id: string;
      name: string;
      floorNumber: number;
    } | null;
    unit?: {
      id: string;
      name: string;
      type: string | null;
    } | null;
  } | null;
  unit?: {
    id: string;
    name: string;
    type: string | null;
  } | null;
  creator?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
  reports?: any[];
  inventories?: any[];
};

function normalizeInventoryItems(items?: any[]) {
  return (items ?? []).map((item: any) => ({
    ...item,
    inventoryId: item.inventoryId ?? item.inventory?.id ?? "",
    quantity: item.quantity ?? item.qtyUsed ?? 0,
  }));
}

function mapWorkerSubTaskDetail(raw: WorkerTaskDetailResponse) {
  const taskDetails = raw.taskDetails;
  const project = taskDetails?.project ?? raw.task?.project ?? null;
  const dueDate =
    taskDetails?.dueDate ?? taskDetails?.date ?? raw.dueDate ?? raw.task?.dueDate ?? "";
  const reports = raw.reports ?? [];
  const latestReport = raw.latestReport ?? reports[0] ?? null;
  const reportWithBeforePhoto =
    reports.find((report: any) => report?.beforePhotoUrl) ?? latestReport;
  const reportWithAfterPhoto =
    reports.find((report: any) => report?.afterPhotoUrl) ?? latestReport;
  const reportWithNotes = reports.find((report: any) => report?.notes) ?? latestReport;

  return {
    id: raw.id,
    projectId: project?.id ?? "",
    floorId: raw.task?.floor?.id ?? null,
    roomId: raw.unit?.id ?? raw.task?.unit?.id ?? raw.unitId ?? null,
    assignedTo: taskDetails?.assignedTo?.fullName ?? "",
    assignedUser: taskDetails?.assignedTo ?? null,
    createdBy: raw.createdBy ?? "",
    title: raw.title?.trim() || raw.task?.title?.trim() || "Task",
    description: raw.description ?? "",
    priority: taskDetails?.priority ?? raw.priority ?? raw.task?.priority ?? "",
    status: raw.status,
    approvalDecision: raw.approvalDecision ?? null,
    dueDate,
    estimatedHours: taskDetails?.estimatedHours ?? raw.estimatedHours ?? null,
    actualHours: raw.actualHours ?? null,
    startTime: taskDetails?.startTime ?? raw.startedAt ?? null,
    endTime: taskDetails?.endTime ?? raw.completedAt ?? null,
    date: taskDetails?.date ?? dueDate ?? null,
    roomNo: taskDetails?.roomNo ?? null,
    priorityLabel: taskDetails?.priorityLabel ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    project: {
      id: project?.id ?? "",
      name: taskDetails?.projectName ?? project?.name ?? "",
      location: taskDetails?.location ?? project?.location ?? null,
      geofences: project?.geofences ?? [],
    },
    floor: raw.task?.floor
      ? {
          id: raw.task.floor.id,
          name: raw.task.floor.name,
          floorNumber: raw.task.floor.floorNumber,
        }
      : null,
    room:
      raw.unit ?? raw.task?.unit
        ? {
            id: raw.unit?.id ?? raw.task?.unit?.id ?? "",
            name: raw.unit?.name ?? raw.task?.unit?.name ?? "",
            type: raw.unit?.type ?? raw.task?.unit?.type ?? null,
          }
        : null,
    creator: {
      id: raw.creator?.id ?? "",
      fullName: raw.creator?.fullName ?? "",
      avatarUrl: raw.creator?.avatarUrl ?? null,
    },
    beforePhotoUrl:
      raw.beforePhotoUrl ??
      latestReport?.beforePhotoUrl ??
      reportWithBeforePhoto?.beforePhotoUrl ??
      null,
    afterPhotoUrl:
      raw.afterPhotoUrl ??
      latestReport?.afterPhotoUrl ??
      reportWithAfterPhoto?.afterPhotoUrl ??
      null,
    receiptUrl: raw.receiptUrl ?? raw.latestReport?.receiptUrl ?? null,
    note: raw.note ?? latestReport?.notes ?? reportWithNotes?.notes ?? null,
    reviewDecision: raw.reviewDecision ?? raw.latestReport?.reviewDecision ?? null,
    reviewDescription:
      raw.reviewDescription ?? raw.latestReport?.reviewDescription ?? null,
    availableInventory: raw.availableInventory ?? [],
    inventoryUsed: normalizeInventoryItems(raw.inventoryUsed),
    latestReport,
    reports,
    taskInventories: normalizeInventoryItems(raw.inventoryUsed ?? raw.inventories),
  } as WorkerTaskDetail;
}

function mapWorkerMainTaskDetail(raw: any) {
  const taskDetails = raw.taskDetails ?? null;
  const mainTask = raw.mainTask ?? null;
  const latestReport = raw.latestReport ?? null;
  const reports = raw.reports ?? (latestReport ? [latestReport] : []);

  return {
    id: raw.id,
    projectId: taskDetails?.project?.id ?? mainTask?.project?.id ?? "",
    floorId: null,
    roomId: null,
    assignedTo: taskDetails?.assignedTo?.fullName ?? "",
    assignedUser: taskDetails?.assignedTo ?? null,
    createdBy: "",
    title: raw.title?.trim() || mainTask?.title?.trim() || "Task",
    description: raw.description ?? "",
    priority: raw.priority ?? taskDetails?.priority ?? "",
    status: raw.status ?? mainTask?.status ?? "pending",
    approvalDecision: raw.approvalDecision ?? mainTask?.approvalDecision ?? null,
    dueDate: taskDetails?.dueDate ?? taskDetails?.date ?? "",
    estimatedHours: taskDetails?.estimatedHours ?? null,
    actualHours: raw.actualHours ?? null,
    startTime: taskDetails?.startTime ?? raw.startedAt ?? null,
    endTime: taskDetails?.endTime ?? raw.completedAt ?? null,
    date: taskDetails?.date ?? taskDetails?.dueDate ?? null,
    roomNo: null,
    priorityLabel: taskDetails?.priorityLabel ?? null,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
    project: {
      id: taskDetails?.project?.id ?? mainTask?.project?.id ?? "",
      name:
        taskDetails?.projectName ??
        taskDetails?.project?.name ??
        mainTask?.project?.name ??
        "",
      location:
        taskDetails?.location ??
        taskDetails?.project?.location ??
        mainTask?.project?.location ??
        null,
      geofences: taskDetails?.project?.geofences ?? mainTask?.project?.geofences ?? [],
    },
    floor: null,
    room: null,
    creator: {
      id: "",
      fullName: "",
      avatarUrl: null,
    },
    beforePhotoUrl: raw.beforePhotoUrl ?? latestReport?.beforePhotoUrl ?? null,
    afterPhotoUrl: raw.afterPhotoUrl ?? latestReport?.afterPhotoUrl ?? null,
    receiptUrl: raw.receiptUrl ?? latestReport?.receiptUrl ?? null,
    note: raw.note ?? latestReport?.notes ?? null,
    reviewDecision: raw.reviewDecision ?? latestReport?.reviewDecision ?? null,
    reviewDescription: raw.reviewDescription ?? latestReport?.reviewDescription ?? null,
    availableInventory: raw.availableInventory ?? taskDetails?.project?.inventoryItems ?? [],
    inventoryUsed: normalizeInventoryItems(raw.inventoryUsed),
    latestReport,
    workflow: raw.workflow ?? mainTask?.workflow ?? null,
    reports,
    taskInventories: normalizeInventoryItems(raw.inventoryUsed),
  } as WorkerTaskDetail;
}

export async function getWorkerSubTaskById(id: string) {
  const { data } = await api.get<ApiResponse<WorkerTaskDetailResponse>>(`/worker/subtasks/${id}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch task details");
  }

  return mapWorkerSubTaskDetail(data.data);
}

export async function getWorkerTaskById(id: string) {
  const { data } = await api.get<ApiResponse<any>>(`/worker/main-tasks/${id}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch task details");
  }

  return mapWorkerMainTaskDetail(data.data);
}

export async function startWorkerTask(
  id: string,
  imageUri: string,
  taskType: WorkerTaskKind = "subtask",
) {
  const formData = new FormData();
  appendImageToFormData(
    formData,
    "beforePhoto",
    { uri: imageUri },
    {
      fileName: "before_photo.jpg",
      mimeType: "image/jpeg",
    },
  );

  const endpoint =
    taskType === "main"
      ? `/worker/main-tasks/${id}/start`
      : `/worker/subtasks/${id}/start`;

  try {
    const { data } = await api.post<ApiResponse<any>>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!data.success) {
      throw new Error(data.message || "Failed to start task");
    }
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 413) {
      throw new Error("Photo is too large. Please retake with a smaller image.");
    }
    throw error;
  }
}

export type TaskInventoryItem = {
  id: string;
  name: string;
  category: string;
  currentQty: number;
  unit: string;
  location: string | null;
};

export async function getWorkerTaskInventory(
  taskId: string,
  taskType: WorkerTaskKind = "subtask",
) {
  const endpoint =
    taskType === "main"
      ? `/worker/main-tasks/${taskId}/inventory`
      : `/worker/subtasks/${taskId}/inventory`;

  const { data } = await api.get<ApiResponse<TaskInventoryItem[]>>(endpoint);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch task inventory");
  }
  return data.data;
}

export async function updateWorkerTaskInventory(
  taskId: string,
  inventoryId: string,
  data: {
    name: string;
    category: string;
    unit: string;
    currentQty: number;
    location: string | null;
  },
  taskType: WorkerTaskKind = "subtask",
) {
  const endpoint =
    taskType === "main"
      ? `/worker/main-tasks/${taskId}/inventory/${inventoryId}`
      : `/worker/subtasks/${taskId}/inventory/${inventoryId}`;

  const response = await api.patch<ApiResponse<any>>(endpoint, data);
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update inventory");
  }
  return response.data.data;
}

export async function completeWorkerTaskReport(
  taskId: string,
  afterPhotoUri: string | null,
  inventoryUsed: { inventoryId: string; qtyUsed: number }[],
  notes: string,
  taskType: WorkerTaskKind = "subtask",
) {
  const formData = new FormData();

  if (afterPhotoUri && !afterPhotoUri.startsWith("http")) {
    appendImageToFormData(
      formData,
      "afterPhoto",
      {
        uri: afterPhotoUri,
      },
      {
        fileName: "after_photo.jpg",
        mimeType: "image/jpeg",
      },
    );
  }

  inventoryUsed.forEach((item, index) => {
    formData.append(`inventoryUsed[${index}][inventoryId]`, item.inventoryId);
    formData.append(`inventoryUsed[${index}][qtyUsed]`, String(item.qtyUsed));
  });

  if (notes) {
    formData.append("notes", notes);
  }

  const endpoint =
    taskType === "main"
      ? `/worker/main-tasks/${taskId}/report`
      : `/worker/subtasks/${taskId}/report`;

  let data;
  try {
    const response = await api.post<ApiResponse<any>>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    data = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 413) {
      throw new Error("Photo is too large. Please retake with a smaller image.");
    }

    throw error;
  }

  if (!data.success) {
    throw new Error(data.message || "Failed to submit task report");
  }
  return data.data;
}

export async function getWorkerTasks(page = 1, limit = 10) {
  const { data } = await api.get<ApiResponse<WorkerTaskDetail[]>>(
    `/worker/tasks?page=${page}&limit=${limit}`,
  );
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch tasks");
  }
  return data;
}

export type CreateWorkerSubTaskPayload = {
  unitId: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  estimatedHours?: number;
};

export async function createWorkerSubTask(taskId: string, payload: CreateWorkerSubTaskPayload) {
  const { data } = await api.post<ApiResponse<any>>(`/worker/tasks/${taskId}/subtasks`, payload);
  if (!data.success) {
    throw new Error(data.message || "Failed to create subtask");
  }
  return data.data;
}
