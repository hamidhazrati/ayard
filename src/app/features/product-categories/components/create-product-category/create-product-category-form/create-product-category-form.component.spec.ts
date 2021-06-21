import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { CreateProductCategoryFormComponent } from './create-product-category-form.component';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MockService } from 'ng-mocks';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import {
  getByTestId,
  setInputValue,
  selectFirstOption,
  setInputValueWithDebounce,
  triggerClick,
} from '@app/shared/utils/test';
import { Entity } from '@entities/models/entity.model';
import Mock = jest.Mock;
import { SharedModule } from '@app/shared/shared.module';
import { of } from 'rxjs';
import { DEFAULT_DEBOUNCE_TIME } from '@app/shared/validators/service.validator';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

describe('CreateProductCategoryFormComponent', () => {
  let component: CreateProductCategoryFormComponent;
  let fixture: ComponentFixture<CreateProductCategoryFormComponent>;
  const productCategoryService = MockService(ProductCategoryService);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProductCategoryFormComponent],
      imports: [
        CommonModule,
        NgStackFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatSelectModule,
        SharedModule,
        RouterTestingModule.withRoutes([
          { path: 'products', component: CreateProductCategoryFormComponent },
        ]),
      ],
      providers: [
        { provide: ProductCategoryService, useValue: productCategoryService },
        HttpClientTestingModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CreateProductCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    productCategoryService.isUnique = jest.fn().mockReturnValue(of(true));
  }));

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('GIVEN I want to create a product category', () => {
    let save: Mock;
    let expectedFields: Entity[];

    beforeEach(() => {
      save = jest.fn();
      component.save.subscribe(save);

      expectedFields = [];
    });

    test('WHEN only mandatory fields are populated THEN save OK', fakeAsync(() => {
      setInputValue(getByTestId(fixture, 'name'), ' Valid Name  ');
      tick(1000);
      selectFirstOption(fixture, 'status-selector'); // DRAFT
      setInputValue(getByTestId(fixture, 'description'), 'desc 1  ');
      selectFirstOption(fixture, 'productType-selector'); // AR
      tick(1000);
      triggerClick(fixture, getByTestId(fixture, 'save'));

      expect(save).toHaveBeenCalledWith({
        name: 'Valid Name',
        description: 'desc 1',
        status: 'DRAFT',
        productGuideLink: '',
        productType: 'AR',
      });
    }));

    test('WHEN all the fields are populated THEN save OK', fakeAsync(() => {
      setInputValue(getByTestId(fixture, 'name'), ' Valid Name  ');
      tick(1000);
      selectFirstOption(fixture, 'status-selector'); // DRAFT
      setInputValue(getByTestId(fixture, 'description'), 'desc 1  ');
      setInputValue(getByTestId(fixture, 'guideLink'), 'http://google.com');
      selectFirstOption(fixture, 'productType-selector'); // AR
      fixture.detectChanges();
      tick(1000);
      triggerClick(fixture, getByTestId(fixture, 'save'));
      expect(save).toHaveBeenCalledWith({
        name: 'Valid Name',
        description: 'desc 1',
        status: 'DRAFT',
        productType: 'AR',
        productGuideLink: 'http://google.com',
      });
    }));

    test('WHEN fields left empty THEN the mandatory fields are highlighted AND the form is not submitted', () => {
      component.save.subscribe(save);
      triggerClick(fixture, getByTestId(fixture, 'save'));

      expect(getByTestId(fixture, 'name-error')).toBeTruthy();
      expect(getByTestId(fixture, 'status-error')).toBeTruthy();
      expect(getByTestId(fixture, 'productType-error')).toBeTruthy();
      expect(getByTestId(fixture, 'description-error')).toBeTruthy();

      expect(save).not.toHaveBeenCalled();
    });

    function thenErrorIs(id: string, error: string) {
      const errorEl = getByTestId(fixture, id);
      expect(errorEl.nativeElement.textContent).toEqual(error);
    }

    test('WHEN product category name already exists THEN error message is displayed AND the form is not submitted', fakeAsync(() => {
      productCategoryService.isUnique = jest.fn().mockReturnValue(of(false));

      setInputValueWithDebounce(
        getByTestId(fixture, 'name'),
        ' Valid Name  ',
        DEFAULT_DEBOUNCE_TIME,
      );

      component.save.subscribe(save);
      triggerClick(fixture, getByTestId(fixture, 'save'));

      expect(getByTestId(fixture, 'name-error')).toBeTruthy();
      thenErrorIs('name-error', 'A product category with this name already exists.');

      expect(save).not.toHaveBeenCalled();
    }));

    test('cancel works', inject([Router, Location], (router: Router, location: Location) => {
      triggerClick(fixture, getByTestId(fixture, 'cancel'));
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/products');
      });
    }));
  });
});
