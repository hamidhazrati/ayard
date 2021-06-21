import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LimitFormFieldComponent, LimitFormValue } from './limit-form-field.component';
import { LimitSource } from '@app/features/contracts/models/contract.model';

describe('LimitFormFieldComponent', () => {
  let component: LimitFormFieldComponent;
  let fixture: ComponentFixture<LimitFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [LimitFormFieldComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // expect(fixture).toMatchSnapshot();
  });

  it('should set disabled state', () => {
    const value = true;
    component.setDisabledState(value);
    expect(component.disabled).toBe(value);
  });

  it('should limit amount change', () => {
    const amount = 123;
    component.limitAmountChange(amount);
    expect(component.currentValue.value).toBe(amount);
  });

  it('should change limit source as expected', () => {
    const limitSource: LimitSource = 'DEFAULT';
    component.limitSourceChanged(limitSource);
    expect(component.currentValue.source).toBe(limitSource);
    expect(component.currentValue.value).toBeNull();
  });

  it('should change limit source as expected, but also alter value', () => {
    const value = 23.98;
    component.currentValue.value = value;
    const limitSource: LimitSource = 'NAMED';
    component.limitSourceChanged(limitSource);
    expect(component.currentValue.source).toBe(limitSource);
    expect(component.currentValue.value).toBe(value);
  });

  it('should render the correct placeholder.', () => {
    component.currentValue.source = 'DEFAULT';
    expect(component.placeholder()).toBe('Facility DCL');
    component.currentValue.source = 'NAMED';
    expect(component.placeholder()).toBe('');
  });

  it('should render its appropriate format', () => {
    expect(component.formatSource('DEFAULT')).toBe('DCL');
    expect(component.formatSource('NAMED')).toBe('Named limit');
  });

  it('should write value', () => {
    const value: LimitFormValue = { source: 'DEFAULT', value: 23 };
    component.writeValue(value);
    expect(component.currentValue).toBe(value);
  });
});
