import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductCategoryService } from './product-category.service';
import { ConfigService } from '@app/services/config/config.service';
import { DeepPartial } from 'utility-types';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  CreatedProductCategory,
  ProductCategory,
} from '@app/features/product-categories/models/product-category.model';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import DoneCallback = jest.DoneCallback;

const API_URL = 'http://localhost:8080';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let httpMock: HttpTestingController;
  const mockConfigService: Mocked<ConfigService> = MockService(ConfigService) as Mocked<
    ConfigService
  >;

  const getProductCategory = (productCategory: DeepPartial<ProductCategory>): ProductCategory => {
    return {
      id: productCategory.id,
      name: productCategory.name,
      status: productCategory.status,
      description: productCategory.description,
      productGuideLink: productCategory.productGuideLink,
    } as ProductCategory;
  };

  const expectedProductCategories: ProductCategory[] = [
    getProductCategory({
      id: '123',
      name: 'PrCat1',
      description: 'desc',
      productGuideLink: 'aguidelink',
    }),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useValue: mockConfigService }],
    });
    mockConfigService.getApiUrl.mockReturnValue(API_URL);
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductCategoryService);
  });

  describe('GIVEN dependencies exist', () => {
    test('THEN ProductCategoryService is created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('GIVEN ProductCategoryService is created', () => {
    describe('WHEN a product category is saved', () => {
      test('THEN should save a product category', fakeAsync(() => {
        const productCategory: ProductCategory = getProductCategory({
          id: '123',
          name: 'PrCat1',
          description: 'desc',
          productGuideLink: 'aguidelink',
        });
        const productCategoryId: CreatedProductCategory = { id: '123' };

        let response = null;

        service.save(productCategory).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne(`${API_URL}/product-category`);

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(productCategory);

        req.flush(productCategoryId);

        expect(response).toEqual(productCategoryId);
      }));
    });

    describe('WHEN we call the service to get all categories excluding products', () => {
      test('THEN it should get all categories with no enrichment by default', fakeAsync(() => {
        service.getCategories().subscribe();
        tick();
        const req = httpMock.expectOne(`${API_URL}/product-category?includeProducts=false`);
        expect(req.request.method).toEqual('GET');
      }));
    });

    describe('WHEN we call the service to get all categories including products', () => {
      test('THEN it should get all categories with enrichment when asked for', fakeAsync(() => {
        service.getCategories(true).subscribe();
        tick();
        const req = httpMock.expectOne(`${API_URL}/product-category?includeProducts=true`);
        expect(req.request.method).toEqual('GET');
      }));
    });

    describe('WHEN the product categories are retrieved by name', () => {
      test('THEN should fetch all product categories with the same name', (done) => {
        service.getByName('PrCat1').subscribe((actualProductCategories: ProductCategory[]) => {
          expect(actualProductCategories).toEqual(expectedProductCategories);
          done();
        });

        const req = httpMock.expectOne(`${API_URL}/product-category?name=PrCat1`);
        expect(req.request.method).toEqual('GET');
        req.flush(expectedProductCategories);
      });
    });

    describe('WHEN a product category name is check for uniqueness', () => {
      describe('WHEN a identical product category name exists', () => {
        test('THEN should perform uniqueness check based on product category name when is not unique', (done: DoneCallback) => {
          service.isUnique('PrCat1').subscribe((isUnique: boolean) => {
            expect(isUnique).toEqual(false);
            done();
          });

          const req = httpMock.expectOne(`${API_URL}/product-category?name=PrCat1`);
          expect(req.request.method).toEqual('GET');
          req.flush(expectedProductCategories);
        });
      });

      describe('WHEN a identical product category name does not exist', () => {
        test('THEN should perform uniqueness check based on product category name when is unique (empty array case)', (done: DoneCallback) => {
          service.isUnique('PrCat1').subscribe((isUnique: boolean) => {
            expect(isUnique).toEqual(true);
            done();
          });

          const req = httpMock.expectOne(`${API_URL}/product-category?name=PrCat1`);
          expect(req.request.method).toEqual('GET');
          req.flush([]);
        });
      });

      describe('WHEN there are no product categories', () => {
        test('THEN should perform uniqueness check based on product category name when is unique (null case)', (done: DoneCallback) => {
          service.isUnique('PrCat1').subscribe((isUnique: boolean) => {
            expect(isUnique).toEqual(true);
            done();
          });

          const req = httpMock.expectOne(`${API_URL}/product-category?name=PrCat1`);
          expect(req.request.method).toEqual('GET');
          req.flush(null);
        });
      });

      describe('WHEN we call the service to get a specific category', () => {
        test('THEN it should get product category by id', fakeAsync(() => {
          service.getProductCategoryById('abcd').subscribe();
          tick();
          const req = httpMock.expectOne(`${API_URL}/product-category/abcd`);
          expect(req.request.method).toEqual('GET');
        }));
      });
    });
  });
});
