import { api } from "@/lib/api/client";
import { appendImageToFormData } from "@/lib/uploads/image-upload";
import { ApiResponse } from "@/types/auth.types";
import { isAxiosError } from "axios";

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

function mapWorkerSubTaskDetail(raw: WorkerTaskDetailResponse) {
  const taskDetails = raw.taskDetails;
  const project = taskDetails?.project ?? raw.task?.project ?? null;
  const dueDate = taskDetails?.dueDate ?? taskDetails?.date ?? raw.dueDate ?? raw.task?.dueDate ?? "";
  const reports = raw.reports ?? [];
  const latestReport = raw.latestReport ?? reports[0] ?? null;
  const reportWithBeforePhoto = reports.find((report: any) => report?.beforePhotoUrl) ?? latestReport;
  const reportWithAfterPhoto = reports.find((report: any) => report?.afterPhotoUrl) ?? latestReport;
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
    room: raw.unit ?? raw.task?.unit
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
    beforePhotoUrl: raw.beforePhotoUrl ?? latestReport?.beforePhotoUrl ?? reportWithBeforePhoto?.beforePhotoUrl ?? null,
    afterPhotoUrl: raw.afterPhotoUrl ?? latestReport?.afterPhotoUrl ?? reportWithAfterPhoto?.afterPhotoUrl ?? null,
    receiptUrl: raw.receiptUrl ?? raw.latestReport?.receiptUrl ?? null,
    note: raw.note ?? latestReport?.notes ?? reportWithNotes?.notes ?? null,
    reviewDecision: raw.reviewDecision ?? raw.latestReport?.reviewDecision ?? null,
    reviewDescription: raw.reviewDescription ?? raw.latestReport?.reviewDescription ?? null,
    availableInventory: raw.availableInventory ?? [],
    latestReport,
    reports,
    taskInventories: ((raw.inventoryUsed ?? raw.inventories) ?? []).map((item: any) => ({
      ...item,
      inventoryId: item.inventoryId ?? item.inventory?.id ?? "",
      quantity: item.quantity ?? item.qtyUsed ?? 0,
    })),
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
  const { data } = await api.get<ApiResponse<WorkerTaskDetailResponse>>(`/worker/tasks/${id}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch task details");
  }

  return mapWorkerSubTaskDetail(data.data);
}

export async function startWorkerTask(id: string) {
  const { data } = await api.post<ApiResponse<any>>(`/worker/subtasks/${id}/start`);
  if (!data.success) {
    throw new Error(data.message || "Failed to start task");
  }
  return data.data;
}

export async function reportWorkerTaskBeforePhoto(id: string, imageUri: string) {
  const formData = new FormData();
  appendImageToFormData(formData, "beforePhoto", {
    uri: imageUri,
  }, {
    fileName: "before_photo.jpg",
    mimeType: "image/jpeg",
  });

  try {
    const { data } = await api.put<ApiResponse<any>>(`/worker/subtasks/${id}/report`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!data.success) {
      throw new Error(data.message || "Failed to upload photo");
    }
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 413) {
      throw new Error("Photo is too large. Please retake with a smaller image.");
    }

    if (!isAxiosError(error) || error.response?.status !== 404) {
      throw error;
    }

    try {
      const { data } = await api.post<ApiResponse<any>>(`/worker/tasks/${id}/report`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (!data.success) {
        throw new Error(data.message || "Failed to upload photo");
      }
      return data.data;
    } catch (fallbackError) {
      if (isAxiosError(fallbackError) && fallbackError.response?.status === 413) {
        throw new Error("Photo is too large. Please retake with a smaller image.");
      }

      throw fallbackError;
    }
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

export async function getWorkerTaskInventory(taskId: string) {
  try {
    const { data } = await api.get<ApiResponse<TaskInventoryItem[]>>(`/worker/subtasks/${taskId}/inventory`);
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch task inventory");
    }
    return data.data;
  } catch (error) {
    if (!isAxiosError(error) || error.response?.status !== 404) {
      throw error;
    }

    const { data } = await api.get<ApiResponse<TaskInventoryItem[]>>(`/worker/tasks/${taskId}/inventory`);
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch task inventory");
    }
    return data.data;
  }
}

export async function updateWorkerTaskInventory(taskId: string, inventoryId: string, data: { name: string; category: string; unit: string; currentQty: number; location: string | null }) {
  try {
    const response = await api.patch<ApiResponse<any>>(`/worker/subtasks/${taskId}/inventory/${inventoryId}`, data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update inventory");
    }
    return response.data.data;
  } catch (error) {
    if (!isAxiosError(error) || error.response?.status !== 404) {
      throw error;
    }

    const response = await api.patch<ApiResponse<any>>(`/worker/tasks/${taskId}/inventory/${inventoryId}`, data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update inventory");
    }
    return response.data.data;
  }
}

export async function completeWorkerTaskReport(
  taskId: string,
  afterPhotoUri: string | null,
  inventoryUsed: { inventoryId: string; qtyUsed: number }[],
  notes: string
) {
  const formData = new FormData();

  if (afterPhotoUri && !afterPhotoUri.startsWith('http')) {
    appendImageToFormData(formData, "afterPhoto", {
      uri: afterPhotoUri,
    }, {
      fileName: "after_photo.jpg",
      mimeType: "image/jpeg",
    });
  }

  inventoryUsed.forEach((item, index) => {
    formData.append(`inventoryUsed[${index}][inventoryId]`, item.inventoryId);
    formData.append(`inventoryUsed[${index}][qtyUsed]`, String(item.qtyUsed));
  });
  
  if (notes) {
    formData.append("notes", notes);
  }

  let data;
  try {
    const response = await api.post<ApiResponse<any>>(`/worker/subtasks/${taskId}/report`, formData, {
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
  const { data } = await api.get<ApiResponse<WorkerTaskDetail[]>>(`/worker/tasks?page=${page}&limit=${limit}`);
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
