import {
  createCompany,
  createProject,
  getCompanies,
  getCompany,
  getCompanyContacts,
  getCompanyProjects,
  getProjectFloorPlan,
  getProjectProfile,
  updateCompany,
  updateProject,
  getProjectAnalysis,
  getTasks,
  updateTaskStatusApi,
  createProjectFloor,
  createProjectFloorRooms,
  updateProjectFloor,
  updateProjectRoom,
  deleteProjectFloor,
  deleteProjectRoom,
  getAvailableManagers,
  getProjectTeam,
  getProjectManagers,
  addProjectManager,
  removeProjectManager,
  getProjectFloors,
  getFloorRooms,
  createTask,
  getAvailableWorkers,
  addProjectWorker,
  getAssignedWorkers,
  removeProjectWorker,
  getTaskAvailableWorkers,
  assignTaskWorker,
  getProjectGeofences,
  getProjectGeofenceLocationLogs,
  getProjectGeofenceViolations,
  getProjectGeofenceTimeSummary,
  createProjectGeofence,
  updateProjectGeofence,
  deleteProjectGeofence,
} from "@/api/company/company.api";
import type { CreateTaskPayload } from "@/types/company.types";
import { useAuthStore } from "@/store/auth.store";
import type {
  CompanyContact,
  CompanyProject,
  CreateCompanyPayload,
  CreateProjectPayload,
  ProjectFloorPlanFloor,
  ProjectProfile,
  UpdateCompanyPayload,
  UpdateProjectPayload,
  ProjectAnalysisData,
} from "@/types/company.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner-native";

export function useCompaniesQuery(page: number, limit: number) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery({
    queryKey: ["company", "companies", page, limit, token],
    queryFn: () => getCompanies({ page, limit }),
    enabled: !!token && canAccessCompanyData,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load companies",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateCompanyPayload) => createCompany(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["company", "companies"],
      });
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error
          ? mutation.error.message
          : "Failed to create company",
      );
    }
  }, [mutation.error, mutation.isError]);

  return {
    createCompany: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useUpdateCompanyMutation(companyId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCompanyPayload;
    }) => updateCompany(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["company", "companies"],
      });
      if (companyId) {
        void queryClient.invalidateQueries({
          queryKey: ["company", "detail", companyId],
        });
      }
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error
          ? mutation.error.message
          : "Failed to update company",
      );
    }
  }, [mutation.error, mutation.isError]);

  return {
    updateCompany: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useCompanyQuery(id?: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery({
    queryKey: ["company", "detail", id, token],
    queryFn: () => getCompany(id as string),
    enabled: !!id && !!token && canAccessCompanyData,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load company",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useCreateProjectMutation(companyId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "active-projects"],
      });
      if (companyId) {
        void queryClient.invalidateQueries({
          queryKey: ["company", "projects", companyId],
        });
      }
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error
          ? mutation.error.message
          : "Failed to create project",
      );
    }
  }, [mutation.error, mutation.isError]);

  return {
    createProject: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useCompanyProjectsQuery(id?: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery<CompanyProject[]>({
    queryKey: ["company", "projects", id, token],
    queryFn: () => getCompanyProjects(id as string),
    enabled: !!id && !!token && canAccessCompanyData,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load projects",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useCompanyContactsQuery(id?: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery<CompanyContact[]>({
    queryKey: ["company", "contacts", id, token],
    queryFn: () => getCompanyContacts(id as string),
    enabled: !!id && !!token && canAccessCompanyData,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load contacts",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useProjectProfileQuery(id?: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery<ProjectProfile>({
    queryKey: ["project", "profile", id, token],
    queryFn: () => getProjectProfile(id as string),
    enabled: !!id && !!token && canAccessCompanyData,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load project profile",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useProjectFloorPlanQuery(id?: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery<ProjectFloorPlanFloor[]>({
    queryKey: ["project", "floor-plan", id, token],
    queryFn: () => getProjectFloorPlan(id as string),
    enabled: !!id && !!token && canAccessCompanyData,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load floor plan",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useUpdateProjectMutation(
  projectId?: string,
  companyId?: string,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProjectPayload;
    }) => updateProject(id, payload),
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "profile", projectId],
        });
      }
      if (companyId) {
        void queryClient.invalidateQueries({
          queryKey: ["company", "projects", companyId],
        });
      }
      void queryClient.invalidateQueries({
        queryKey: ["admin", "active-projects"],
      });
    },
  });

  useEffect(() => {
    if (mutation.isError) {
      toast.error(
        mutation.error instanceof Error
          ? mutation.error.message
          : "Failed to update project",
      );
    }
  }, [mutation.error, mutation.isError]);

  return {
    updateProject: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useProjectAnalysisQuery(id?: string) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery<ProjectAnalysisData>({
    queryKey: ["project", "analysis", id, token],
    queryFn: () => getProjectAnalysis(id as string),
    enabled: !!id && !!token && canAccessCompanyData,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load project analysis",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useTasksQuery(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  projectId?: string;
}) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const canAccessCompanyData = role === "admin" || role === "manager";

  const query = useQuery({
    queryKey: ["project", "tasks", params, token],
    queryFn: () => getTasks(params),
    enabled: !!token && canAccessCompanyData,
    staleTime: 10 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load tasks",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTaskStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", "tasks"] });
      toast.success("Task status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update task status",
      );
    },
  });
}

