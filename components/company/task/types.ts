export type TaskStatus = "In Progress" | "Pending" | "Completed";

export type TaskItem = {
  id: string;
  title: string;
  location: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  description?: string;
  priority?: string;
};
