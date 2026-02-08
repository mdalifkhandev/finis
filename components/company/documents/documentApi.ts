import { DocumentItem } from "./types";

const companyDocuments: DocumentItem[] = [
  {
    id: "company-doc-1",
    fileName: "Project Blueprint.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "John Smith",
    uploadedDate: "1/15/2025",
  },
  {
    id: "company-doc-2",
    fileName: "Safety Guidelines.docx",
    fileType: "DOCX",
    fileSize: "856 KB",
    uploadedBy: "Emily Chen",
    uploadedDate: "1/16/2025",
  },
  {
    id: "company-doc-3",
    fileName: "Budget Breakdown.xlsx",
    fileType: "XLSX",
    fileSize: "1.2 MB",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "1/17/2025",
  },
  {
    id: "company-doc-4",
    fileName: "Site Photos.zip",
    fileType: "ZIP",
    fileSize: "15.8 MB",
    uploadedBy: "Mike Davis",
    uploadedDate: "1/18/2025",
  },
];

const projectDocuments: Record<string, DocumentItem[]> = {
  "riverside-tower": [
    {
      id: "project-doc-1",
      fileName: "Floor Plan v2.pdf",
      fileType: "PDF",
      fileSize: "3.1 MB",
      uploadedBy: "Kristin Watson",
      uploadedDate: "1/20/2025",
    },
    {
      id: "project-doc-2",
      fileName: "Electrical Rough-in Spec.docx",
      fileType: "DOCX",
      fileSize: "1.1 MB",
      uploadedBy: "John Smith",
      uploadedDate: "1/21/2025",
    },
    {
      id: "project-doc-3",
      fileName: "Inspection Checklist.xlsx",
      fileType: "XLSX",
      fileSize: "780 KB",
      uploadedBy: "Emily Chen",
      uploadedDate: "1/22/2025",
    },
  ],
};

const simulateNetwork = async <T>(value: T, delayMs = 200): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });

export async function getCompanyDocuments(): Promise<DocumentItem[]> {
  return simulateNetwork(companyDocuments);
}

export async function getProjectDocuments(
  projectId: string
): Promise<DocumentItem[]> {
  return simulateNetwork(projectDocuments[projectId] ?? []);
}

