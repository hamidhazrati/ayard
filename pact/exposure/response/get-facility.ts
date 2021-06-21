import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';
import { iso8601Date, like } from '@pact-foundation/pact/dsl/matchers';
import { Facility } from '@app/features/facilities/models/facility.model';

export const getFacilityBody: Facility = {
  type: 'configurable-facility',
  limits: [],
  statefulCashflowFilter: { type: 'all-filter' },
  classifier: { type: 'homogenous-classifier' },
  id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
  name: 'name',
  currency: 'currency',
  children: [],
  canHaveChildren: true,
};

export const getExposureFacilityBody: FacilityProjection = {
  date: '2020-12-12',
  facility: getFacilityBody,
  exposure: { type: 'entity-exposure-set', results: [] },
  children: [],
};

export const getExposureFacilityBodyMatcher = {
  date: iso8601Date('2020-12-12'),
  facility: like(getFacilityBody),
  exposure: like({ type: 'entity-exposure-set', results: [] }),
  children: like([]),
};

export const getFacilityMatcher = {
  type: like('configurable-facility'),
  limits: like([]),
  statefulCashflowFilter: like({ type: 'all-filter' }),
  classifier: like({ type: 'homogenous-classifier' }),
  id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
  name: like('name'),
  currency: like('currency'),
  children: like([]),
};
