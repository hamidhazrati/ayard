'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { ProductService } from '@app/features/products/services/product.service';
import { get, getWithParams, post } from '../helpers/request-helper';
import { created, ok } from '../helpers/response-helper';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import {
  getProductCategories,
  getProductCategoriesMatcher,
  getProductCategoryMatcher,
} from './response/get-product-category';
import {
  postProductCategoryCreated,
  postProductCategoryMatcher,
} from './response/post-product-category';
import { postProductCategoryBody } from './requests/post-product-category';

xpactWith({ consumer: 'operations-portal', provider: 'product', cors: true }, (provider) => {
  describe('Product Category API', () => {
    let service: ProductCategoryService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [ProductService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(ProductCategoryService);
    });

    describe('CREATE Category', () => {
      const postRequest = {
        uponReceiving: 'a request to create a product categories',
        withRequest: post('/product-category', {
          ...postProductCategoryBody,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created a product category',
          ...postRequest,
          willRespondWith: created(postProductCategoryMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .save(getProductCategories[0])
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postProductCategoryCreated);
          });
      });
    });

    describe('GET Categories by name', () => {
      const getProductCategoriesRequest = {
        uponReceiving: 'a request for product categories by name',
        withRequest: getWithParams('/product-category', {
          name: 'category1',
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of product categories by name',
          ...getProductCategoriesRequest,
          willRespondWith: ok(getProductCategoriesMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getByName('category1')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getProductCategories);
          });
      });
    });

    describe('GET Categories', () => {
      const getProductCategoriesRequest = {
        uponReceiving: 'a request for product categories',
        withRequest: getWithParams('/product-category', {
          includeProducts: true,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of product categories',
          ...getProductCategoriesRequest,
          willRespondWith: ok(getProductCategoriesMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getCategories(true)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getProductCategories);
          });
      });
    });

    describe('GET Category by ID', () => {
      const getProductsRequest = {
        uponReceiving: 'a request for product categories by id',
        withRequest: get('/product-category/b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a product category with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
          ...getProductsRequest,
          willRespondWith: ok(getProductCategoryMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getProductCategoryById('b593aa97-0d5a-4ad9-b015-d3e9dee9e396')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getProductCategories[0]);
          });
      });
    });
  });
});
