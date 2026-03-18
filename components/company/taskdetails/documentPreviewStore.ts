import type { TaskExpenseDocument } from "./TaskExpensesCard";

let currentPreviewDocument: TaskExpenseDocument | null = null;

export function setCurrentPreviewDocument(document: TaskExpenseDocument | null) {
  currentPreviewDocument = document;
}

export function getCurrentPreviewDocument() {
  return currentPreviewDocument;
}
