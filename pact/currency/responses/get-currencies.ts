import { Currency } from '../../../src/app/services/currency/currency.model';
import { Matchers } from '@pact-foundation/pact';
const { like, eachLike } = Matchers;

export const getCurrenciesBody: Currency[] = [
  {
    code: 'GBP',
    decimalPlaces: 2,
    dayCountConventionCode: 'Actual/365',
  },
];

export const getCurrenciesMatcher = eachLike({
  code: like('GBP'),
  decimalPlaces: like(2),
  dayCountConventionCode: like('Actual/365'),
});
