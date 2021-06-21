import {
  ConcentrationLimit,
  CreateGuarantorLimit,
  CreateTotalLimit,
  GuarantorLimit,
  Limit,
  TotalLimit,
} from '@app/features/facilities/models/limit.model';
import { StatefulCashflowFilter } from '@app/features/facilities/models/stateful-cashflow-filter.model';
import { Classifier } from '@app/features/facilities/models/classifier.model';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';

interface BaseFacility {
  id: string;
  type: string;
  name: string;
  currency: string;
  children: Facility[];
  canHaveChildren: boolean;
}

export interface ConfigurableFacility extends BaseFacility {
  type: 'configurable-facility';
  limits: Limit[];
  statefulCashflowFilter: StatefulCashflowFilter;
  classifier: Classifier;
}

export interface ConcentrationFacility extends BaseFacility {
  type: 'concentration-facility';
  limit: ConcentrationLimit;
  filter: StatefulCashflowFilter;
  percentage: number;
  decimalFraction: number;
}

export interface ContractTotalFacility extends BaseFacility {
  type: 'contract-total-facility';
  contracts: { id: string; name: string }[];
  limits: TotalLimit[];
}

export interface ProductTotalFacility extends BaseFacility {
  type: 'product-total-facility';
  products: string[];
  limits: (TotalLimit | GuarantorLimit)[];
}

export interface LevelFacility extends BaseFacility {
  type: 'level-facility';
  limits: (TotalLimit | GuarantorLimit)[];
}

export type FacilityEntity = { id: string; name: string; dunsNumber?: string };

export interface RelationshipFacility extends BaseFacility {
  type: 'relationship-facility';
  limits: (TotalLimit | GuarantorLimit)[];
  entity?: FacilityEntity;
}

export interface PerCounterpartyTotalFacility extends BaseFacility {
  type: 'per-counterparty-facility';
  counterpartyRoleTypes: Pick<CounterpartyRole, 'name'>[];
  namedLimits: {
    [key: string]: TotalLimit;
  };
  defaultLimits: TotalLimit[];
  statefulCashflowFilter: StatefulCashflowFilter;
}

export function isContractTotalFacility(facility: any): facility is ContractTotalFacility {
  return facility.type === 'contract-total-facility';
}

export function isConfigurableFacility(facility: any): facility is ConfigurableFacility {
  return facility.type === 'configurable-facility';
}

export function isConcentrationFacility(facility: any): facility is ConcentrationFacility {
  return facility.type === 'concentration-facility';
}

export function isRelationshipFacility(facility: any): facility is RelationshipFacility {
  return facility.type === 'relationship-facility';
}

export function isProductTotalFacility(facility: any): facility is ProductTotalFacility {
  return facility.type === 'product-total-facility';
}

export function isPerCounterpartyTotalFacility(
  facility: any,
): facility is PerCounterpartyTotalFacility {
  return facility.type === 'per-counterparty-facility';
}

export type Facility =
  | ConfigurableFacility
  | ConcentrationFacility
  | ContractTotalFacility
  | ProductTotalFacility
  | RelationshipFacility
  | PerCounterpartyTotalFacility;

type CreateTotalLimits = {
  limits: (CreateTotalLimit | CreateGuarantorLimit)[];
};
export type CreateContractTotalFacility = Omit<
  ContractTotalFacility,
  'id' | 'canHaveChildren' | 'limits'
> &
  CreateTotalLimits;

export type CreateProductTotalFacility = Omit<
  ProductTotalFacility,
  'id' | 'canHaveChildren' | 'limits'
> &
  CreateTotalLimits;

export type CreateRelationshipFacility = Omit<
  RelationshipFacility,
  'id' | 'canHaveChildren' | 'limits'
> &
  CreateTotalLimits;

export type CreateUpdateFacility =
  | CreateRelationshipFacility
  | CreateContractTotalFacility
  | CreateProductTotalFacility;
