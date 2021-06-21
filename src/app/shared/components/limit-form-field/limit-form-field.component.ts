import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LimitSource } from '@app/features/contracts/models/contract.model';
import { LimitType } from '@app/features/facilities/models/limit.model';
import { formatTitleCase } from '@app/shared/pipe/titlecase-format.pipe';

export class LimitFormValue {
  source: LimitSource | undefined;
  value?: number;
}

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LimitFormFieldComponent),
  multi: true,
};

type OnChange = (values: LimitFormValue) => void;

@Component({
  selector: 'app-limit-form-field',
  templateUrl: './limit-form-field.component.html',
  styleUrls: ['./limit-form-field.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR],
})
export class LimitFormFieldComponent implements OnInit, ControlValueAccessor {
  @Input()
  limitSources: LimitSource[];

  @Input()
  limitType: LimitType;

  @Input()
  currencyCodes: string[] = [];

  disabled = false;

  currentValue: LimitFormValue = {
    source: undefined,
  };

  private onTouched: () => void = () => {};
  private onChange: OnChange = () => {};

  constructor() {}

  ngOnInit(): void {}

  writeValue(value: LimitFormValue): void {
    this.currentValue = value;
  }

  registerOnChange(onChange: OnChange): void {
    this.onChange = onChange;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  formatSource(limitSource: LimitSource): string {
    switch (limitSource) {
      case 'DEFAULT':
        return 'DCL';
      case 'NAMED':
        return 'Named limit';
      default:
        return formatTitleCase(limitSource);
    }
  }

  valueEnabled() {
    return this.currentValue.source === 'NAMED';
  }

  placeholder() {
    return this.currentValue.source === 'DEFAULT' ? 'Facility DCL' : '';
  }

  limitSourceChanged(limitSource: LimitSource) {
    this.currentValue.source = limitSource;
    this.currentValue.value = limitSource === 'DEFAULT' ? null : this.currentValue.value;
    this.onChange(this.currentValue);
  }

  limitAmountChange(amount: number) {
    this.currentValue.value = amount;
    this.onChange(this.currentValue);
  }
}
