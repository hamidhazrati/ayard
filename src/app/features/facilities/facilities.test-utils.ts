import { DeepPartial } from 'utility-types';
import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';

export const buildTestFacilityProjection = (
  facilityProjection: DeepPartial<FacilityProjection>,
): FacilityProjection => {
  return {
    ...facilityProjection,
  } as FacilityProjection;
};
