import { FormControl, ValidatorsModel } from '@ng-stack/forms';

export class TrimFormControl<V extends object = ValidatorsModel> extends FormControl<string, V> {
  private internalValue: string | null;

  get value(): string | null {
    return this.internalValue;
  }

  set value(value: string | null) {
    this.internalValue = value ? value.trim() : value;
  }
}
