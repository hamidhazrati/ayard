import {
  AfterViewInit,
  Component,
  DoCheck,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { ProductService } from '@app/features/products/services/product.service';
import { Product } from '@app/features/products/models/product.model';
import { Subscription } from 'rxjs';

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberProductParameterComponent),
  multi: true,
};

const DEFAULT_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NumberProductParameterComponent),
  multi: true,
};

interface ValueType {
  mandatory: boolean;
  value: number;
}

interface ParameterField {
  initialDefaultValue: ValueType;
  initialMinimumValue: ValueType;
  initialMaximumValue: ValueType;
}

export interface NumberProductParameter {
  defaultValue: number;
  minimumValue: number;
  maximumValue: number;
}

export type OnChange = (parameter: NumberProductParameter) => void;

@Component({
  selector: 'app-number-product-parameter',
  templateUrl: './number-product-parameter.component.html',
  providers: [DEFAULT_VALUE_ACCESSOR, DEFAULT_VALIDATOR],
})
export class NumberProductParameterComponent
  implements OnDestroy, Validator, ControlValueAccessor, DoCheck, AfterViewInit {
  // @ts-ignore
  public numberParameterForm: FormGroup<{
    // @ts-ignore
    defaultValue: number;
    // @ts-ignore
    minimumValue: number;
    // @ts-ignore
    maximumValue: number;
  }>;
  // @ts-ignore
  @Input()
  parentForm: FormGroup;
  // @ts-ignore
  @Input()
  item: ParameterField;

  private control: FormControl;
  private subscriptions: Subscription[] = [];

  private onTouched: () => void = () => {};
  private onChange: OnChange = () => {};
  private onValidatorChange = () => {};

  constructor(
    public productService: ProductService,
    public formBuilder: FormBuilder,
    private injector: Injector,
  ) {
    this.numberParameterForm = this.formBuilder.group({
      defaultValue: this.formBuilder.control(null),
      minimumValue: this.formBuilder.control(null),
      maximumValue: this.formBuilder.control(null),
    });
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);

    if (ngControl) {
      this.control = ngControl.control as FormControl;
      setTimeout(() => this.control.setErrors(this.validate(this.control)));
    }
  }

  ngDoCheck(): void {
    if (!this.control) {
      return;
    }
  }

  writeValue(value: NumberProductParameter): void {
    let defaultValue = value.defaultValue;
    let minimumValue = value.minimumValue;
    let maximumValue = value.maximumValue;

    if (!defaultValue) {
      defaultValue = this.item.initialDefaultValue.value;
    }
    if (!minimumValue) {
      minimumValue = this.item.initialMinimumValue.value;
    }
    if (!maximumValue) {
      maximumValue = this.item.initialMaximumValue.value;
    }

    this.numberParameterForm = this.formBuilder.group({
      defaultValue: this.formBuilder.control(
        defaultValue,
        this.item.initialDefaultValue.mandatory ? Validators.required : Validators.nullValidator,
      ),
      minimumValue: this.formBuilder.control(
        minimumValue,
        this.item.initialMinimumValue.mandatory ? Validators.required : Validators.nullValidator,
      ),
      maximumValue: this.formBuilder.control(
        maximumValue,
        this.item.initialMaximumValue.mandatory ? Validators.required : Validators.nullValidator,
      ),
    });

    this.subscriptions.push(
      this.numberParameterForm.controls.defaultValue.valueChanges.subscribe((v) => {
        const numberProductParameter: NumberProductParameter = {
          defaultValue: this.numberParameterForm.controls.defaultValue.value,
          minimumValue: this.numberParameterForm.controls.minimumValue.value,
          maximumValue: this.numberParameterForm.controls.maximumValue.value,
        };
        this.onChange(numberProductParameter);
      }),
      this.numberParameterForm.controls.minimumValue.valueChanges.subscribe((v) => {
        const numberProductParameter: NumberProductParameter = {
          defaultValue: this.numberParameterForm.controls.defaultValue.value,
          minimumValue: this.numberParameterForm.controls.minimumValue.value,
          maximumValue: this.numberParameterForm.controls.maximumValue.value,
        };
        this.onChange(numberProductParameter);
      }),
      this.numberParameterForm.controls.maximumValue.valueChanges.subscribe((v) => {
        const numberProductParameter: NumberProductParameter = {
          defaultValue: this.numberParameterForm.controls.defaultValue.value,
          minimumValue: this.numberParameterForm.controls.minimumValue.value,
          maximumValue: this.numberParameterForm.controls.maximumValue.value,
        };
        this.onChange(numberProductParameter);
      }),
    );
  }

  registerOnChange(onChange: OnChange): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.numberParameterForm.disable() : this.numberParameterForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
  ngOnDestroy() {
    this.subscriptions?.forEach((s) => s.unsubscribe());
  }
}
