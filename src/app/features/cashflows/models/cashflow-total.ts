import { CashflowFile } from '@app/features/cashflows/models/cashflow-file';

export interface CashflowTotal {
  cashflowFileId: string;
  currency: string;
  contractId: string;
  contractName: string;
  contractAdvanceRate: number;
  contractSpread: number;
  acceptanceDate: string;
  totalOriginalValue: number;
  totalInitialFundingAmount: number;
  totalDiscountAmount: number;
  totalPaymentAmount: number;
  totalCashflows: number;
  cashflowFile?: CashflowFile;
  referenceRateType: string;
  referenceRateDate: string;
  multipleMargins: boolean;
  multipleAdvanceRate: boolean;
}
