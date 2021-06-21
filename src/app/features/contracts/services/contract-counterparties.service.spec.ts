import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import {
  ContractCounterPartiesService,
  CreateContractRequest,
} from './contract-counterparties.service';
import { MockService } from 'ng-mocks';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { of } from 'rxjs';
import { CreatedContract } from '@app/features/contracts/models/contract.model';
import { CreatedCounterparty } from '@app/features/contracts/models/counterparty.model';
import { Rule } from '@app/features/products/models/rule.model';
import Mocked = jest.Mocked;
import { ResolutionType } from '../../products/models/rule.model';

describe('ContractCounterPartiesService', () => {
  const contractService: Mocked<ContractService> = MockService(ContractService) as Mocked<
    ContractService
  >;
  const counterpartyService: Mocked<CounterpartyService> = MockService(
    CounterpartyService,
  ) as Mocked<CounterpartyService>;
  let service: ContractCounterPartiesService;

  const CONTRACT_ID: CreatedContract = { id: '123' };

  contractService.saveContract.mockImplementation(() => {
    return of(CONTRACT_ID);
  });

  const COUNTER_PARTY_ID_1: CreatedCounterparty = { id: '444' };
  const COUNTER_PARTY_ID_2: CreatedCounterparty = { id: '555' };

  counterpartyService.saveCounterparty.mockImplementation(() => {
    return of(COUNTER_PARTY_ID_1, COUNTER_PARTY_ID_2);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContractCounterPartiesService,
        { provide: ContractService, useValue: contractService },
        { provide: CounterpartyService, useValue: counterpartyService },
      ],
    });
    service = TestBed.inject(ContractCounterPartiesService);
  });

  describe('Create contract and counter parties', () => {
    describe('GIVEN a create contract request', () => {
      const rules: Rule[] = [
        {
          name: 'Tenor',
          resource: 'PRICING',
          matchExpression: null,
          resolutionType: ResolutionType.INTERNAL,
          expression: 'expr',
          message: 'message',
          code: 'CDE',
          outcomeType: 'TERMINAL',
          outcomeDescription: null,
        },
      ];
      const request = {
        name: 'contract A',
        product: 'Product X',
        partnerId: 'Partner A',
        counterparties: [
          {
            entity: {
              id: '333',
              name: 'Buyer',
            },
            productCounterpartyRole: {
              name: 'BUYER',
            },
            reference: 'BUYER REF_123',
          },
          {
            entity: {
              id: '777',
              name: 'Seller',
            },
            productCounterpartyRole: {
              name: 'SELLER',
            },
          },
        ],
        rules,
      } as CreateContractRequest;

      describe('WHEN the request is saved', () => {
        const expectedContract = {
          name: request.name,
          product: request.product,
          partnerId: 'Partner A',
          channelReference: 'N/A',
          rules,
        };

        const expectedCounterparty1 = {
          name: request.counterparties[0].entity.name,
          entityId: request.counterparties[0].entity.id,
          role: 'BUYER',
          contractId: CONTRACT_ID.id,
          countryOfOperation: request.counterparties[0].entity.address?.country,
          counterpartyReference: 'BUYER REF_123',
        };

        const expectedCounterparty2 = {
          name: request.counterparties[1].entity.name,
          entityId: request.counterparties[1].entity.id,
          role: 'SELLER',
          contractId: CONTRACT_ID.id,
          countryOfOperation: request.counterparties[1].entity.address?.country,
          counterpartyReference:
            request.counterparties[1].productCounterpartyRole.name +
            request.counterparties[1].entity.id,
        };
        test('THEN the correct calls are made to the services', fakeAsync(() => {
          let response = null;

          service.save(request).subscribe((res) => {
            response = res;
          });

          tick();

          expect(contractService.saveContract).toHaveBeenCalledWith(
            expect.objectContaining(expectedContract),
          );
          expect(counterpartyService.saveCounterparty).toHaveBeenCalledWith(expectedCounterparty1);
          expect(counterpartyService.saveCounterparty).toHaveBeenCalledWith(expectedCounterparty2);
        }));
      });
    });
  });
});
