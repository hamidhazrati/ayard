'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { ProductService } from '@app/features/products/services/product.service';
import { get, getWithParams, post } from '../helpers/request-helper';
import { created, ok } from '../helpers/response-helper';
import { getProductBody, getProductMatcher } from './response/get-product';
import { postProductCreated, postProductMatcher } from './response/post-product';
import { productSearch } from './requests/get-product';
import { postProductBody } from './requests/post-product';
import { CounterpartyRoleService } from '@app/features/counterparty-roles/services/counterparty-role.service';
import {
  getCounterpartyRoles,
  getCounterpartyRolesMatcher,
  postCounterpartyRoleCreated,
  postCounterpartyRoleMatcher,
} from './response/counterparty-role-responses';
import { postCounterpartyRole } from './requests/counterparty-role-requests';

xpactWith({ consumer: 'operations-portal', provider: 'product', cors: true }, (provider) => {
  describe('Product API', () => {
    let service: ProductService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [ProductService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(ProductService);
    });

    describe('GET Products', () => {
      const getProductsRequest = {
        uponReceiving: 'a request for products',
        withRequest: getWithParams('/product', {
          ...productSearch,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of product',
          ...getProductsRequest,
          willRespondWith: ok(getProductMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getProducts(productSearch)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getProductBody);
          });
      });
    });

    describe('POST product', () => {
      const postRequest = {
        uponReceiving: 'a request to create a product',
        withRequest: post('/product', {
          ...postProductBody,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created a product',
          ...postRequest,
          willRespondWith: created(postProductMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .save(postProductBody)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postProductCreated);
          });
      });
    });

    describe('GET product by Id', () => {
      const getRequest = {
        uponReceiving: 'a request for product by Id',
        withRequest: get('/product/1'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a product with id 1',
          ...getRequest,
          willRespondWith: ok(getProductMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getProductById('1')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getProductBody);
          });
      });
    });
  });

  describe('Counterparty Role API', () => {
    let roleService: CounterpartyRoleService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [CounterpartyRoleService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      roleService = TestBed.inject(CounterpartyRoleService);
    });

    describe('GET counterparty role types by name', () => {
      const getTasksRequest = {
        uponReceiving: 'a request to get counterparty role type by name',
        withRequest: getWithParams('/counterpartyroles', { name: 'role' }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of role types',
          ...getTasksRequest,
          willRespondWith: ok(getCounterpartyRolesMatcher),
        });
      });

      it('returns a successful body', () => {
        return roleService
          .getCounterpartyRoles('role')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCounterpartyRoles);
          });
      });
    });

    describe('GET counterparty role types', () => {
      const getTasksRequest = {
        uponReceiving: 'a request for counterparty role',
        withRequest: get('/counterpartyroles'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of role types',
          ...getTasksRequest,
          willRespondWith: ok(getCounterpartyRolesMatcher),
        });
      });

      it('returns a successful body', () => {
        return roleService
          .getCounterpartyRoles()
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getCounterpartyRoles);
          });
      });
    });

    describe('POST counterparty role type', () => {
      const getTasksRequest = {
        uponReceiving: 'a request to create counterparty role type',
        withRequest: post('/counterpartyroles', {
          ...postCounterpartyRole,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a counterparty role',
          ...getTasksRequest,
          willRespondWith: created(postCounterpartyRoleMatcher),
        });
      });

      it('returns a successful body', () => {
        return roleService
          .saveCounterpartyRole(postCounterpartyRole)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postCounterpartyRoleCreated);
          });
      });
    });
  });
});
