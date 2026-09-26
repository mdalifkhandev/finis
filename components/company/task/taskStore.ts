import { useSyncExternalStore } from "react";
import { TaskItem, TaskStatus } from "./types";

export type TaskDraft = {
  title: string;
  location: string;
  description: string;
  priority: string;
  dueDate: string;
  estimatedHours?: number;
};

let tasks: TaskItem[] = [];
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

export function setTasks(newTasks: TaskItem[]) {
  tasks = newTasks;
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
