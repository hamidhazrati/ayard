import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ProductParameterOptionComponent } from './product-parameter-option.component';
import {
  productsModuleDeclarations,
  productsModuleImports,
} from '@app/features/products/products.module';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getByTestId } from '@app/shared/utils/test';

describe('ProductParameterOptionComponent', () => {
  let component: ProductParameterOptionComponent;
  let fixture: ComponentFixture<ProductParameterOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...productsModuleDeclarations],
      imports: [...productsModuleImports, HttpClientModule, NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductParameterOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('GIVEN the component is loaded', () => {
    beforeEach(() => {
      component.writeValue([
        {
          defaultOption: false,
          label: 'testLabel',
          show: false,
          value: 'testValue',
        },
      ]);
    });
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    test('THEN the component elements are displayed', () => {
      fixture.detectChanges();
      expect(getByTestId(fixture, 'label').nativeElement.value).toBe('testLabel');
      expect(getByTestId(fixture, 'defaultOption').attributes['ng-reflect-checked']).toBe('false');
      expect(getByTestId(fixture, 'show')).toBeTruthy();
    });
  });
});
