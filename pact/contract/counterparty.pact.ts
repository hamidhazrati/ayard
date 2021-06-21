'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { noContent, ok } from '../helpers/response-helper';
import { post, put, putNoBody } from '../helpers/request-helper';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import { postCounterpartyCreated, postCounterpartyMatcher } from './responses/post-counterparty';
import { postCounterparty } from './requests/post-counterparty';

// Ignore as requires bff url rewrite
xpactWith({ consumer: 'operations-portal', provider: 'contract', cors: true }, (provider) => {
  describe('Counterparty API', () => {
    let service: CounterpartyService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [CounterpartyService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(CounterpartyService);
    });

    describe('PUT update credit status', () => {
      const putRequest = {
        uponReceiving: 'a request to update credit status of a counterparty',
        withRequest: put('/contract-counterparty/1/credit-status', {
          status: 'APPROVED',
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'counterparty exists with id 1',
          ...putRequest,
          willRespondWith: noContent(),
        });
      });

      it('returns a successful body', () => {
        return service
          .updateCreditStatus('1', 'APPROVED')
          .toPromise()
          .then((r) => {
            expect(r).toBeNull();
          });
      });
    });
    describe('POST counterparty', () => {
      const postRequest = {
        uponReceiving: 'a request to create a counterparty',
        withRequest: post('/contract-counterparty', {
          ...postCounterparty,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created a counterparty',
          ...postRequest,
          willRespondWith: ok(postCounterpartyMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .saveCounterparty(postCounterparty)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postCounterpartyCreated);
          });
      });
    });
    describe('PUT counterparty reference', () => {
      const putRequest = {
        uponReceiving: 'a request to PUT a counterparty reference',
        withRequest: put('/contract-counterparty/1/references', {
          references: ['reference'],
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'counterparty exists with id 1',
          ...putRequest,
          willRespondWith: noContent(),
        });
      });

      it('returns a 200', () => {
        return service
          .updateReferences('1', ['reference'])
          .toPromise()
          .then((r) => {
            expect(r).toBeNull();
          });
      });
    });
    describe('PUT counterparty validate', () => {
      const putRequest = {
        uponReceiving: 'a request to validate a counterparty',
        withRequest: putNoBody('/contract-counterparty/1/validate'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'counterparty exists with id 1',
          ...putRequest,
          willRespondWith: noContent(),
        });
      });

      it('returns a 200', () => {
        return service
          .refreshValidationState('1')
          .toPromise()
          .then((r) => {
            expect(r).toBeNull();
          });
      });
    });
  });
});
