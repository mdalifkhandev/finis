export type DocumentItem = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string | { id: string; fullName: string; email: string; avatarUrl: string | null };
  uploadedDate: string;
  fileUrl?: string;
  fileSizeMb?: number;
  uploadedAt?: string;
};
