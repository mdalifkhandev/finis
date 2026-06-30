import { TaskStatus } from "../task/types";

type TaskDetailsPreset = {
  screenTitle: string;
  description: string;
  project: string;
  assignedTo: string;
  dueDate: string;
  estimatedTime: string;
  reportSummary: string;
  inventory: { label: string; quantity: string }[];
};

const PRESETS: Record<TaskStatus, TaskDetailsPreset> = {
  Pending: {
    screenTitle: "Site Cleanup - Zone A",
    description:
      "Clear debris from Zone A, separate recyclable waste, and prepare site access for the next work phase.",
    project: "Downtown Plaza",
    assignedTo: "Michael Torres",
    dueDate: "Jan 15, 2026",
    estimatedTime: "4 hours",
    reportSummary:
      "Initial cleanup checklist prepared. Waiting for final material handover before full execution starts.",
    inventory: [
      { label: "Heavy Duty Trash Bags", quantity: "10 pcs" },
      { label: "Safety Gloves", quantity: "8 pairs" },
      { label: "Floor Marking Tape", quantity: "3 rolls" },
    ],
  },
  "In Progress": {
    screenTitle: "Electrical Rough-in - Floor 2",
    description:
      "Install electrical wiring and conduit for Floor 2. Validate all line routes before panel connection.",
    project: "Riverside Tower",
    assignedTo: "Mike Johnson",
    dueDate: "Jan 18, 2026",
    estimatedTime: "6 hours",
    reportSummary:
      "Wiring for east corridor completed. Remaining rooms are under active routing and testing.",
    inventory: [
      { label: "Copper Wire (2.5mm)", quantity: "120 m" },
      { label: "PVC Conduit", quantity: "18 pcs" },
      { label: "Junction Box", quantity: "12 pcs" },
    ],
  },
  Completed: {
    screenTitle: "HVAC Duct Final Check",
    description:
      "Perform final inspection of HVAC ducts, airflow balance, and safety compliance for handover.",
    project: "Northline Business Park",
    assignedTo: "Robert Brown",
    dueDate: "Jan 12, 2026",
    estimatedTime: "3.5 hours",
    reportSummary:
      "All ducts inspected and verified. Airflow readings are within acceptable tolerance for client handover.",
    inventory: [
      { label: "Airflow Meter", quantity: "1 unit" },
      { label: "Sealant", quantity: "2 tubes" },
      { label: "Filter Cartridge", quantity: "4 pcs" },
    ],
  },
  Review: {
    screenTitle: "Task Review in Progress",
    description:
      "All assigned work has been submitted and the task is now waiting for final review and approval.",
    project: "Project Review",
    assignedTo: "Assigned Team",
    dueDate: "Awaiting approval",
    estimatedTime: "Final review",
    reportSummary:
      "Subtasks are complete and pending final approval before the task moves to completed state.",
    inventory: [
      { label: "Submitted Reports", quantity: "Ready" },
      { label: "Expense Review", quantity: "Pending" },
      { label: "Final Approval", quantity: "Required" },
    ],
  },
};

export function getTaskDetailsPreset(
  status: TaskStatus | undefined,
): TaskDetailsPreset {
  if (!status) {
    return PRESETS.Pending;
  }

  return PRESETS[status] ?? PRESETS.Pending;
}
