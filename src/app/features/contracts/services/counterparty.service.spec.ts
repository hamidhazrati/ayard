import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CounterpartyService } from './counterparty.service';
import { Counterparty } from '../models/counterparty.model';
import { CreatedCounterparty } from '../models/counterparty.model';
import { BankRequest, Bank, CreatedBank } from '../models/counterparty-bank';

describe('CounterpartyService', () => {
  let service: CounterpartyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CounterpartyService],
    });
    service = TestBed.inject(CounterpartyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GIVEN the service', () => {
    test('THEN it should exist', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('GIVEN a counterparty', () => {
    describe('WHEN the counterparty is saved', () => {
      const counterparty: Counterparty = { name: 'Counterparty A' } as Counterparty;
      const counterpartyId: CreatedCounterparty = { id: '123' };

      test('THEN the correct call is made to the external counterparty service', fakeAsync(() => {
        let response = null;

        service.saveCounterparty(counterparty).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract-counterparty');

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(counterparty);

        req.flush(counterpartyId);

        expect(response).toEqual(counterpartyId);
      }));
    });
  });

  describe('GIVEN a counterparty reference', () => {
    describe('WHEN the counterparty is saved', () => {
      test('THEN the correct call is made to the external counterparty service', fakeAsync(() => {
        let response = null;

        service.updateReferences('AAA-111', ['444', '111']).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract-counterparty/AAA-111/references');

        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual({ references: ['444', '111'] });

        req.flush({});

        expect(response).toEqual({});
      }));
    });
  });

  describe('GIVEN a counterparty', () => {
    describe('WHEN credit status updated', () => {
      test('THEN the correct call is made to the external counterparty service', fakeAsync(() => {
        let response = null;

        service.updateCreditStatus('AAA-ZZZ', 'APPROVED').subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract-counterparty/AAA-ZZZ/credit-status');

        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual({ status: 'APPROVED' });

        req.flush({});

        expect(response).toEqual({});
      }));
    });
  });

  describe('GIVEN a counterparty Bank', () => {
    const counterpartyId = 'counterpartyId';
    const bankRequest: BankRequest = { currency: 'USD' } as BankRequest;
    const bankId: CreatedBank = { id: '123' };
    describe('WHEN bank is added', () => {
      test('THEN the correct call is made to the external counterparty service', fakeAsync(() => {
        let response = null;

        service.addBank(counterpartyId, bankRequest).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract-counterparty/counterpartyId/banks');

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(bankRequest);

        req.flush(bankId);

        expect(response).toEqual(bankId);
      }));
    });
  });

  describe('GIVEN a counterparty Bank', () => {
    const counterpartyId = 'counterpartyId';
    const bankRequest: BankRequest = { currency: 'GBP' } as BankRequest;
    const bankId = '123';
    describe('WHEN bank is updated', () => {
      test('THEN the correct call is made to the external counterparty service', fakeAsync(() => {
        let response = null;

        service.updateBank(counterpartyId, bankId, bankRequest).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract-counterparty/counterpartyId/banks/123');

        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual(bankRequest);
      }));
    });
  });

  describe('GIVEN a counterparty Bank', () => {
    const counterpartyId = 'counterpartyId';
    const bankId = '123';
    describe('WHEN bank is deleted', () => {
      test('THEN the correct call is made to the external counterparty service', fakeAsync(() => {
        let response = null;

        service.deleteBank(counterpartyId, bankId).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract-counterparty/counterpartyId/banks/123');

        expect(req.request.method).toEqual('DELETE');
      }));
    });
  });

  describe('GIVEN a counterparty Bank', () => {
    const counterpartyId = 'counterpartyId';
    const banks: Bank[] = [];
    describe('WHEN get Banks are called', () => {
      test('THEN the correct call is made to the external counterparty service', fakeAsync(() => {
        let response = null;

        service.getBanks(counterpartyId).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract-counterparty/counterpartyId/banks');

        expect(req.request.method).toEqual('GET');

        req.flush(banks);

        expect(response).toEqual(banks);
      }));
    });
  });
});
