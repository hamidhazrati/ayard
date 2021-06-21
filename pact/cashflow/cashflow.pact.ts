'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { created, ok } from '../helpers/response-helper';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import {
  getCashflowBody,
  getCashflowMatcher,
  getCashflowsBody,
  getCashflowsBodymatcher,
} from './response/get-cashflow';
import { getCashflowFileBody, getCashflowFileMatcher } from './response/get-cashflow-file';
import { cashflowStatusUpdate, rejectCashflows } from './request/post-cashflow-file';
import { get, getWithHttpParams, pageRequest, post } from '../helpers/request-helper';

xpactWith({ consumer: 'operations-portal', provider: 'cashflow', cors: true }, (provider) => {
  describe('Cashflow API', () => {
    let service: CashflowDataService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [CashflowDataService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(CashflowDataService);
    });

    describe('GET Cashflows', () => {
      const getCashflowsRequest = {
        uponReceiving: 'a request for cashflows',
        withRequest: get('/cashflow'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of cashflows',
          ...getCashflowsRequest,
          willRespondWith: ok(getCashflowMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getCashflows()
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCashflowBody);
          });
      });
    });

    describe('GET Cashflow file by id', () => {
      const getCashflowsRequest = {
        uponReceiving: 'a request for cashflows',
        withRequest: get('/cashflowfiles/' + 'file'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have recieved a cashflow file',
          ...getCashflowsRequest,
          willRespondWith: ok(getCashflowFileMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getCashflowFile('file')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCashflowFileBody);
          });
      });
    });

    describe('GET Cashflow files', () => {
      const getCashflowsRequest = {
        uponReceiving: 'a request for cashflow files',
        // tslint:disable-next-line:prettier
        withRequest: getWithHttpParams('/cashflowfiles', pageRequest()),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have recieved a cashflow files',
          ...getCashflowsRequest,
          willRespondWith: ok(getCashflowFileMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getCashflowFiles(pageRequest())
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCashflowFileBody);
          });
      });
    });

    describe('POST cashflow file status', () => {
      const postRequest = {
        uponReceiving: 'a request to create a cashflow file status',
        withRequest: post('/cashflowfiles/id/processing-status', {
          ...cashflowStatusUpdate,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created a cashflowfile status',
          ...postRequest,
          willRespondWith: created(getCashflowFileMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .updateCashflowStatus('id', cashflowStatusUpdate)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCashflowFileBody);
          });
      });
    });

    describe('POST to submit trade', () => {
      const postRequest = {
        uponReceiving: 'a request to submit trade',
        withRequest: post('/cashflowfiles/id/submit-to-trade', {
          reportProgress: true,
          observe: 'events',
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created a request to submit trade',
          ...postRequest,
          willRespondWith: created(getCashflowFileMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .submitToTrade('id', {
            reportProgress: true,
            observe: 'events',
          })
          .toPromise()
          .then((r) => {
            expect(r).toMatchObject({ body: getCashflowFileBody });
          });
      });
    });

    describe('POST rejected cashflow', () => {
      const postRequest = {
        uponReceiving: 'a request to create a rejected cashflow',
        withRequest: post('/cashflow/reject-batch', rejectCashflows),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created a rejected casfhlows',
          ...postRequest,
          willRespondWith: created(getCashflowsBodymatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .rejectCashflows(rejectCashflows)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCashflowsBody);
          });
      });
    });
  });
});
