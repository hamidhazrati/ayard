import { ListProductsComponent, ProductRow } from './list-products.component';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { listProductsCrumb } from '@app/features/products/components/list-products/list-products.crumb';
import { MockService } from 'ng-mocks';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';

describe('ProductsListComponent', () => {
  let fixture: ComponentFixture<ListProductsComponent>;
  let component: ListProductsComponent;
  let mockCrumbService: CrumbService;
  let mockRouter;
  let spy: any;
  let router: Router;

  const categories: ProductCategory[] = [
    {
      id: 'CAT1',
      name: 'SCF',
      description: 'SCF Desc',
      productGuideLink: null,
      status: 'ACTIVE',
      productType: 'AR',
      products: [
        {
          id: '1',
          productCategoryId: 'CAT1',
          name: 'SCF sub 1',
          description: 'SCF sub 1 desc',
          productGuideLink: null,
          status: 'DISABLED',
          counterpartyRoles: [],
          rules: [],
        },
        {
          id: '2',
          productCategoryId: 'CAT1',
          name: 'SCF sub 2',
          description: 'SCF sub 2 desc',
          productGuideLink: null,
          status: 'DRAFT',
          counterpartyRoles: [],
          rules: [],
        },
      ],
    },
    {
      id: 'CAT2',
      name: 'AR',
      description: 'AR Desc',
      productGuideLink: null,
      status: 'ACTIVE',
      productType: 'AR',
      products: [
        {
          id: '3',
          productCategoryId: 'CAT2',
          name: 'AR sub 1',
          description: 'AR sub 1 desc',
          productGuideLink: null,
          status: 'DISABLED',
          counterpartyRoles: [],
          rules: [],
        },
      ],
    },
  ];

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [ListProductsComponent],
      imports: [
        MatTableModule,
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: CrumbService, useValue: mockCrumbService = MockService(CrumbService) },
        ProductCategoryService,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN should create-attribute-type', inject([HttpClient], () => {
      expect(component).toBeDefined();
    }));

    test('THEN should initialise crumbs', () => {
      spy = jest.spyOn(mockCrumbService, 'setCrumbs');
      component.ngOnInit();
      expect(mockCrumbService.setCrumbs).toHaveBeenCalledWith(listProductsCrumb());
    });

    describe('WHEN refreshed with products and categories', () => {
      beforeEach(async () => {
        const productCategoryService: ProductCategoryService = TestBed.inject(
          ProductCategoryService,
        );
        spy = jest.spyOn(productCategoryService, 'getCategories').mockReturnValue(of(categories));
        component.ngOnInit();
      });

      test('THEN the categories and products are shown correctly', () => {
        const expectedRows: ProductRow[] = [
          {
            id: 'CAT1',
            name: categories[0].name,
            isParent: true,
          },
          {
            id: '1',
            name: categories[0].products[0].name,
            isParent: false,
          },
          {
            id: '2',
            name: categories[0].products[1].name,
            isParent: false,
          },
          {
            id: 'CAT2',
            name: categories[1].name,
            isParent: true,
          },
          {
            id: '3',
            name: categories[1].products[0].name,
            isParent: false,
          },
        ];
        expect(component.productRows).toEqual(expectedRows);
      });

      test('THEN should navigate to view product', () => {
        spy = jest.spyOn(router, 'navigate').mockImplementation(() => of(true).toPromise());
        component.viewProduct('123');
        expect(router.navigate).toHaveBeenCalledWith(['/products', '123']);
      });

      test('THEN should navigate to view product category', () => {
        spy = jest.spyOn(router, 'navigate').mockImplementation(() => of(true).toPromise());
        component.viewProductCategory('777');
        expect(router.navigate).toHaveBeenCalledWith(['/product-categories', '777']);
      });
    });
  });
});
