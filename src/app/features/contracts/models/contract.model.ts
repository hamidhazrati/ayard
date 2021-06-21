import { OmitId, PickId } from '@app/shared/model/model-helpers';
import { Rule } from '@app/features/products/models/rule.model';
import { KeyValue } from '@angular/common';
import { LimitType } from '@app/features/facilities/models/limit.model';

export type CurrencyPricingParameterMap = {
  [key: string]: CurrencyPricingParameters;
};

export function makeCurrencyEntries(currencyMap: CurrencyPricingParameterMap): CurrencyEntry[] {
  return Object.keys(currencyMap).map((key) => {
    return makeCurrencyEntry({ key, value: currencyMap[key] });
  });
}

export function makeCurrencyEntry(
  keyValue: KeyValue<string, CurrencyPricingParameters>,
): CurrencyEntry {
  return { currencyCode: keyValue.key, ...keyValue.value };
}

export type CurrencyEntry = CurrencyPricingParameters & { currencyCode: string };

export type DateAdjustmentConfig = {
  calendars: string[];
  adjustmentType: string;
};

export type MaturityDateAdjustmentConfig = {
  calendars: string[];
  adjustmentType: string;
  bufferDays: number;
  setDay: number;
};

export type CurrencyPricingParameters = {
  referenceRateType: string;
  dayCountConvention: string;
  decimals: number;
  minCashflowAmount: number;
  maxCashflowAmount: number;
  minPaymentAmount: number;
  maxPaymentAmount: number;
  paymentDate: DateAdjustmentConfig;
  acceptanceDate: DateAdjustmentConfig;
  maturityDate: MaturityDateAdjustmentConfig;
};

export interface Contract extends ContractPricing {
  id: string;
  name: string;
  status: ContractStatus;
  channelReference: string;
  partnerId: string;
  product: string;
  productName: string;
  productCategoryId: string;
  productCategoryName: string;
  productId: string;
  created: string;
  rules: Rule[];
  currencies: CurrencyPricingParameterMap;
  bypassTradeAcceptance: boolean;
  entity?: {
    id: string;
    name: string;
  };
  facility?: {
    id: string;
    name: string;
  };
  roles?: { [role: string]: ContractRoleDefinition };
  hashExpressions?: string[];
}

export interface ContractRoleDefinition {
  limitRequirements: LimitRequirements;
}

export interface LimitRequirements {
  requirements: LimitRequirement[];
}

export interface LimitRequirement {
  limitType: LimitType;
  validSources: LimitSource[];
}

export type LimitSource = 'NAMED' | 'DEFAULT';

export interface ContractPricing {
  referenceRateOffset?: number;
  referenceRateAdjustmentType?: AdjustmentCalendarType;
  roundingMode?: RoundingMode;
  settlementDays?: number;
  minTenor?: number;
  maxTenor?: number;
  tradingCutoff?: string;
  calculationType?: CalculationType;
  pricingOperation?: PricingOperation;
  documentTypes?: DocumentTypes[];
  exclusions?: CashflowExclusions[];
  discountMode?: DiscountMode;
  advanceRate?: number;
  automatedPayment?: boolean;
  bauObligorName?: string;
  discountPosting?: string;
  leadDays?: number;
  rejectionMode?: RejectionMode;
  hashExpressions?: string[];
}

export interface PricingOperation {
  type: string;
  interpolated: boolean;
  spread: number;
}

export type ContractStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'APPROVED';

export type DocumentTypes = 'INVOICE' | 'CREDIT_NOTE';

export type RejectionMode = 'NONE' | 'AUTO';

export type CashflowExclusions = 'PAST_DUE' | 'FUTURE_DATED_RECEIVABLES';

export type RoundingMode =
  | 'HALF_UP'
  | 'UP'
  | 'DOWN'
  | 'CEILING'
  | 'FLOOR'
  | 'HALF_DOWN'
  | 'HALF_EVEN'
  | 'UNNECESSARY';

export type AdjustmentCalendarType = 'BUSINESS' | 'CALENDAR';

export type CalculationType = 'STANDARD' | 'DISCOUNT_TO_YIELD';

export type CreatedContract = PickId<Contract>;

export type CreateUpdateContract = Omit<OmitId<Contract>, 'created'>;

export type DiscountMode = 'AUTO' | 'MANUAL';
