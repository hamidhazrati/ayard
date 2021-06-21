import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ViewProductComponent } from './view-product.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntityService } from '@entities/services/entity.service';
import { of } from 'rxjs';
import { ProductService } from '@app/features/products/services/product.service';
import { Product } from '@app/features/products/models/product.model';
import { viewProductCrumb } from '@app/features/products/components/view-product/view-product.crumb';
import { MockService } from 'ng-mocks';
import { getByTestId } from '@app/shared/utils/test';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { productsModuleDeclarations, productsModuleImports } from '../../products.module';
import { SideBarDialogService } from '@app/shared/components/side-bar-dialog/side-bar-dialog.service';

const ID = '123';

describe('ProductComponent', () => {
  let component: ViewProductComponent;
  let fixture: ComponentFixture<ViewProductComponent>;
  let productService;
  let productCategoryService;
  let crumbService;

  const product: Product = {
    id: '1',
    productCategoryId: 'SCF',
    name: 'SCF-SUB',
    description: 'SCF-DUB Desc',
    status: 'DRAFT',
    productGuideLink: 'http://abc.xyz',
    counterpartyRoles: [
      {
        name: 'Test CP Role',
        description: 'Test CP Role Description',
        required: true,
        type: 'PRIMARY',
      },
    ],
    rules: [],
  };

  const category: ProductCategory = {
    id: 'SCF',
    name: 'SCF Cat 1',
    description: 'SCF Cat 1 desc',
    status: 'ACTIVE',
    productType: 'AR',
    productGuideLink: null,
    products: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [productsModuleDeclarations],
      imports: [...productsModuleImports, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        {
          provide: SideBarDialogService,
          useValue: MockService(SideBarDialogService),
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: ID }) } },
        },
        EntityService,
        { provide: ProductService, useValue: productService = MockService(ProductService) },
        {
          provide: ProductCategoryService,
          useValue: productCategoryService = MockService(ProductCategoryService),
        },
        { provide: CrumbService, useValue: crumbService = MockService(CrumbService) },
        HttpClientTestingModule,
      ],
    });

    fixture = TestBed.createComponent(ViewProductComponent);
    component = fixture.componentInstance;
  });

  describe('GIVEN ProductComponent is initialised', () => {
    test('THEN the crumbservice should be called', () => {
      productService.getProductById.mockReturnValue(of(product));
      productCategoryService.getProductCategoryById.mockReturnValue(of(category));
      component.ngOnInit();
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(viewProductCrumb(product, category));
    });
  });

  describe('GIVEN a product', () => {
    test('THEN it should initialise with the product', () => {
      productService.getProductById.mockReturnValue(of(product));
      productCategoryService.getProductCategoryById.mockReturnValue(of(category));
      component.ngOnInit();
      fixture.detectChanges();

      expectMatch('product-id', '1');
      expectMatch('product-category-name', 'SCF Cat 1');
      expectMatch('product-name', 'SCF-SUB');
      expectMatch('product-status', 'Draft');
      expectMatch('product-description', 'SCF-DUB Desc');
      expectMatch('product-guide-link', 'http://abc.xyz');
      // TODO: Add tests for counterpartyRoles when ui design is decided
    });
  });

  function expectMatch(selector: string, expectedValue: string) {
    const debugElement = getByTestId(fixture, selector);
    const value = debugElement.nativeElement.textContent.trim();
    expect(value).toEqual(expectedValue);
  }
});
