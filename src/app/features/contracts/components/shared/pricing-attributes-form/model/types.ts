import {
  AdjustmentCalendarType,
  CalculationType,
  CashflowExclusions,
  DiscountMode,
  DocumentTypes,
  RejectionMode,
  RoundingMode,
} from '@app/features/contracts/models/contract.model';
import { Control } from '@ng-stack/forms';
import { RangeValue } from '@app/shared/validators/range.validator';

export interface EnumLookup<T> {
  value: T;
  displayText: string;
}

export type PricingForm = {
  pricingFields: PricingFields;
};

export interface PricingFields {
  roundingMode: RoundingMode;
  calculationType: CalculationType;
  referenceRateAdjustmentType: AdjustmentCalendarType;
  referenceRateOffset: number;
  documentTypes: Control<DocumentTypes[]>;
  exclusions: Control<CashflowExclusions[]>;
  tradingCutoff: string;
  pricingOperation: string;
  spread: number;
  settlementDays: number;
  tenorRange: RangeValue;
  discountMode: DiscountMode;
  advanceRate: number;
  automatedPayment: boolean;
  bauObligorName: string;
  discountPosting: string;
  leadDays: number;
  rejectionMode: RejectionMode;
  hashExpressions: Control<string[]>;
}
