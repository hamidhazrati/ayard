export interface CashflowFile {
  id: string;
  clientName: string;
  filename: string;
  uploadDate: string;
  uploadedBy: string;
  status: string;
  cashflowRowCount: number;
  cashflowTotals?: CashflowFileTotal[];
  processingFailureMessages: CashflowFileFailures[];
  rejectionDetail?: RejectedDetail;
  processedDate?: string;
  processedBy?: string;
  latestExport?: number;
  exports?: Export[];
}

export interface CashflowFileTotal {
  cashflowFileId: string;
  currency: string;
  totalCashflows: number;
  totalValidCashflows: number;
  totalOriginalValue: number;
  totalInitialFundingAmount: number;
  totalInvalidCashflows: number;
  totalInvalidOriginalValue: number;
  totalInvalidInitialFundingAmount: number;
}

export interface CashflowFileFacility {
  cashflowFileId: string;
  entityId: string;
  contractId: string;
  facilityId: string;
  currency: string;
  limit: number;
  exposure: number;
  insuranceLimit: number;
  insuranceAvailable: number;
  insuranceLimitType: string;
}

export interface CashflowFileFailures {
  message: string;
  rowFailed: number;
}

export interface RejectedDetail {
  user: string;
  message: string;
  date: string;
}

export interface CashflowStatusUpdate {
  status: string;
  message?: string;
  user?: string;
}

export interface Export {
  sequence: number;
  filename: string;
}