export function useCreateFloorMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name }: { name: string }) => {
      if (!projectId) throw new Error("Project ID is required");
      return createProjectFloor(projectId, name);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "floor-plan", projectId],
        });
      }
      toast.success("Floor added successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add floor",
      );
    },
  });
}

export function useCreateFloorRoomsMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      floorId,
      startRoomNumber,
      endRoomNumber,
    }: {
      floorId: string;
      startRoomNumber: string;
      endRoomNumber: string;
    }) => {
      if (!projectId) throw new Error("Project ID is required");
      return createProjectFloorRooms(projectId, floorId, startRoomNumber, endRoomNumber);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "floor-plan", projectId],
        });
      }
      toast.success("Rooms added successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add rooms",
      );
    },
  });
}

export function useUpdateFloorMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      floorId,
      payload,
    }: {
      floorId: string;
      payload: { name: string; status: string; progress: number };
    }) => {
      if (!projectId) throw new Error("Project ID is required");
      return updateProjectFloor(projectId, floorId, payload);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "floor-plan", projectId],
        });
      }
      toast.success("Floor updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update floor",
      );
    },
  });
}

export function useUpdateRoomMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      payload,
    }: {
      roomId: string;
      payload: {
        name: string;
        type: string;
        sizeSqft: number;
        status: string;
        progress: number;
      };
    }) => {
      if (!projectId) throw new Error("Project ID is required");
      return updateProjectRoom(projectId, roomId, payload);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "floor-plan", projectId],
        });
      }
      toast.success("Room updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update room",
      );
    },
  });
}

export function useDeleteFloorMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (floorId: string) => {
      if (!projectId) throw new Error("Project ID is required");
      return deleteProjectFloor(projectId, floorId);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "floor-plan", projectId],
        });
      }
      toast.success("Floor deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete floor",
      );
    },
  });
}

export function useDeleteRoomMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => {
      if (!projectId) throw new Error("Project ID is required");
      return deleteProjectRoom(projectId, roomId);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "floor-plan", projectId],
        });
      }
      toast.success("Room deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete room",
      );
    },
  });
}

export function useAvailableManagersQuery() {
  return useQuery({
    queryKey: ["team", "available-managers"],
    queryFn: () => getAvailableManagers(),
  });
}

export function useProjectTeamQuery(projectId?: string) {
  return useQuery({
    queryKey: ["project", "team", projectId],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectTeam(projectId);
    },
    enabled: !!projectId,
  });
}

export function useProjectManagersQuery(projectId?: string) {
  return useQuery({
    queryKey: ["project", "managers", projectId],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectManagers(projectId);
    },
    enabled: !!projectId,
  });
}


export function useAddProjectManagerMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!projectId) throw new Error("Project ID is required");
      return addProjectManager(projectId, userId);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "team", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["project", "managers", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["team", "available-managers"],
        });
      }
      toast.success("Manager added successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add manager",
      );
    },
  });
}

export function useProjectFloorsQuery(projectId?: string) {
  return useQuery({
    queryKey: ["project", "floors", projectId],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectFloors(projectId);
    },
    enabled: !!projectId,
  });
}

export function useFloorRoomsQuery(projectId?: string, floorId?: string) {
  return useQuery({
    queryKey: ["project", "floor", "rooms", projectId, floorId],
    queryFn: () => {
      if (!projectId || !floorId) throw new Error("Project ID and Floor ID are required");
      return getFloorRooms(projectId, floorId);
    },
    enabled: !!projectId && !!floorId,
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task",
      );
    },
  });
}

export function useRemoveProjectManagerMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!projectId) throw new Error("Project ID is required");
      return removeProjectManager(projectId, userId);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "team", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["project", "managers", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["team", "available-managers"],
        });
      }
      toast.success("Manager removed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove manager",
      );
    },
  });
}

export function useAvailableWorkersQuery() {
  return useQuery({
    queryKey: ["team", "available-workers"],
    queryFn: () => getAvailableWorkers(),
  });
}

export function useAddProjectWorkerMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { userId: string; managerId: string }) => {
      if (!projectId) throw new Error("Project ID is required");
      return addProjectWorker(projectId, payload);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "team", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["project", "managers", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["team", "available-workers"],
        });
        void queryClient.invalidateQueries({
          queryKey: ["project", "assigned-workers", projectId],
        });
      }
      toast.success("Worker added successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add worker",
      );
    },
  });
}

export function useAssignedWorkersQuery(projectId?: string, managerId?: string | null) {
  return useQuery({
    queryKey: ["project", "assigned-workers", projectId, managerId],
    queryFn: () => {
      if (!projectId || !managerId) throw new Error("Project ID and Manager ID are required");
      return getAssignedWorkers(projectId, managerId);
    },
    enabled: !!projectId && !!managerId,
  });
}

export function useRemoveProjectWorkerMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!projectId) throw new Error("Project ID is required");
      return removeProjectWorker(projectId, userId);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "team", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["project", "assigned-workers", projectId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["team", "available-workers"],
        });
      }
      toast.success("Worker removed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove worker",
      );
    },
  });
}

export function useTaskAvailableWorkersQuery(taskId?: string, search?: string) {
  return useQuery({
    queryKey: ["task", "available-workers", taskId, search],
    queryFn: () => {
      if (!taskId) throw new Error("Task ID is required");
      return getTaskAvailableWorkers(taskId, search);
    },
    enabled: !!taskId,
  });
}

export function useAssignTaskWorkerMutation(taskId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => {
      if (!taskId) throw new Error("Task ID is required");
      return assignTaskWorker(taskId, userIds);
    },
    onSuccess: () => {
      if (taskId) {
        void queryClient.invalidateQueries({
          queryKey: ["task", "available-workers", taskId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["project", "tasks"],
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign worker",
      );
    },
  });
}

import { getTaskDetails } from "../../api/company/company.api";

export function useTaskDetailsQuery(taskId?: string) {
  return useQuery({
    queryKey: ["task", "details", taskId],
    queryFn: () => {
      if (!taskId) throw new Error("Task ID is required");
      return getTaskDetails(taskId);
    },
    enabled: !!taskId,
  });
}


import { reviewTaskReport, updateTask } from "../../api/company/company.api";

export function useReviewTaskReportMutation(taskId: string, reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewDecision: string) => reviewTaskReport(taskId, reportId, reviewDecision),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", "details", taskId] });
      queryClient.invalidateQueries({ queryKey: ["project", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-analysis"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    },
  });
}


import { getProjectDocuments } from "../../api/company/company.api";

export function useProjectDocumentsQuery(projectId?: string) {
  const query = useQuery({
    queryKey: ["project", "documents", projectId],
    queryFn: () => getProjectDocuments(projectId!),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(
        query.error instanceof Error
          ? query.error.message
          : "Failed to load project documents",
      );
    }
  }, [query.error, query.isError]);

  return query;
}

export function useProjectGeofencesQuery(projectId?: string) {
  return useQuery({
    queryKey: ["project", "geofences", projectId],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectGeofences(projectId);
    },
    enabled: !!projectId,
  });
}

export function useCreateProjectGeofenceMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      zoneName: string;
      polygonCoords: Array<{ lat: number; lng: number }>;
      totalAreaSqft?: number;
      perimeterFt?: number;
    }) => {
      if (!projectId) throw new Error("Project ID is required");
      return createProjectGeofence(projectId, payload);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "geofences", projectId],
        });
      }
      toast.success("Zone saved successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to save zone",
      );
    },
  });
}

export function useUpdateTaskMutation(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      taskId: string;
      payload: Parameters<typeof updateTask>[1];
      file?: Parameters<typeof updateTask>[2];
    }) => updateTask(params.taskId, params.payload, params.file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["task", "details", taskId] });
      await queryClient.invalidateQueries({ queryKey: ["project", "tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["project-analysis"] });
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    },
  });
}

export function useUpdateProjectGeofenceMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      geofenceId,
      payload,
    }: {
      geofenceId: string;
      payload: {
        zoneName?: string;
        polygonCoords?: Array<{ lat: number; lng: number }>;
        totalAreaSqft?: number;
        perimeterFt?: number;
        isActive?: boolean;
      };
    }) => {
      if (!projectId) throw new Error("Project ID is required");
      return updateProjectGeofence(projectId, geofenceId, payload);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "geofences", projectId],
        });
      }
      toast.success("Zone updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update zone",
      );
    },
  });
}

export function useDeleteProjectGeofenceMutation(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (geofenceId: string) => {
      if (!projectId) throw new Error("Project ID is required");
      return deleteProjectGeofence(projectId, geofenceId);
    },
    onSuccess: () => {
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: ["project", "geofences", projectId],
        });
      }
      toast.success("Zone deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete zone",
      );
    },
  });
}

export function useProjectGeofenceLocationLogsQuery(projectId?: string) {
  return useQuery({
    queryKey: ["project", "geofences", projectId, "location-logs"],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectGeofenceLocationLogs(projectId);
    },
    enabled: !!projectId,
  });
}

export function useProjectGeofenceViolationsQuery(projectId?: string) {
  return useQuery({
    queryKey: ["project", "geofences", projectId, "violations"],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectGeofenceViolations(projectId);
    },
    enabled: !!projectId,
  });
}

export function useProjectGeofenceTimeSummaryQuery(projectId?: string) {
  return useQuery({
    queryKey: ["project", "geofences", projectId, "time-summary"],
    queryFn: () => {
      if (!projectId) throw new Error("Project ID is required");
      return getProjectGeofenceTimeSummary(projectId);
    },
    enabled: !!projectId,
  });
}

