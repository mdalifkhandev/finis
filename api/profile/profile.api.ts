import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types/auth.types";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  status: string;
  dateOfBirth: string | null;
  address: string | null;
  bio: string | null;
  department: string | null;
  employeeId: string | null;
  joinDate: string | null;
  lastLoginAt: string | null;
  createdAt: string;
};

type GetProfileResponse = ApiResponse<UserProfile>;

export async function getAdminProfile() {
  const { data } = await api.get<GetProfileResponse>("/admin/profile");
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch profile");
  }
  
  return data.data;
}


export async function updateAdminProfile(formData: FormData) {
  const { data } = await api.put<ApiResponse<UserProfile>>("/admin/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  if (!data.success) {
    throw new Error(data.message || "Failed to update profile");
  }
  
  return data.data;
}


export type WorkerProfile = {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  employeeId: string | null;
  department: string | null;
  dateOfBirth: string | null;
  address: string | null;
  bio: string | null;
  hourlyRate: string | null;
  joinDate: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  emergencyContacts: any[];
  certifications: any[];
  userSettings: any | null;
  companyMembers: any[];
};

export async function getWorkerProfile() {
  const { data } = await api.get<ApiResponse<WorkerProfile>>("/worker/profile");
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch worker profile");
  }
  
  return data.data;
}

export async function updateWorkerProfile(formData: FormData) {
  const { data } = await api.put<ApiResponse<WorkerProfile>>("/worker/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  if (!data.success) {
    throw new Error(data.message || "Failed to update profile");
  }
  
  return data.data;
}

