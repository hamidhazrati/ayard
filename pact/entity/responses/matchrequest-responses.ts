import { Matchers } from '@pact-foundation/pact';
import { EntityMatchResult } from '@entities/models/entity-match-result.model';

const { like, eachLike } = Matchers;

export const getEntityMatchResultBody: EntityMatchResult = {
  id: 'id',
  name: 'name',
  dunsNumber: 'dunsNumber',
  address: {
    line1: 'street line 1',
    line2: 'street line 2',
    city: 'some city',
    region: 'SR',
    regionName: 'region name',
    country: 'UK',
    countryName: 'United Kingdom',
    postalCode: 'AB12 3CD',
    postalCodeExtension: 'EXT',
  },
  status: 'ACTIVE',
  matchCandidates: [
    {
      id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
      entityId: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
      name: 'matched',
      dunsNumber: '742115303',
      entityIds: ['e1', 'e2'],
      primaryAddress: {
        line1: 'street line 1',
        line2: 'street line 2',
        city: 'some city',
        region: 'SR',
        regionName: 'region name',
        country: 'UK',
        countryName: 'United Kingdom',
        postalCode: 'AB12 3CD',
        postalCodeExtension: 'EXT',
      },
      matchScore: 95.0,
      status: 'ACTIVE',
    },
  ],
};

export const getEntityMatchResultBodyMatcher = {
  id: like('id'),
  name: like('name'),
  dunsNumber: like('dunsNumber'),
  address: like({
    line1: 'street line 1',
    line2: 'street line 2',
    city: 'some city',
    region: 'SR',
    regionName: 'region name',
    country: 'UK',
    countryName: 'United Kingdom',
    postalCode: 'AB12 3CD',
    postalCodeExtension: 'EXT',
  }),
  status: like('ACTIVE'),
  matchCandidates: eachLike({
    id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
    entityId: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
    name: like('matched'),
    dunsNumber: like('742115303'),
    entityIds: like(['e1', 'e2']),
    primaryAddress: like({
      line1: 'street line 1',
      line2: 'street line 2',
      city: 'some city',
      region: 'SR',
      regionName: 'region name',
      country: 'UK',
      countryName: 'United Kingdom',
      postalCode: 'AB12 3CD',
      postalCodeExtension: 'EXT',
    }),
    matchScore: like(95.0),
    status: like('ACTIVE'),
  }),
};
