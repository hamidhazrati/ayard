import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { Contract } from '@app/features/contracts/models/contract.model';
import { CreatedContract } from '@app/features/contracts/models/contract.model';
import { ResolutionType, Rule } from '../../products/models/rule.model';

describe('ContractService', () => {
  let service: ContractService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContractService],
    });
    service = TestBed.inject(ContractService);
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

  describe('GIVEN a contract', () => {
    const contract: Contract = { name: 'Contract A' } as Contract;
    const contractId: CreatedContract = { id: '123' };

    describe('WHEN the contract is saved', () => {
      test('THEN the correct call is made to the external contract service', fakeAsync(() => {
        let response = null;

        service.saveContract(contract).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract');

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(contract);

        req.flush(contractId);

        expect(response).toEqual(contractId);
      }));
    });

    describe('WHEN the contract is updated', () => {
      test('THEN the contract is put on the Rest API', fakeAsync(() => {
        let response = null;

        const updateContractId = '132';

        service.updateContract(updateContractId, contract).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/contract/132');

        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual(contract);

        req.flush(updateContractId);

        expect(response).toEqual(updateContractId);
      }));
    });
  });

  describe('GIVEN a contract Id', () => {
    describe('WHEN calling the service to read that contract', () => {
      test('THEN the correct call is made', fakeAsync(() => {
        const id = 12345;
        service.getContractById('abc12345').subscribe();
        tick();
        const req = httpMock.expectOne('/contract/abc12345');
        expect(req.request.method).toEqual('GET');
      }));
    });
  });
  describe('GIVEN a contract Id to update Contract Rule Exception', () => {
    describe('WHEN calling the service to update Contract Rule Exception', () => {
      test('THEN the correct call is made', fakeAsync(() => {
        const contract: Contract = {
          productName: '',
          productCategoryName: '',
          productCategoryId: '',
          name: 'Brian',
          status: 'PENDING_APPROVAL',
          productId: null,
          product: null,
          partnerId: null,
          created: null,
          channelReference: null,
          rules: [],
          id: 'abc12345',
          currencies: null,
          bypassTradeAcceptance: false,
        };
        const rule: Rule = {
          name: '',
          resource: '',
          expression: '',
          code: '',
          message: '',
          matchExpression: '',
          resolutionType: ResolutionType.INTERNAL,
          outcomeType: '',
          outcomeDescription: '',
        };

        service.updateContractRuleException(contract, rule).subscribe();

        tick();

        const req = httpMock.expectOne('/contract/abc12345/rule');
        expect(req.request.method).toEqual('PUT');
      }));
    });
  });
});
