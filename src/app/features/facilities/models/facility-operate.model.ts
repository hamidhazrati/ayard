import { EntityLimit, GuarantorLimit, TotalLimit } from './limit.model';
import {
  CreateUpdateFacility,
  Facility,
  FacilityEntity,
} from '@app/features/facilities/models/facility.model';
import { FacilityUpdate } from '@app/features/facilities/models/facility-update.model';

interface BaseFacilityOperation {
  type: string;
}

export interface CreateFacilityOperation extends BaseFacilityOperation {
  type: 'create-root-facility-operation';
  name: string;
  currency: string;
  entity?: FacilityEntity;
  limits?: (TotalLimit | GuarantorLimit)[];
  children?: Facility[];
}

export interface AddCounterpartyLimitOperation extends BaseFacilityOperation {
  type: 'add-counterparty-limits-operation';
  facilityId: string;
  counterpartyRoleType: {
    name: string;
  };
  entityLimits: EntityLimit[];
}

export interface AddChildFacilityOperation extends BaseFacilityOperation {
  type: 'add-child-facility-operation';
  facilityId: string;
  facility: CreateUpdateFacility;
}

export interface UpdateFacilityOperation extends BaseFacilityOperation {
  type: 'update-facility-operation';
  facilityId: string;
  updates: FacilityUpdate[];
}

export type FacilityOperation =
  | CreateFacilityOperation
  | AddCounterpartyLimitOperation
  | AddChildFacilityOperation;
