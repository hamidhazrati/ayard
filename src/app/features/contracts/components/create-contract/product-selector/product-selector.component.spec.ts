import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectorComponent } from './product-selector.component';
import { SharedModule } from '@app/shared/shared.module';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import Mocked = jest.Mocked;
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { productCategories } from '@app/features/contracts/components/create-contract/products.test-data';
import { getByTestId, selectFirstOption } from '@app/shared/utils/test';

describe('ProductSelectorComponent', () => {
  let component: ProductSelectorComponent;
  let fixture: ComponentFixture<ProductSelectorComponent>;
  const productCategoryService: Mocked<ProductCategoryService> = MockService(
    ProductCategoryService,
  ) as Mocked<ProductCategoryService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSelectorComponent],
      imports: [SharedModule, NoopAnimationsModule],
      providers: [{ provide: ProductCategoryService, useValue: productCategoryService }],
    }).compileComponents();

    productCategoryService.getCategories.mockReturnValue(of(productCategories));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('GIVEN the component is loaded', () => {
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    test('THEN the category selector is displayed and the product selector is not', () => {
      expect(getByTestId(fixture, 'category')).toBeTruthy();
      expect(getByTestId(fixture, 'product')).toBeFalsy();
      expect(productCategoryService.getCategories).toHaveBeenCalledWith(true);
    });

    describe('WHEN the category is chosen', () => {
      beforeEach(() => selectFirstOption(fixture, 'category'));

      test('THEN the product selector is displayed', () => {
        expect(getByTestId(fixture, 'product')).toBeTruthy();
      });

      describe('WHEN the product is chosen', () => {
        beforeEach(() => selectFirstOption(fixture, 'product'));

        test('THEN the category and product are populated in the form', () => {
          const formControl = component.form.controls;
          expect(formControl.category.value).toEqual(productCategories[0]);
          expect(formControl.product.value).toEqual(productCategories[0].products[0]);
        });
      });
    });
  });
});
