import { get } from '../helpers/request-helper';
import { ok } from '../helpers/response-helper';
import {
  getCurrencyReferenceRatesBody,
  getCurrencyReferenceRatesMatcher,
} from './responses/get-currency-reference-rates';
import { pactWith, xpactWith } from 'jest-pact';
import { CurrencyService } from '@app/services/currency/currency.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';

// Ignore until node provider support in pipeline
xpactWith(
  { consumer: 'operations-portal', provider: 'operations-portal-bff', cors: true },
  (provider) => {
    describe('Reference Rates API', () => {
      let service: CurrencyService;
      const configService = { getApiUrl: () => provider.mockService.baseUrl };

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientModule],
          providers: [CurrencyService, { provide: ConfigService, useValue: configService }],
        }).compileComponents();
      });

      beforeEach(() => {
        service = TestBed.inject(CurrencyService);
      });

      describe('Get reference rates for currency', () => {
        beforeEach(() => {
          return provider.addInteraction({
            state: 'i have a list of reference rates for GBP',
            uponReceiving: 'a request for reference rates by currency',
            withRequest: get('/currencies/GBP/reference-rates'),
            willRespondWith: ok(getCurrencyReferenceRatesMatcher),
          });
        });

        it('returns a successful body', () => {
          return service
            .getCurrencyReferenceRates('GBP')
            .toPromise()
            .then((r) => {
              expect(r).toEqual(getCurrencyReferenceRatesBody);
            });
        });
      });
    });
  },
);
