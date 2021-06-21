import { CashflowFailure } from './cashflow-failure';
import { CashflowContract } from './cashflow-contract';

export interface CashflowSummary {
  id: string;
  cashflowFileId: string;
  entityOne: Entity;
  entityOneTransformed?: string;
  entityTwo: Entity;
  entityTwoTransformed?: string;
  contract: CashflowContract;
  currency: string;
  unitPrice: number;
  certifiedAmount: number;
  documentReference: string;
  cashflowReference: string;
  issueDate: string;
  originalDueDate: string;
  originalValue: number;
  fundingAmount: number;
  advanceRate: number;
  annualisedMarginRate: number;
  settlementAmount: number;
  maturityDate: string;
  state: string;
  reasonForFailure: CashflowFailure[];
  bufferPeriod: number;
  acceptanceDate: string;
  adjustment: number;
  leadDays: number;
  referenceRate: number;
  hasFailures: boolean;
  insuranceType: string;
  invalidReason?: string;
}

export interface Entity {
  id: string;
  name: string;
  role: string;
}

export interface ProposalCashflowsWithFacility {
  accountDebtorEntityId: string;
  accountDebtorName: string;
  contractId: string;
  currency: string;
  cashflows: CashflowSummary[];
  noOfCashflows: number;
  fundingAmount: number;
  currentOutstanding: number;
  latestMaturityDate: string;
  limit: number;
  totalIfPurchased: number;
  utilisation: number;
  availableLimit: number;
  insuranceLimit: number;
  insuranceAvailable: number;
  insuranceLimitType: string;
  insuranceType: string;
}
