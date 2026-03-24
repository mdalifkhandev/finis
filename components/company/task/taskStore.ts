import { useSyncExternalStore } from "react";
import { TaskItem, TaskStatus } from "./types";

export type TaskDraft = {
  title: string;
  location: string;
  description: string;
  priority: string;
  dueDate: string;
};

const initialTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Electrical Rough-in - Floor 2",
    location: "Riverside Tower",
    assignee: "Mike Johnson",
    startDate: "Jan 15",
    dueDate: "Jan 18",
    status: "In Progress",
  },
  {
    id: "task-2",
    title: "Site Cleanup - Zone A",
    location: "Downtown Plaza",
    assignee: "Michael Torres",
    startDate: "Jan 14",
    dueDate: "Jan 15",
    status: "Pending",
  },
  {
    id: "task-3",
    title: "HVAC Duct Final Check",
    location: "Northline Business Park",
    assignee: "Robert Brown",
    startDate: "Jan 10",
    dueDate: "Jan 12",
    status: "Completed",
  },
];

let tasks = initialTasks;
let taskDraft: TaskDraft | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => tasks;

export function useTaskItems() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function addTask(input: {
  title: string;
  location: string;
  assignee: string;
  dueDate: string;
  status?: TaskStatus;
  description?: string;
  priority?: string;
}) {
  const newTask: TaskItem = {
    id: `task-${Date.now()}`,
    title: input.title,
    location: input.location,
    assignee: input.assignee,
    startDate: "Today",
    dueDate: input.dueDate || "Today",
    status: input.status ?? "Pending",
    description: input.description,
    priority: input.priority,
  };

  tasks = [newTask, ...tasks];
  notify();
}

export function updateTaskStatus(taskId: string, status: TaskStatus) {
  tasks = tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          status,
        }
      : task,
  );
  notify();
}

export function setTaskDraft(draft: TaskDraft) {
  taskDraft = draft;
}

export function getTaskDraft() {
  return taskDraft;
}

export function clearTaskDraft() {
  taskDraft = null;
}
