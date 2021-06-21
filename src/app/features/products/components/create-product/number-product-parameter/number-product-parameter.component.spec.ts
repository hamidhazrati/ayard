import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberProductParameterComponent } from './number-product-parameter.component';
import {
  productsModuleDeclarations,
  productsModuleImports,
} from '@app/features/products/products.module';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getByTestId } from '@app/shared/utils/test';

describe('NumberProductParameterComponent', () => {
  let component: NumberProductParameterComponent;
  let fixture: ComponentFixture<NumberProductParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...productsModuleDeclarations],
      imports: [...productsModuleImports, HttpClientModule, NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberProductParameterComponent);
    component = fixture.componentInstance;
    component.item = {
      initialDefaultValue: { mandatory: true, value: 123 },
      initialMinimumValue: { mandatory: true, value: 123 },
      initialMaximumValue: { mandatory: true, value: 123 },
    };
    fixture.detectChanges();
  });

  describe('GIVEN the component is loaded', () => {
    beforeEach(() => {
      component.writeValue({
        defaultValue: 5,
        minimumValue: 2,
        maximumValue: 10,
      });
    });
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    test('THEN the component elements are displayed', () => {
      fixture.detectChanges();
      expect(getByTestId(fixture, 'defaultValue').nativeElement.value).toBe('5');
      expect(getByTestId(fixture, 'minValue').nativeElement.value).toBe('2');
      expect(getByTestId(fixture, 'maxValue').nativeElement.value).toBe('10');
    });
  });
});
