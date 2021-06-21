import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInputComponent } from './list-input.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GIVEN ListInputComponent', () => {
  let component: ListInputComponent;
  let fixture: ComponentFixture<ListInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListInputComponent],
      imports: [MatChipsModule, MatFormFieldModule, MatIconModule, NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('THEN is should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('GIVEN I add a value', () => {
    test('THEN it should add the value to the list', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      component.addValue('Value 123');
      const expectValues = ['Value 123'];
      expect(component.values).toEqual(expectValues);
      expect(onChange).toHaveBeenCalledWith(expectValues);
    });

    test('THEN it should many the values to the list', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      component.addValue('Value 123');
      component.addValue('Value ABC');
      const expectValues = ['Value 123', 'Value ABC'];
      expect(component.values).toEqual(expectValues);
      expect(onChange).toBeCalledTimes(2);
    });

    test('THEN it should trim white space', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      component.addValue('   Value 123   ');
      const expectValues = ['Value 123'];
      expect(component.values).toEqual(expectValues);
      expect(onChange).toHaveBeenCalledWith(expectValues);
    });
  });

  describe('GIVEN I remove a value', () => {
    test('THEN it should remove the value to the list', () => {
      const onChange = jest.fn();
      component.writeValue(['Value 123', 'Value ABC']);
      component.registerOnChange(onChange);
      component.removeValue('Value 123');
      const expectValues = ['Value ABC'];
      expect(component.values).toEqual(expectValues);
      expect(onChange).toHaveBeenCalledWith(expectValues);
    });
  });
});
