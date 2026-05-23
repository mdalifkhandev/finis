import type { AdminCompany } from "./admin.types";
import type { ApiResponse } from "./auth.types";

export type CompanyLogoFile = {
  uri: string;
  name: string;
  type: string;
};

export type CreateCompanyPayload = {
  name: string;
  industry: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  revenue: string;
  projectLevel: string;
  logo?: CompanyLogoFile | null;
};

export type UpdateCompanyPayload = CreateCompanyPayload;

export type CreateCompanyResponse = ApiResponse<AdminCompany>;

export type CreateProjectPayload = {
  name: string;
  companyId: string;
  type: string;
  startDate: string;
  endDate: string;
  budget: number;
  location: string;
  description: string;
  numFloors?: number;
  roomsPerFloor?: number;
  isWholeHouse?: boolean;
  houseSections?: string[];
  autoGenerateFloors: boolean;
};

export type CompanyProjectTeamMemberUser = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
};

export type CompanyProjectTeamMember = {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  managerId: string | null;
  createdAt: string;
  user: CompanyProjectTeamMemberUser;
};

export type CompanyProject = {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  location: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  _count: {
    teamMembers: number;
    tasks: number;
  };
  teamMembers: CompanyProjectTeamMember[];
};

export type CompanyProjectsResponse = ApiResponse<CompanyProject[]>;

export type AvailableManager = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  department: string | null;
};

export type AvailableManagersResponse = ApiResponse<AvailableManager[]> & {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ProjectProfileClient = {
  companyId: string;
  companyName: string;
  logoUrl: string | null;
  phone: string;
  email: string;
  website: string;
  address: string;
  primaryContact: string | null;
};

export type ProjectProfile = {
  id: string;
  name: string;
  type: string;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  progress: number;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isWholeHouse?: boolean;
  houseSections?: string[];
  numFloors: number;
  roomsPerFloor: number;
  budget: number;
  spent: number;
  remaining: number;
  client: ProjectProfileClient;
  counts: {
    tasks: number;
    teamMembers: number;
    floors: number;
  };
};

export type ProjectProfileResponse = ApiResponse<ProjectProfile>;

export type ProjectFloorPlanTaskCounts = {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
};

export type ProjectFloorPlanRoom = {
  id: string;
  name: string;
  type: string | null;
  sizeSqft: number | null;
  status: string;
  progress: number;
  taskCounts: ProjectFloorPlanTaskCounts;
};

export type ProjectFloorPlanFloor = {
  id: string;
  name: string;
  floorNumber: number;
  status: string;
  progress: number;
  totalRooms: number;
  taskCounts: ProjectFloorPlanTaskCounts;
  rooms: ProjectFloorPlanRoom[];
};

export type ProjectFloorPlanResponse = ApiResponse<ProjectFloorPlanFloor[]>;

export type UpdateProjectPayload = {
  name: string;
  status: string;
  spent: string;
  progress: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  location?: string;
  description?: string;
  numFloors?: number;
  roomsPerFloor?: number;
  isWholeHouse?: boolean;
  houseSections?: string[];
  autoGenerateFloors?: boolean;
};

export type CompanyContactProject = {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
};

export type CompanyContact = {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  systemRole: string;
  projects: CompanyContactProject[];
};

export type CompanyContactsResponse = ApiResponse<CompanyContact[]>;

export type ProjectAnalysisTask = {
  taskId: string;
  taskName: string;
  taskStatus: string;
};

export type ProjectAnalysisFloor = {
  floorId: string;
  floorName: string;
  floorStatus: string;
  tasks: ProjectAnalysisTask[];
};

export type ProjectAnalysisData = {
  checklist: ProjectAnalysisFloor[];
};

export type ProjectAnalysisResponse = ApiResponse<ProjectAnalysisData>;

export type TaskAssignee = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
};

export type TaskProject = {
  id: string;
  name: string;
};

export type TaskFloor = {
  id: string;
  name: string;
};

export type TaskRoom = {
  id: string;
  name: string;
};

export type TaskListItem = {
  id: string;
  projectId: string;
  floorId: string;
  roomId: string;
  assignedTo: string;
  createdBy: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
  updatedAt: string;
  project: TaskProject;
  floor: TaskFloor;
  room: TaskRoom;
  assignee: TaskAssignee;
  _count: {
    reports: number;
  };
};

export type TasksListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TasksListResponse = ApiResponse<TaskListItem[]> & {
  meta: TasksListMeta;
};


export enum RoomStatus {
  pending = "pending",
  in_progress = "in_progress",
  completed = "completed",
}

export type ProjectFloor = {
  id: string;
  floorNumber: number;
  name: string;
  status: string;
  progress: number;
};

export type ProjectFloorsResponse = ApiResponse<ProjectFloor[]>;

export type ProjectRoom = {
  id: string;
  roomNumber: number;
  name: string;
  status: string;
  progress: number;
  type: string | null;
};

export type ProjectRoomsResponse = ApiResponse<ProjectRoom[]>;

export type Floor = ProjectFloor;
export type Room = ProjectRoom;

export type CreateTaskPayload = {
  projectId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  floorId: string;
  roomId: string;
  estimatedHours?: number;
};

export type CreateTaskResponse = ApiResponse<{ id: string }>;

export type TaskDetailsReport = {
  id: string;
  notes: string;
  beforePhotoUrl: string | null;
  afterPhotoUrl: string | null;
  receiptUrl: string | null;
  reviewDecision: string;
  worker: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  }
};

export type TaskDetailsInventory = {
  id: string;
  qtyUsed: number;
  inventory: {
    id: string;
    name: string;
    unit: string;
  }
};

export type TaskDetailsExpense = {
  id: string;
  description: string;
  category: string;
  amount: number;
  status: string;
  date: string;
};

export type TaskDetailsData = {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  project: { name: string };
  floor: { name: string };
  room: { name: string };
  assignee: { fullName: string } | null;
  taskAssignees: any[];
  reports: TaskDetailsReport[];
  taskInventories: TaskDetailsInventory[];
  expenses: TaskDetailsExpense[];
};

export type TaskDetailsApiResponse = ApiResponse<TaskDetailsData>;

