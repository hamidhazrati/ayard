export interface UploadCashflowFileResponse {
  id: string;
  clientName: string;
  filename: string;
  uploadDate: string;
  uploadedBy: string;
  cashflowRowCount: number;
  status: string;
}
