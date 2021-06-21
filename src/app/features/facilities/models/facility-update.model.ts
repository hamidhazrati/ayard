export interface BaseFacilityUpdate {
  type: string;
}

export interface SetNameFacilityUpdate extends BaseFacilityUpdate {
  type: 'set-name-facility-update';
  name: string;
}

export const createSetNameFacilityUpdate = (name): SetNameFacilityUpdate => ({
  type: 'set-name-facility-update',
  name,
});

export interface SetCreditLimitFacilityUpdate extends BaseFacilityUpdate {
  type: 'set-credit-limit-facility-update';
  limit?: number;
}

export const createSetCreditLimitFacilityUpdate = (
  limit?: number,
): SetCreditLimitFacilityUpdate => ({
  type: 'set-credit-limit-facility-update',
  limit,
});

export type FacilityUpdate = SetNameFacilityUpdate | SetCreditLimitFacilityUpdate;
