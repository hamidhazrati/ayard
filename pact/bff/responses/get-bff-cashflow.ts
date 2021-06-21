import { eachLike, like } from '@pact-foundation/pact/dsl/matchers';
import { CashflowSummariesParams } from '@cashflows/services/cashflow-data.service';
import {
  CashflowFile,
  CashflowSummary,
  CashflowTotal,
} from '../../../src/app/features/cashflows/models';
import { CashflowFileFacility } from '@cashflows/models/cashflow-file';
import { rejectedDetail } from '../../cashflow/response/get-cashflow-file';

export const getCashflowSummariesParams: CashflowSummariesParams = {
  cashflowFileId: 'cashflowFileId',
  currency: 'currency',
  contractId: 'contractId',
  includeAllFailuresInFile: true,
  excludedStates: ['state'],
};

export const getCashflowSummary: CashflowSummary = {
  id: 'id',
  cashflowFileId: 'cashflowFileId',
  entityOne: { id: 'id', role: 'role', name: 'name' },
  entityTwo: { id: 'id', role: 'role', name: 'name' },
  contract: { id: 'id', name: 'name' },
  currency: 'currency',
  unitPrice: 1,
  certifiedAmount: 2,
  documentReference: 'documentReference',
  cashflowReference: 'cashflowReference',
  issueDate: 'issueDate',
  originalDueDate: 'originalDueDate',
  originalValue: 1,
  fundingAmount: 1,
  advanceRate: 1,
  annualisedMarginRate: 1,
  settlementAmount: 1,
  maturityDate: 'date',
  state: 'state',
  reasonForFailure: [{ code: 'code', message: 'message' }],
  bufferPeriod: 1,
  acceptanceDate: 'acceptanceDate',
  adjustment: 1,
  leadDays: 1,
  referenceRate: 1,
  hasFailures: false,
  insuranceType: 'INSURED',
};

export const getCashflowSummaryMatcher = {
  id: like('id'),
  cashflowFileId: like('cashflowFileId'),
  entityOne: like({ id: like('id'), role: like('role'), name: like('name') }),
  entityTwo: like({ id: like('id'), role: like('role'), name: like('name') }),
  contract: like({ id: like('id'), name: like('name') }),
  currency: like('currency'),
  unitPrice: like(1),
  certifiedAmount: like(2),
  documentReference: like('documentReference'),
  cashflowReference: like('cashflowReference'),
  issueDate: like('issueDate'),
  originalDueDate: like('originalDueDate'),
  originalValue: like(1),
  fundingAmount: like(1),
  advanceRate: like(1),
  annualisedMarginRate: like(1),
  settlementAmount: like(1),
  maturityDate: like('date'),
  state: like('state'),
  reasonForFailure: eachLike(like({ code: like('code'), message: like('message') })),
  bufferPeriod: like(1),
  acceptanceDate: like('acceptanceDate'),
  adjustment: like(1),
  leadDays: like(1),
  referenceRate: like(1),
  hasFailures: like(false),
};

export const getCashflowFileBody: CashflowFile = {
  id: 'id',
  clientName: 'clientName',
  filename: 'filename',
  uploadDate: 'uploadDate',
  uploadedBy: 'uploadedBy',
  status: 'status',
  cashflowRowCount: 1,
  cashflowTotals: [],
  processingFailureMessages: [],
  rejectionDetail: rejectedDetail,
  processedDate: 'processedDate',
  processedBy: 'processedBy',
  latestExport: 1,
  exports: [],
};
export const cashflowTotal: CashflowTotal = {
  cashflowFileId: 'cashflowFileId',
  currency: 'currency',
  contractId: 'contractId',
  contractName: 'contractName',
  contractAdvanceRate: 1,
  contractSpread: 2,
  acceptanceDate: 'acceptanceDate',
  totalOriginalValue: 3,
  totalInitialFundingAmount: 4,
  totalDiscountAmount: 5,
  totalPaymentAmount: 6,
  totalCashflows: 7,
  cashflowFile: getCashflowFileBody,
  referenceRateType: 'referenceRateType',
  referenceRateDate: '2021-01-01',
  multipleMargins: false,
  multipleAdvanceRate: false,
};

export const cashflowTotals: CashflowTotal[] = [cashflowTotal];

export const cashflowTotalsMatcher = eachLike(cashflowTotal);

export const cashflowFileFacility: CashflowFileFacility = {
  cashflowFileId: 'cashflowFileId',
  entityId: 'entityId',
  contractId: 'contractId',
  facilityId: 'facilityId',
  currency: 'currency',
  limit: 1,
  exposure: 1,
  insuranceLimit: 1,
  insuranceAvailable: 1,
  insuranceLimitType: 'insuranceLimitType',
};

export const cashflowFileFacilityMatcher = {
  cashflowFileId: like('cashflowFileId'),
  entityId: like('entityId'),
  contractId: like('contractId'),
  facilityId: like('facilityId'),
  currency: like('currency'),
  limit: like(1),
  exposure: like(1),
  insuranceLimit: like(1),
  insuranceAvailable: like(1),
  insuranceLimitType: like('insuranceLimitType'),
};
