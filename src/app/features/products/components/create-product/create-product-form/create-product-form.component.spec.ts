import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CreateProductFormComponent } from './create-product-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MockService } from 'ng-mocks';
import { CounterpartyRoleFormBuilder } from '@app/features/products/counterparty-role-form-builder/counterparty-role-form-builder.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import Mocked = jest.Mocked;
import { ProductService } from '@app/features/products/services/product.service';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {
  getByTestId,
  setInputValueWithDebounce,
  selectFirstOption,
  triggerClick,
} from '@app/shared/utils/test';
import { DEFAULT_DEBOUNCE_TIME } from '@app/shared/validators/service.validator';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('CreateProductFormComponent', () => {
  let component: CreateProductFormComponent;
  let fixture: ComponentFixture<CreateProductFormComponent>;
  const counterpartyRoleFormBuilder: Mocked<CounterpartyRoleFormBuilder> = MockService(
    CounterpartyRoleFormBuilder,
  ) as Mocked<CounterpartyRoleFormBuilder>;
  const productService: Mocked<ProductService> = MockService(ProductService) as Mocked<
    ProductService
  >;
  const productCategoryService: Mocked<ProductCategoryService> = MockService(
    ProductCategoryService,
  ) as Mocked<ProductCategoryService>;

  const PRODUCT_CATEGORIES = [
    {
      id: '1',
      status: 'DRAFT',
      name: 'AR 1',
    },
    {
      id: '2',
      status: 'DRAFT',
      name: 'AR 2',
    },
    {
      id: '3',
      status: 'DRAFT',
      name: 'SCF 1',
    },
  ] as ProductCategory[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProductFormComponent],
      imports: [
        NgStackFormsModule,
        MatCardModule,
        MatTooltipModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatTabsModule,
        SharedModule,
      ],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: ProductCategoryService, useValue: productCategoryService },
        { provide: CounterpartyRoleFormBuilder, useValue: counterpartyRoleFormBuilder },
      ],
    }).compileComponents();

    productCategoryService.getCategories.mockImplementation((b) => {
      return of(PRODUCT_CATEGORIES);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductFormComponent);
    component = fixture.componentInstance;
    productService.isProductNameUnique.mockImplementation((pcid, n) => of(true));
    productService.getParameterDefinitions.mockImplementation(() => of([]));
    fixture.detectChanges();
  });

  describe('GIVEN the component is loaded', () => {
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('WHEN the user selects a status', () => {
    beforeEach(() => {
      selectFirstOption(fixture, 'product-status-select');
    });
    describe('WHEN the user select a product category', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'product-category-select');
      });

      describe('WHEN the user enters a duplicate product name', () => {
        beforeEach(() => {
          productService.isProductNameUnique.mockImplementation((pcid, n) => of(false));
        });

        test('THEN the unique product name error is shown', fakeAsync(() => {
          whenUserEntersAProductName();

          thenErrorIs('product-name-error', 'Product name is not unique within product category.');
        }));
      });

      describe('WHEN the user enters a unique product name', () => {
        test('THEN the unique product name error is not shown', fakeAsync(() => {
          whenUserEntersAProductName();
          thenErrorIsEmpty('product-name-error');
        }));
      });
    });
  });

  describe('WHEN the user enters no data and clicks the save button', () => {
    beforeEach(() => {
      component.form.controls.name.markAsTouched();
      saveIsClicked();
      fixture.detectChanges();
    });

    test('THEN required errors are shown', () => {
      thenErrorIs('product-category-error', 'Product category is required.');
      thenErrorIs('product-name-error', 'Product name is required.');
      thenErrorIs('product-description-error', 'Product description is required.');
    });
  });

  describe('WHEN the user enters minimum data and clicks the save button', () => {
    beforeEach(fakeAsync(() => {
      selectFirstOption(fixture, 'product-status-select');
      selectFirstOption(fixture, 'product-category-select');
      whenUserEntersAProductName();
      setInputValueWithDebounce(
        getByTestId(fixture, 'product-description-textarea'),
        'description',
        DEFAULT_DEBOUNCE_TIME,
      );
      setInputValueWithDebounce(
        getByTestId(fixture, 'product-guide-link'),
        'link',
        DEFAULT_DEBOUNCE_TIME,
      );
    }));

    describe('WHEN the user clicks the save button', () => {
      beforeEach(fakeAsync(() => {
        spyOn(component.save, 'emit');
        saveIsClicked();
      }));

      test('THEN save event is emitted', () => {
        expect(component.save.emit).toHaveBeenCalled();
      });
    });
  });

  function whenUserEntersAProductName() {
    setInputValueWithDebounce(getByTestId(fixture, 'product-name'), 'aaa', DEFAULT_DEBOUNCE_TIME);
    fixture.detectChanges();
  }

  function thenErrorIs(id: string, error: string) {
    const errorEl = getByTestId(fixture, id);
    expect(errorEl.nativeElement.textContent).toEqual(error);
  }

  function thenErrorIsEmpty(id: string) {
    const errorEl = getByTestId(fixture, id);
    expect(errorEl.nativeElement.textContent).toEqual('');
  }

  function saveIsClicked() {
    const saveButton = fixture.debugElement.query(By.css('[data-testid="save"]'));
    triggerClick(fixture, saveButton);
  }
});
