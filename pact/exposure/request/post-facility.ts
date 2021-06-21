import { FacilityOperation } from '@app/features/facilities/models/facility-operate.model';

export const postFacilityOperation: FacilityOperation = {
  type: 'create-root-facility-operation',
  name: 'My root facility',
  currency: 'USD',
};
