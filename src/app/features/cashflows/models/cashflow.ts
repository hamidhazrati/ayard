export interface Cashflow {
  id: string;
  cashflowFileId: string;
  state: string;
  currency: string;
  unitPrice: number;
  certifiedAmount: number;
  documentReference: string;
  issueDate: string;
  originalDueDate: string;
  originalValue: number;
  fundingAmount: number;
}
