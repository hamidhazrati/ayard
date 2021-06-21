import { CreateUpdateEntity } from '@entities/models/entity.model';

export const postEntityBody: CreateUpdateEntity = {
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
};
