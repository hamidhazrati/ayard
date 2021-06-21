import {
  AdjustmentCalendarType,
  CalculationType,
  CashflowExclusions,
  DiscountMode,
  DocumentTypes,
  RejectionMode,
  RoundingMode,
} from '../../../../models/contract.model';
import { EnumLookup } from '@app/features/contracts/components/shared/pricing-attributes-form/model/types';

export const discountModes: EnumLookup<DiscountMode>[] = [
  {
    value: 'MANUAL',
    displayText: 'Manual',
  },
  {
    value: 'AUTO',
    displayText: 'Auto',
  },
];

export const roundingModes: EnumLookup<RoundingMode>[] = [
  {
    value: 'HALF_UP',
    displayText: 'Half Up',
  },
  {
    value: 'UP',
    displayText: 'Up',
  },
  {
    value: 'DOWN',
    displayText: 'Down',
  },
  {
    value: 'CEILING',
    displayText: 'Ceiling',
  },
  {
    value: 'FLOOR',
    displayText: 'Floor',
  },
  {
    value: 'HALF_DOWN',
    displayText: 'Half Down',
  },
  {
    value: 'HALF_EVEN',
    displayText: 'Half Even',
  },
];

export const pricingOperations: EnumLookup<string>[] = [
  {
    value: 'INTERPOLATED_SPREAD_PLUS_REFERENCE_RATE',
    displayText: 'Interpolated Benchmark rate + Spread',
  },
  {
    value: 'BANDED_SPREAD_PLUS_REFERENCE_RATE',
    displayText: 'Banded Benchmark rate + Spread',
  },
  {
    value: 'FLAT_RATE',
    displayText: 'Flat rate',
  },
  {
    value: 'ALL_IN_RATE',
    displayText: 'All in rate',
  },
  {
    value: 'PARTNER_CALCULATED_DISCOUNT',
    displayText: 'Partner calculated discount amount',
  },
];

export const exclusions: EnumLookup<CashflowExclusions>[] = [
  {
    value: 'PAST_DUE',
    displayText: 'Past Due',
  },
  {
    value: 'FUTURE_DATED_RECEIVABLES',
    displayText: 'Future Dated Receivables',
  },
];

export const calculationTypes: EnumLookup<CalculationType>[] = [
  {
    value: 'STANDARD',
    displayText: 'Standard',
  },
];

export const documentTypes: EnumLookup<DocumentTypes>[] = [
  {
    value: 'INVOICE',
    displayText: 'Invoice',
  },
  {
    value: 'CREDIT_NOTE',
    displayText: 'Credit Note',
  },
];

export const rejectionModes: EnumLookup<RejectionMode>[] = [
  {
    value: 'NONE',
    displayText: 'NONE',
  },
  {
    value: 'AUTO',
    displayText: 'AUTO',
  },
];

export const adjustmentCalendarTypes: EnumLookup<AdjustmentCalendarType>[] = [
  {
    value: 'BUSINESS',
    displayText: 'Business',
  },
];

export const referenceRateOffsetValues: EnumLookup<number>[] = [
  {
    value: -1,
    displayText: 'T-1',
  },
  {
    value: -2,
    displayText: 'T-2',
  },
  {
    value: -3,
    displayText: 'T-3',
  },
  {
    value: -4,
    displayText: 'T-4',
  },
  {
    value: -5,
    displayText: 'T-5',
  },
  {
    value: -6,
    displayText: 'T-6',
  },
  {
    value: -7,
    displayText: 'T-7',
  },
];
