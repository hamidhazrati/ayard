import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntityService } from '@entities/services/entity.service';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import { SharedModule } from '@app/shared/shared.module';
import { getByTestId } from '@app/shared/utils/test';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { ViewProductCategoryComponent } from '@app/features/product-categories/components/view-product-catgeory/view-product-category.component';
import Mocked = jest.Mocked;
import { viewProductCategoryCrumb } from '@app/features/product-categories/components/view-product-catgeory/view-product-category.crumb';

const ID = '123';

describe('ProductCategoryComponent', () => {
  let component: ViewProductCategoryComponent;
  let fixture: ComponentFixture<ViewProductCategoryComponent>;
  const productCategoryService: Mocked<ProductCategoryService> = MockService(
    ProductCategoryService,
  ) as Mocked<ProductCategoryService>;
  const crumbService: Mocked<CrumbService> = MockService(CrumbService) as Mocked<CrumbService>;

  const productCategory: ProductCategory = {
    id: '1',
    status: 'Active',
    name: 'AR name',
    description: 'AR Description',
    productGuideLink: 'http://abc.xyz',
    productType: 'AR',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProductCategoryComponent],
      imports: [HttpClientTestingModule, BrowserAnimationsModule, SharedModule, MatTabsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: ID }) } },
        },
        EntityService,
        { provide: ProductCategoryService, useValue: productCategoryService },
        { provide: CrumbService, useValue: crumbService },
        HttpClientTestingModule,
      ],
    });

    fixture = TestBed.createComponent(ViewProductCategoryComponent);
    component = fixture.componentInstance;
    productCategoryService.getProductCategoryById.mockReturnValue(of(productCategory));
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('GIVEN ProductCategoryComponent is initialised', () => {
    test('THEN the crumb service should be called', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(
        viewProductCategoryCrumb(productCategory),
      );
    });
  });

  describe('GIVEN a product category', () => {
    test('THEN it should initialise with the product category', () => {
      expectMatch('product-category-id', productCategory.id);
      expectMatch('product-category-name', productCategory.name);
      expectMatch('product-category-status', productCategory.status);
      expectMatch('product-category-description', productCategory.description);
      expectMatch('product-category-guide-link', productCategory.productGuideLink);
      expectMatch('product-category-productType', productCategory.productType);
    });
  });

  function expectMatch(selector: string, expectedValue: string) {
    const debugElement = getByTestId(fixture, selector);
    const value = debugElement.nativeElement.textContent.trim();
    expect(value).toEqual(expectedValue);
  }
});
