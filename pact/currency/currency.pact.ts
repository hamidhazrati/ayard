'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyService } from '@app/services/currency/currency.service';
import { ConfigService } from '@app/services/config/config.service';
import { getCurrenciesBody, getCurrenciesMatcher } from './responses/get-currencies';
import { ok } from '../helpers/response-helper';
import { get } from '../helpers/request-helper';

xpactWith({ consumer: 'operations-portal', provider: 'currency', cors: true }, (provider) => {
  describe('Currency API', () => {
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

    describe('Get currencies', () => {
      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of currencies',
          uponReceiving: 'a request for currencies',
          withRequest: get('/currencies'),
          willRespondWith: ok(getCurrenciesMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getCurrencies()
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCurrenciesBody);
          });
      });
    });
  });
});
