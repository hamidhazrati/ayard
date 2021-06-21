import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  CreatedProduct,
  Product,
  ProductSearch,
} from '@app/features/products/models/product.model';
import { DeepPartial } from 'utility-types';
import { Rule } from '@app/features/products/models/rule.model';
import { ResolutionType } from '../models/rule.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const getProduct = (product: DeepPartial<Product>): Product => {
    return {
      id: product.id,
      productCategoryId: product.productCategoryId,
      name: product.name,
      status: product.status,
      description: product.description,
      productGuideLink: product.productGuideLink,
      counterpartyRoles: product.counterpartyRoles || [],
    } as Product;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
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

  describe('GIVEN there are saved products', () => {
    const products: Product[] = [
      getProduct({ id: '1', productCategoryId: 'SCF', name: 'Product A' }),
      getProduct({ id: '2', productCategoryId: 'SCF', name: 'Product B' }),
    ];

    describe('WHEN all of the products are retrieved', () => {
      test('THEN products should be returned', fakeAsync(() => {
        let response = null;

        service.getProducts().subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/product');

        expect(req.request.method).toEqual('GET');

        req.flush(products);

        expect(response).toEqual(products);
      }));
    });

    describe('WHEN the products are searched for', () => {
      test('THEN products should be returned', fakeAsync(() => {
        let response = null;

        const search: ProductSearch = { productCategoryId: '123', name: 'ABC' };

        service.getProducts(search).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne(
          `/product?productCategoryId=${search.productCategoryId}&name=${search.name}`,
        );

        expect(req.request.method).toEqual('GET');

        req.flush(products);

        expect(response).toEqual(products);
      }));
    });

    describe('WHEN a product is retrieved', () => {
      test('THEN the product should be returned', fakeAsync(() => {
        let response = null;

        service.getProductById('123').subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/product/123');

        expect(req.request.method).toEqual('GET');

        req.flush(products[1]);

        expect(response).toEqual(products[1]);
      }));
    });

    describe('WHEN a check is made to see if the name is unique', () => {
      test('THEN no call is made to product service if product category id is null', fakeAsync(() => {
        let response = null;

        service.isProductNameUnique(null, 'aaa').subscribe((res) => {
          response = res;
        });

        expect(response).toBeTruthy();
      }));

      test('THEN no call is made to product service if name is null', fakeAsync(() => {
        let response = null;

        service.isProductNameUnique('123', null).subscribe((res) => {
          response = res;
        });

        expect(response).toBeTruthy();
      }));
    });

    describe('WHEN a check is made to see if the name is unique', () => {
      test.each`
        productCategoryId | name     | response          | expected
        ${'123'}          | ${'AAA'} | ${[]}             | ${true}
        ${'123'}          | ${'AAA'} | ${['aa', 'AAAa']} | ${true}
        ${'123'}          | ${'AAA'} | ${['aa', 'aaA']}  | ${false}
      `(
        'THEN $expected is returned if product category is $productCategoryId, name is $name and response is "$response"',
        fakeAsync(({ productCategoryId, name, response, expected }) => {
          let isUnique: undefined | boolean = false;

          service.isProductNameUnique(productCategoryId, name).subscribe((res) => {
            isUnique = res;
          });

          const req = httpMock.expectOne(
            `/product?productCategoryId=${productCategoryId}&name=${name}`,
          );

          expect(req.request.method).toEqual('GET');

          req.flush(response.map((productName) => ({ name: productName })));

          expect(isUnique).toEqual(expected);
        }),
      );
    });
  });

  describe('GIVEN a new product', () => {
    const product: Product = getProduct({ id: '123', productCategoryId: 'SCF' });
    describe('WHEN the product is saved', () => {
      test('THEN product is POSTed to the product service', fakeAsync(() => {
        const productId: CreatedProduct = { id: '123' };

        let response = null;

        service.save(product).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/product');

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(product);

        req.flush(productId);

        expect(response).toEqual(productId);
      }));
      test('THEN RULE is POSTed to the product service', fakeAsync(() => {
        const productId: CreatedProduct = { id: '123' };

        let response = null;
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

        service.validateProductRule(rule).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/product/rule/validate');

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(rule);

        req.flush(rule);

        expect(response).toEqual(rule);
      }));
    });
  });
});
