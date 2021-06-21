import { Matchers } from '@pact-foundation/pact';
import { ReferenceRate } from '@app/services/currency/currency.model';
const { like, eachLike } = Matchers;

export const getCurrencyReferenceRatesBody: ReferenceRate[] = [
  {
    rateType: 'LIBOR',
    description: 'rate description',
  },
];

export const getCurrencyReferenceRatesMatcher = eachLike({
  rateType: like('LIBOR'),
  description: like('rate description'),
});
