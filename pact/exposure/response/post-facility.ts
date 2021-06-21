import { FacilitySearchResult } from '@app/features/facilities/models/facility-search-result.model';
import { Facility } from '@app/features/facilities/models/facility.model';
import { Matchers } from '@pact-foundation/pact';

const { like, eachLike } = Matchers;

export const postFacilityCreated = {
  id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
};

export const postFacilitySearchResult: FacilitySearchResult[] = [
  {
    facility: {
      id: 'c1',
      name: 'facility',
    } as Facility,
    facilityTree: {
      id: 'r1',
      name: 'relationship',
    } as Facility,
  },
];

export const postFacilitySearchMatcher = {
  facility: {
    id: like('c1'),
    name: like('facility'),
  },
  facilityTree: {
    id: like('r1'),
    name: like('relationship'),
  },
};

export const postFacilitySearchResultMatcher = eachLike(postFacilitySearchMatcher);

export const postFacilityBodyMatcher = {
  type: like('configurable-facility'),
  limits: [],
  statefulCashflowFilter: { type: 'all-filter' },
  classifier: { type: 'homogenous-classifier' },
  id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
  name: like('name'),
  currency: like('currency'),
  children: [],
};
