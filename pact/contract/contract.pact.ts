'use strict';

import { pactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { getContractBody, getContractMatcher } from './responses/get-contracts';
import { created, noContent, ok, withPage } from '../helpers/response-helper';
import { get, getWithHttpParams, pageRequest, post, put } from '../helpers/request-helper';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { createContractBody, updateContractBody } from './requests/post-contract';
import { postContractCreated, postContractMatcher } from './responses/post-contract';
import { withPageMatcher } from '../helpers/matcher-helper';

pactWith({ consumer: 'operations-portal', provider: 'contract', cors: true }, (provider) => {
  describe('Contract API', () => {
    let service: ContractService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [ContractService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(ContractService);
    });

    describe('GET contract by Id', () => {
      const getRequest = {
        uponReceiving: 'a request for contract by Id',
        withRequest: get('/contract/b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state:
            'i have a contract with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396 and a role named role1 and currency GBP',
          ...getRequest,
          willRespondWith: ok(getContractMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getContractById('b593aa97-0d5a-4ad9-b015-d3e9dee9e396')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getContractBody);
          });
      });
    });

    describe('GET contracts', () => {
      const getRequest = {
        uponReceiving: 'a request for contracts',
        withRequest: getWithHttpParams('/contract/v2/list', pageRequest()),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state:
            'i have a contract with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396 and a role named role1 and currency GBP',
          ...getRequest,
          willRespondWith: ok(withPageMatcher(getContractMatcher)),
        });
      });

      it('returns a successful body', () => {
        return service
          .getContracts(pageRequest())
          .toPromise()
          .then((r) => {
            expect(r).toEqual(withPage(getContractBody));
          });
      });
    });

    describe('PUT Contract status', () => {
      const putRequest = {
        uponReceiving: 'a request to update status of contract by Id',
        withRequest: put('/contract/b593aa97-0d5a-4ad9-b015-d3e9dee9e396/status', {
          status: 'ACTIVE',
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state:
            'i have a contract with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396 and a role named role1 and currency GBP',
          ...putRequest,
          willRespondWith: noContent(),
        });
      });

      it('returns a 204', () => {
        return service
          .setStatus('b593aa97-0d5a-4ad9-b015-d3e9dee9e396', 'ACTIVE')
          .toPromise()
          .then((r) => {
            expect(r).toBeNull();
          });
      });
    });

    describe('POST Contract', () => {
      const postRequest = {
        uponReceiving: 'a request to create a contract',
        withRequest: post('/contract', {
          ...createContractBody,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state:
            'i have a contract with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396 and a role named role1 and currency GBP',
          ...postRequest,
          willRespondWith: created(postContractMatcher),
        });
      });

      it('returns a 201', () => {
        return service
          .saveContract(createContractBody)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postContractCreated);
          });
      });
    });

    describe('PUT Contract', () => {
      const putRequest = {
        uponReceiving: 'a request to update a contract',
        withRequest: put('/contract/b593aa97-0d5a-4ad9-b015-d3e9dee9e396', {
          ...updateContractBody,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state:
            'i have a contract with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396 and a role named role1 and currency GBP',
          ...putRequest,
          willRespondWith: noContent(),
        });
      });

      it('returns a 204', () => {
        return service
          .updateContract('b593aa97-0d5a-4ad9-b015-d3e9dee9e396', updateContractBody)
          .toPromise()
          .then((r) => {
            expect(r).toBeNull();
          });
      });
    });
  });
});
