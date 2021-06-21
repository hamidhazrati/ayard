import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ListInputComponent),
  multi: true,
};

type OnChange = (values: string[]) => void;

@Component({
  selector: 'app-list-input',
  templateUrl: './list-input.component.html',
  providers: [DEFAULT_VALUE_ACCESSOR],
})
export class ListInputComponent implements ControlValueAccessor {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  values = null;
  private disabled = false;
  @ViewChild('input') calendarInput: ElementRef<HTMLInputElement>;

  private onTouched: () => void = () => {};
  private onChange: OnChange = () => {};

  constructor() {}

  writeValue(value: string[]): void {
    if (value) {
      this.values = Array.isArray(value) ? [...value] : [];
    } else {
      this.values = null;
    }
  }

  registerOnChange(onChange: OnChange): void {
    this.onChange = onChange;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  addValue(value: string) {
    if (value && value.trim().length > 0) {
      if (this.values === null) {
        this.values = [];
      }

      this.values.push(value.trim());
      this.calendarInput.nativeElement.value = '';
      this.onChange(this.values);
    }
  }

  removeValue(value: string) {
    const index = this.values.findIndex((v: string) => v === value);
    this.values.splice(index, 1);
    this.onChange(this.values);
  }
}
