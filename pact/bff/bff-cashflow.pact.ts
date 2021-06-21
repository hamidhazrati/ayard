import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { pactWith, xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { get, getWithParams } from '../helpers/request-helper';
import { ok } from '../helpers/response-helper';
import {
  cashflowFileFacility,
  cashflowFileFacilityMatcher,
  cashflowTotals,
  cashflowTotalsMatcher,
  getCashflowSummariesParams,
  getCashflowSummary,
  getCashflowSummaryMatcher,
} from './responses/get-bff-cashflow';

// Ignore until node provider support in pipeline
xpactWith(
  { consumer: 'operations-portal', provider: 'operations-portal-bff', cors: true },
  (provider) => {
    describe('Cashflow Data Service  API', () => {
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

      describe('GET Cashflow summaries', () => {
        const getCashflowSummariesRequest = {
          uponReceiving: 'a request for cashflow summaries',
          withRequest: getWithParams('/cashflow/cashflow-summary', {
            currency: 'currency',
            cashflowFileId: 'cashflowFileId',
            contractId: 'contractId',
            includeAllFailuresInFile: true,
            'states.not': ['state'],
          }),
        };

        beforeEach(() => {
          return provider.addInteraction({
            state: 'i have a list of cashflow summaries',
            ...getCashflowSummariesRequest,
            willRespondWith: ok(getCashflowSummaryMatcher),
          });
        });

        it('returns a successful body', () => {
          return service
            .getCashflowSummaries(getCashflowSummariesParams)
            .toPromise()
            .then((r) => {
              expect(r).toEqual(getCashflowSummary);
            });
        });
      });

      describe('GET Cashflow totals', () => {
        const getCashflowTotals = {
          uponReceiving: 'a request for cashflow totals',
          withRequest: getWithParams('/cashflow/cashflow-totals', { 'state.not': ['state'] }),
        };

        beforeEach(() => {
          return provider.addInteraction({
            state: 'i have a list of cashflow totals',
            ...getCashflowTotals,
            willRespondWith: ok(cashflowTotalsMatcher),
          });
        });

        it('returns a successful body', () => {
          return service
            .getCashflowTotals(['state'])
            .toPromise()
            .then((r) => {
              expect(r).toEqual(cashflowTotals);
            });
        });
      });

      describe('GET Cashflow totals by cashflow file id', () => {
        const getCashflowTotalsById = {
          uponReceiving: 'a request for cashflow totals by cashflow file id',
          withRequest: getWithParams('/cashflow/cashflow-totals', {
            cashflowFileId: 'cashflowFileId',
            'state.not': 'state',
          }),
        };

        beforeEach(() => {
          return provider.addInteraction({
            state: 'i have a list of cashflow totals',
            ...getCashflowTotalsById,
            willRespondWith: ok(cashflowTotalsMatcher),
          });
        });

        it('returns a successful body', () => {
          return service
            .getCashflowTotalsByCashflowFileId('cashflowFileId', ['state'])
            .toPromise()
            .then((r) => {
              expect(r).toEqual(cashflowTotals);
            });
        });
      });

      describe('GET exposure for cashflow file', () => {
        const getExposureForCashflowFile = {
          uponReceiving: 'a request to get exposure for cashflow file',
          withRequest: get('/cashflowfiles/id/cashflowfile-exposure'),
        };

        beforeEach(() => {
          return provider.addInteraction({
            state: 'i have a list exposure for cashflow file',
            ...getExposureForCashflowFile,
            willRespondWith: ok(cashflowFileFacilityMatcher),
          });
        });

        it('returns a successful body', () => {
          return service
            .getFacilitiesForCashflowFile('id')
            .toPromise()
            .then((r) => {
              expect(r).toEqual(cashflowFileFacility);
            });
        });
      });
    });
  },
);
