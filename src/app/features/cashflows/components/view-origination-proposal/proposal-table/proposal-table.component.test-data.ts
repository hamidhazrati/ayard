import { CashflowSummary, ProposalCashflowsWithFacility } from '../../../models/cashflow-summary';

const CASHFLOW_SUMMARIES: CashflowSummary[] = [
  {
    id: 'abc-1',
    cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
    entityOne: {
      id: '456def',
      name: 'Entity One',
      role: 'Account Debtor',
    },
    entityTwo: {
      id: '123abc1',
      name: 'Entity Two',
      role: 'Affiliate-Seller',
    },
    contract: {
      id: 'the-contract-id1',
      name: 'the contract name',
    },
    issueDate: '2020-05-09',
    originalDueDate: '2020-05-10',
    currency: 'GBP',
    originalValue: 1000.0,
    state: 'PENDING_PROCESSING',
    unitPrice: 123.34,
    certifiedAmount: 123.34,
    documentReference: 'ABCD0001',
    fundingAmount: 900.0,
    advanceRate: 90,
    maturityDate: '2020-10-23',
    reasonForFailure: [],
    bufferPeriod: 2,
    acceptanceDate: '2020-08-13',
    cashflowReference: 'CR_123abc1',
    settlementAmount: 1000,
    annualisedMarginRate: 1.01,
    adjustment: 15,
    leadDays: 14,
    referenceRate: 10,
    hasFailures: false,
    insuranceType: 'INSURED',
  },
  {
    id: 'abc-2',
    cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
    entityOne: {
      id: '456def',
      name: 'Entity One',
      role: 'Account Debtor',
    },
    entityTwo: {
      id: '789ghi',
      name: 'Entity Three',
      role: 'Affiliate-Seller',
    },
    contract: {
      id: 'the-contract-id1',
      name: 'the contract name',
    },
    issueDate: '2020-05-09',
    originalDueDate: '2020-05-10',
    currency: 'GBP',
    originalValue: 9999.0,
    state: 'APPROVED',
    unitPrice: 123.34,
    certifiedAmount: 123.34,
    documentReference: 'ABCD0002',
    fundingAmount: 900.0,
    advanceRate: 90,
    maturityDate: '2020-10-23',
    reasonForFailure: [],
    bufferPeriod: 2,
    acceptanceDate: '2020-08-13',
    cashflowReference: 'CR_123abc2',
    settlementAmount: 1002,
    annualisedMarginRate: 1.21,
    adjustment: 15,
    leadDays: 14,
    referenceRate: 10,
    hasFailures: false,
    insuranceType: 'INSURED',
  },
];

const PROPOSAL_CASHFLOWS_WITH_FACILITIES: ProposalCashflowsWithFacility[] = [
  {
    accountDebtorEntityId: '456def',
    accountDebtorName: 'Entity One',
    currency: 'USD',
    contractId: 'the-contract-id1',
    cashflows: CASHFLOW_SUMMARIES,
    noOfCashflows: 2,
    fundingAmount: 2001, // sum of fundingAmount
    currentOutstanding: 5999, // Total if Purchased - fundingAmount
    latestMaturityDate: '2020-10-26',
    limit: 10000, // limit
    totalIfPurchased: 8000, // exposure
    utilisation: 80, // Total if Purchased / Limit [%age]
    availableLimit: 2000, // Limit - Total If Purchased
    insuranceLimit: 6000,
    insuranceAvailable: 7000,
    insuranceLimitType: 'DCL',
    insuranceType: 'INSURED',
  },
  {
    accountDebtorEntityId: '456ghi',
    accountDebtorName: 'Entity Two',
    currency: 'USD',
    contractId: 'the-contract-id1',
    cashflows: CASHFLOW_SUMMARIES,
    noOfCashflows: 2,
    fundingAmount: 2001, // sum of fundingAmount
    currentOutstanding: 5999, // Total if Purchased - fundingAmount
    latestMaturityDate: '2020-10-26',
    limit: 10000, // limit
    totalIfPurchased: 8000, // exposure
    utilisation: 80, // Total if Purchased / Limit [%age]
    availableLimit: -1000, // Limit - Total If Purchased
    insuranceLimit: 6000,
    insuranceAvailable: 7000,
    insuranceLimitType: 'DCL',
    insuranceType: 'INSURED',
  },
];

export { PROPOSAL_CASHFLOWS_WITH_FACILITIES };
