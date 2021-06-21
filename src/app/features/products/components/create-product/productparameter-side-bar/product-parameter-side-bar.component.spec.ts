import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductParameterSideBarComponent } from './product-parameter-side-bar.component';
import {
  productsModuleDeclarations,
  productsModuleImports,
} from '@app/features/products/products.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;

describe('productParameterSideBarComponent', () => {
  let component: ProductParameterSideBarComponent;
  let fixture: ComponentFixture<ProductParameterSideBarComponent>;
  let matDialogRef: MatDialogRef<ProductParameterSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...productsModuleDeclarations],
      imports: [...productsModuleImports, HttpClientModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
        {
          provide: MatDialogRef,
          useValue: matDialogRef = MockService(MatDialogRef) as Mocked<
            MatDialogRef<ProductParameterSideBarComponent>
          >,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductParameterSideBarComponent);
    component = fixture.componentInstance;
  }));

  describe('GIVEN the component is loaded', () => {
    beforeEach(() => {
      component.data = {
        product: {
          id: 1,
          parameters: {
            minTenor: {
              contractConfigurable: false,
              defaultValue: '1',
              helpText: 'helpme',
              maximumValue: '3',
              minimumValue: '1',
              requiredField: false,
              type: 'INTEGER',
            },
          },
        },
        item: { key: 'minTenor', value: { type: 'INTEGER' } },
      };
      component.product = component.data.product;
    });
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    test('First SAVE form in parentForm parameters{} object AND call close() dialog', () => {
      component.ngOnInit();
      const closed = spyOn(component.dialogRef, 'close');
      component.form.value.contractConfigurable = true;
      component.form.value.numberParameter.maximumValue = 30;
      component.form.value.numberParameter.defaultValue = 20;
      component.form.value.numberParameter.minimumValue = 10;
      component.form.value.helpText = 'helpText';
      try {
        component.handleSave();
      } catch {
        // do nothing
      }
      expect(closed).toHaveBeenCalled();
      expect(component.data.product.parameters.minTenor.helpText).toEqual('helpText');
      expect(component.data.product.parameters.minTenor.minimumValue).toEqual(10);
      expect(component.data.product.parameters.minTenor.defaultValue).toEqual(20);
      expect(component.data.product.parameters.minTenor.maximumValue).toEqual(30);
      expect(component.data.product.parameters.minTenor.contractConfigurable).toEqual(true);
    });
  });
});
