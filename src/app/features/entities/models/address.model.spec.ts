import { formatAddress } from './address.model';

describe('formatAddress', () => {
  describe('GIVEN a full address', () => {
    test('THEN display the address parts', () => {
      const actual = formatAddress({
        line1: 'a',
        line2: 'b',
        city: 'c',
        postalCode: 'd',
        regionName: 'e',
        countryName: 'f',

        region: '',
        country: '',
        postalCodeExtension: '',
      });

      expect(actual).toEqual('a, b, c, d, e, f');
    });
  });

  describe('GIVEN a partial address', () => {
    test('THEN display the address parts', () => {
      const actual = formatAddress({
        line1: 'a',
        line2: undefined,
        city: '',
        postalCode: null,
        regionName: '',
        countryName: 'f',

        region: '',
        country: '',
        postalCodeExtension: '',
      });

      expect(actual).toEqual('a, f');
    });
  });
});
