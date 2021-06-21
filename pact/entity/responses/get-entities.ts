import { Matchers } from '@pact-foundation/pact';
import { Entity } from '@entities/models/entity.model';

const { like, eachLike } = Matchers;

export const getEntitiesBody: Entity[] = [
  {
    id: 'd30de6c5-03b0-4eff-8430-23100e42869d',
    name: 'myEntity',
    dunsNumber: '153561212',
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
  },
];

export const getEntityMatcher = {
  id: like('d30de6c5-03b0-4eff-8430-23100e42869d'),
  name: like('myEntity'),
  dunsNumber: like('153561212'),
  address: {
    line1: like('street line 1'),
    line2: like('street line 2'),
    city: like('some city'),
    region: like('SR'),
    regionName: like('region name'),
    country: like('UK'),
    countryName: like('United Kingdom'),
    postalCode: like('AB12 3CD'),
    postalCodeExtension: like('EXT'),
  },
};

export const getEntitiesMatcher = eachLike(getEntityMatcher);
