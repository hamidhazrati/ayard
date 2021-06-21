import {
  CashflowExclusions,
  Contract,
  ContractPricing,
  DocumentTypes,
  PricingOperation,
} from '../../../../models/contract.model';
import { Control } from '@ng-stack/forms';
import { PricingFields } from './types';

export function getInterpolatedValue(pricingOperation: string): boolean {
  switch (pricingOperation) {
    case 'INTERPOLATED_SPREAD_PLUS_REFERENCE_RATE':
    case 'PARTNER_CALCULATED_DISCOUNT':
      return true;
    default:
      return false;
  }
}

export function mapFromBackend(pricingOperation: PricingOperation): string {
  if (!pricingOperation || !pricingOperation.type) {
    return null;
  }
  if (pricingOperation.type === 'SPREAD_PLUS_REFERENCE_RATE') {
    return pricingOperation.interpolated
      ? 'INTERPOLATED_SPREAD_PLUS_REFERENCE_RATE'
      : 'BANDED_SPREAD_PLUS_REFERENCE_RATE';
  }
  return pricingOperation.type;
}

export function mapForBackend(pricingOperation: string): string {
  if (pricingOperation.indexOf('SPREAD_PLUS_REFERENCE_RATE') > 1) {
    return 'SPREAD_PLUS_REFERENCE_RATE';
  }
  return pricingOperation;
}

export function getPricingFields(contractPricing: Contract): PricingFields {
  return {
    referenceRateAdjustmentType: contractPricing?.referenceRateAdjustmentType ?? null,
    referenceRateOffset: contractPricing?.referenceRateOffset ?? null,
    roundingMode: contractPricing?.roundingMode ?? null,
    settlementDays: contractPricing?.settlementDays ?? null,
    tenorRange: {
      min: contractPricing?.minTenor ?? null,
      max: contractPricing?.maxTenor ?? null,
    },
    tradingCutoff: contractPricing?.tradingCutoff ?? null,
    calculationType: contractPricing?.calculationType ?? null,
    documentTypes: (contractPricing?.documentTypes ?? []) as Control<DocumentTypes[]>,
    spread: contractPricing?.pricingOperation?.spread ?? null,
    pricingOperation: mapFromBackend(contractPricing?.pricingOperation),
    exclusions: (contractPricing?.exclusions ?? []) as Control<CashflowExclusions[]>,
    discountMode: contractPricing?.discountMode ?? null,
    advanceRate: contractPricing?.advanceRate ?? null,
    automatedPayment: contractPricing?.automatedPayment ?? null,
    bauObligorName: contractPricing?.bauObligorName ?? null,
    discountPosting: contractPricing?.discountPosting ?? null,
    leadDays: contractPricing?.leadDays ?? null,
    rejectionMode: contractPricing?.rejectionMode ?? null,
    hashExpressions: (contractPricing?.hashExpressions ?? []) as Control<string[]>,
  };
}

export function setContractFields(pricingFields: PricingFields): ContractPricing | undefined {
  if (!pricingFields) {
    return undefined;
  }

  return {
    referenceRateAdjustmentType: pricingFields.referenceRateAdjustmentType,
    referenceRateOffset: pricingFields.referenceRateOffset,
    roundingMode: pricingFields.roundingMode,
    settlementDays: pricingFields.settlementDays,
    minTenor: pricingFields.tenorRange.min,
    maxTenor: pricingFields.tenorRange.max,
    tradingCutoff: pricingFields.tradingCutoff,
    calculationType: pricingFields.calculationType,
    documentTypes: pricingFields.documentTypes,
    pricingOperation: {
      type: mapForBackend(pricingFields.pricingOperation),
      interpolated: getInterpolatedValue(pricingFields.pricingOperation),
      spread: pricingFields.spread,
    },
    exclusions: pricingFields.exclusions,
    discountMode: pricingFields.discountMode,
    advanceRate: pricingFields.advanceRate,
    automatedPayment: pricingFields.automatedPayment,
    bauObligorName: pricingFields.bauObligorName,
    discountPosting: pricingFields.discountPosting,
    leadDays: pricingFields.leadDays,
    rejectionMode: pricingFields.rejectionMode,
    hashExpressions: pricingFields.hashExpressions,
  };
}

export const pad = (num: number, size: number): string => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

export const BuildHours = () => {
  return Array(24)
    .fill(0)
    .map((v: any, index: number) => `${pad(index, 2)}:00`);
};
