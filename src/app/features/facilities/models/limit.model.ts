import { StatefulCashflowFilter } from '@app/features/facilities/models/stateful-cashflow-filter.model';
import { FacilityEntity } from '@app/features/facilities/models/facility.model';

export type LimitType = 'NONE' | 'CREDIT' | 'INSURANCE' | 'GUARANTOR';

interface BaseLimit {
  type: string;
  id: string;
  exceptionCode?: string;
}

export interface TotalLimit extends BaseLimit {
  type: 'total-limit';
  limitType: LimitType;
  limit?: number;
  defaultLimit: boolean;
}

export interface ConcentrationLimit extends BaseLimit {
  type: 'concentration-limit';
  percentage: number;
  decimalFraction: number;
  filter: StatefulCashflowFilter;
}

export interface GuarantorLimit extends BaseLimit {
  type: 'guarantor-limit';
  limitType: LimitType;
  limit?: number;
  defaultLimit: boolean;
  entity: FacilityEntity;
}

export interface EntityLimit {
  entity: FacilityEntity;
  limits: TotalLimit[];
}

export type Limit = TotalLimit | ConcentrationLimit | GuarantorLimit;

export function isTotalLimit(limit: Limit): limit is TotalLimit {
  return limit.type === 'total-limit';
}

export function isConcentrationLimit(limit: Limit): limit is ConcentrationLimit {
  return limit.type === 'concentration-limit';
}

export function isGuarantorLimit(limit: Limit): limit is GuarantorLimit {
  return limit.type === 'guarantor-limit';
}

export type CreateTotalLimit = Omit<TotalLimit, 'id' | 'exceptionCode' | 'defaultLimit'>;
export type CreateGuarantorLimit = Omit<GuarantorLimit, 'id' | 'exceptionCode' | 'defaultLimit'>;

export type CreateLimit = CreateTotalLimit | CreateGuarantorLimit;
