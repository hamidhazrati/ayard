import { InjectionToken } from '@angular/core';

export const CASHFLOW_UTLITIES_CONFIG = new InjectionToken<string>('CASHFLOW_UTLITIES_CONFIG');

export interface ICashflowUtilitiesServiceConfig {
  invalidStates: { [key: string]: string };
  failureStates: { [key: string]: string };
  sellerIdentifier: string;
  accountDebtorIdentifier: string;
}

export const CashflowConfigService: ICashflowUtilitiesServiceConfig = {
  invalidStates: {
    REJECTED: 'Rejected',
    INVALID: 'Cashflow contains invalid data ',
    CASHFLOW_PROCESSING_ERROR: 'Unexpected error when processing the cashflow',
  },
  failureStates: {
    ERROR_IN_PROCESSSING: 'Unable to ingest',
    CONTRACT_NOT_FOUND: 'Contract not found',
    COUNTERPARTY_NOT_FOUND: 'Counterparty not found',
    CASHFLOW_CONFLICT: 'Cashflow already exists',
  },
  sellerIdentifier: 'Affiliate-Seller',
  accountDebtorIdentifier: 'Account Debtor',
};
