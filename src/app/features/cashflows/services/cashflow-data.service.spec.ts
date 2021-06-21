import { HttpParams } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import {
  CashflowDataService,
  CashflowSummariesParams,
  RejectCashflow,
} from '@cashflows/services/cashflow-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@app/services/config/config.service';
import { MockService } from 'ng-mocks';
import { CashflowStatusUpdate } from '../models/cashflow-file';
import { PageRequestFactory } from '@app/shared/pagination';
import Mocked = jest.Mocked;

const API_URL = 'http://localhost:8080';

describe('CashflowService', () => {
  let service: CashflowDataService;
  let httpMock: HttpTestingController;
  const mockConfigService: Mocked<ConfigService> = MockService(ConfigService) as Mocked<
    ConfigService
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CashflowDataService, { provide: ConfigService, useValue: mockConfigService }],
    });
    service = TestBed.inject(CashflowDataService);
    httpMock = TestBed.inject(HttpTestingController);
    mockConfigService.getApiUrl.mockReturnValue(API_URL);
  });

  describe('GIVEN the CashflowDataService is initialised', () => {
    test('THEN it should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('getCashflowSummaries', () => {
      const FILE_ID = 'abc123';
      const CONTRACT_ID = 'def456';
      const CURRENCY = 'USD';
      const EXCLUDED_STATES = ['INVALID', 'REJECTED'];

      describe('WHEN it is called with no params', () => {
        test('THEN it should get call cashflows api correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {};

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(`${API_URL}/cashflow/cashflow-summary`);

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
        }));
      });

      describe('WHEN it is called with just cashflowFileId', () => {
        test('THEN it should get call cashflows api correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {
            cashflowFileId: FILE_ID,
          };

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(
            `${API_URL}/cashflow/cashflow-summary?cashflowFileId=${FILE_ID}`,
          );

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
          expect(req.request.params.get('cashflowFileId')).toEqual(FILE_ID);
        }));
      });

      describe('WHEN it is called with just currency', () => {
        test('THEN it should get call cashflows api correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {
            currency: CURRENCY,
          };

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(
            `${API_URL}/cashflow/cashflow-summary?currency=${CURRENCY}`,
          );

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
          expect(req.request.params.get('currency')).toEqual(CURRENCY);
        }));
      });

      describe('WHEN it is called with just contractId', () => {
        test('THEN it should get call cashflows api correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {
            contractId: CONTRACT_ID,
          };

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(
            `${API_URL}/cashflow/cashflow-summary?contractId=${CONTRACT_ID}`,
          );

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
          expect(req.request.params.get('contractId')).toEqual(CONTRACT_ID);
        }));
      });

      describe('WHEN it is called with just includeAllFailuresInFile param', () => {
        test('THEN it should get call cashflows api correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {
            includeAllFailuresInFile: false,
          };

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(
            `${API_URL}/cashflow/cashflow-summary?includeAllFailuresInFile=false`,
          );

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
          expect(req.request.params.get('includeAllFailuresInFile')).toEqual('false');
        }));
      });

      describe('WHEN it is called with just excludedStates', () => {
        test('THEN it should get call cashflows api correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {
            excludedStates: EXCLUDED_STATES,
          };

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(
            `${API_URL}/cashflow/cashflow-summary?states.not=INVALID&states.not=REJECTED`,
          );

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
          expect(req.request.params.getAll('states.not')).toEqual(EXCLUDED_STATES);
        }));
      });

      describe('WHEN it is called with all params', () => {
        test('THEN it should get call cashflows api correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {
            cashflowFileId: FILE_ID,
            currency: CURRENCY,
            contractId: CONTRACT_ID,
            includeAllFailuresInFile: false,
            excludedStates: EXCLUDED_STATES,
          };

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(
            `${API_URL}/cashflow/cashflow-summary?currency=${CURRENCY}&cashflowFileId=${FILE_ID}&contractId=${CONTRACT_ID}&includeAllFailuresInFile=false&states.not=INVALID&states.not=REJECTED`,
          );

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
          expect(req.request.params.get('cashflowFileId')).toEqual(FILE_ID);
          expect(req.request.params.get('currency')).toEqual(CURRENCY);
          expect(req.request.params.get('contractId')).toEqual(CONTRACT_ID);
          expect(req.request.params.get('includeAllFailuresInFile')).toEqual('false');
          expect(req.request.params.getAll('states.not')).toEqual(EXCLUDED_STATES);
        }));
      });

      describe('WHEN it is called with some params', () => {
        test('THEN it should call the API correctly', fakeAsync(() => {
          const params: CashflowSummariesParams = {
            cashflowFileId: FILE_ID,
            includeAllFailuresInFile: true,
            excludedStates: EXCLUDED_STATES,
          };

          service.getCashflowSummaries(params).subscribe();

          tick();

          const req = httpMock.expectOne(
            `${API_URL}/cashflow/cashflow-summary?cashflowFileId=${FILE_ID}&includeAllFailuresInFile=true&states.not=INVALID&states.not=REJECTED`,
          );

          expect(req.request.method).toEqual('GET');
          expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-summary`);
          expect(req.request.params.get('cashflowFileId')).toEqual(FILE_ID);
          expect(req.request.params.get('includeAllFailuresInFile')).toEqual('true');
          expect(req.request.params.getAll('states.not')).toEqual(['INVALID', 'REJECTED']);
        }));
      });
    });

    describe('WHEN we call the getCashflows', () => {
      test('THEN it should get all cashflows by default', fakeAsync(() => {
        service.getCashflows().subscribe();

        tick();

        const req = httpMock.expectOne(`${API_URL}/cashflow`);

        expect(req.request.method).toEqual('GET');
      }));
    });

    describe('WHEN we call getCashflowFiles', () => {
      test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
        const params: HttpParams = new PageRequestFactory().createHttpParams();
        service.getCashflowFiles(params).subscribe();

        tick();

        const req = httpMock.expectOne(`${API_URL}/cashflowfiles?page=0&size=10`);

        expect(req.request.method).toEqual('GET');
        expect(req.request.urlWithParams).toEqual(`${API_URL}/cashflowfiles?page=0&size=10`);
      }));
    });

    describe('WHEN we call the service to get a specific cashflow file', () => {
      test('THEN it should get cashflowfile by id', fakeAsync(() => {
        service.getCashflowFile('abcd').subscribe();

        tick();

        const req = httpMock.expectOne(`${API_URL}/cashflowfiles/abcd`);

        expect(req.request.method).toEqual('GET');
        expect(req.request.url).toEqual(`${API_URL}/cashflowfiles/abcd`);
      }));
    });
  });

  describe('WHEN I call uploadCashflowFile', () => {
    test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
      const file = new File([''], 'some-file.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append('clientName', 'Client Name');
      formData.append('file', file);

      service.uploadCashflowFile(formData).subscribe();

      tick();

      const req = httpMock.expectOne(`${API_URL}/cashflowfiles`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.reportProgress).toEqual(true);
      expect(req.request.url).toEqual(`${API_URL}/cashflowfiles`);
    }));
  });

  describe('WHEN we call updateCashflowStatus', () => {
    test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
      const cashflowFileId = 'abc-123-456-xyz';
      const formData: CashflowStatusUpdate = {
        status: 'REJECTED',
        message: 'Monday is the not the first day of the week',
        user: 'ops-portal-user',
      };
      service.updateCashflowStatus(cashflowFileId, formData).subscribe();
      tick();

      const req = httpMock.expectOne(
        `${API_URL}/cashflowfiles/${cashflowFileId}/processing-status`,
      );

      expect(req.request.method).toEqual('POST');
      expect(req.request.url).toEqual(
        `${API_URL}/cashflowfiles/${cashflowFileId}/processing-status`,
      );
    }));
  });

  describe('GIVEN a call is made to get cashflow totals', () => {
    describe('WHEN there are no excluded states', () => {
      test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
        const excludedStates: string[] = [];
        service.getCashflowTotals(excludedStates).subscribe();

        tick();

        const req = httpMock.expectOne(`${API_URL}/cashflow/cashflow-totals`);

        expect(req.request.method).toEqual('GET');
        expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-totals`);
      }));
    });

    describe('WHEN there are excluded states', () => {
      test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
        const excludedStates: string[] = ['INVALID', 'REJECTED'];
        service.getCashflowTotals(excludedStates).subscribe();

        tick();

        const req = httpMock.expectOne(
          `${API_URL}/cashflow/cashflow-totals?state.not=INVALID&state.not=REJECTED`,
        );

        expect(req.request.method).toEqual('GET');
        expect(req.request.url).toEqual(`${API_URL}/cashflow/cashflow-totals`);
        expect(req.request.params.getAll('state.not')).toEqual(['INVALID', 'REJECTED']);
      }));
    });
  });

  describe('GIVEN a call is made to rejectCashflows', () => {
    test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
      const formData: RejectCashflow[] = [
        { id: 'abc-123', message: 'the rejection message' },
        { id: 'def-345', message: 'another rejection message' },
      ];
      service.rejectCashflows(formData).subscribe();

      tick();

      const req = httpMock.expectOne(`${API_URL}/cashflow/reject-batch`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.url).toEqual(`${API_URL}/cashflow/reject-batch`);
    }));
  });

  describe('WHEN we call downloadCashflowFileExport', () => {
    test('THEN it should call the API and translate the response', (done) => {
      service.downloadCashflowFileExport('fileId').subscribe((value) => {
        expect(value.filename).toEqual('file.ext');
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/cashflowfiles/fileId/export`);
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual(`${API_URL}/cashflowfiles/fileId/export`);

      req.flush(new Blob(), {
        headers: { 'content-disposition': 'attachment; filename="file.ext"' },
      });
      httpMock.verify();
    });
  });

  describe('WHEN we call getFacilitiesForCashflowFile', () => {
    test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
      service.getFacilitiesForCashflowFile('abcd123').subscribe();

      tick();

      const req = httpMock.expectOne(`${API_URL}/cashflowfiles/abcd123/cashflowfile-exposure`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual(`${API_URL}/cashflowfiles/abcd123/cashflowfile-exposure`);
    }));
  });
});
