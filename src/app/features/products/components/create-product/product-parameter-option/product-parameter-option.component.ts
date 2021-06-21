import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validator,
} from '@angular/forms';
import {
  ExtractModelValue,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@ng-stack/forms';
import { ProductService } from '@app/features/products/services/product.service';
import { Product } from '@app/features/products/models/product.model';
import { Subscription } from 'rxjs';

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProductParameterOptionComponent),
  multi: true,
};

const DEFAULT_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ProductParameterOptionComponent),
  multi: true,
};

export interface OptionParameter {
  show: boolean;
  defaultOption: number;
  label: string;
  value: string;
}

export type OnChange = (entity: ExtractModelValue<any>[]) => void;

@Component({
  selector: 'app-product-parameter-option',
  templateUrl: './product-parameter-option.component.html',
  styleUrls: ['./product-parameter-option.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR, DEFAULT_VALIDATOR],
})
export class ProductParameterOptionComponent
  implements Validator, ControlValueAccessor, AfterViewInit {
  @Input()
  item: any;

  private subscriptions: Subscription[] = [];
  private control: FormControl;
  formArray: FormArray;
  private onTouched: (value) => void = () => {};
  private onChange: OnChange = (value) => {};

  constructor(public formBuilder: FormBuilder, private injector: Injector) {
    this.formArray = new FormArray([]);
  }

  writeValue(value: any) {
    this.formArray = new FormArray(
      value.map((x) => {
        return new FormGroup({
          defaultOption: new FormControl(x.defaultOption),
          show: new FormControl(x.show),
          label: new FormControl(x.label, Validators.required),
          value: new FormControl(x.value, Validators.required),
        });
      }),
    );
    this.formArray.setValidators([
      this.requireRadioButtonToBeCheckedValidator(),
      this.requireDefaultToBeShownValidator(),
    ]);

    this.formArray.controls.forEach((control, index) => {
      this.subscriptions.push(
        // @ts-ignore
        control.controls.defaultOption.valueChanges.subscribe((res) => {
          this.formArray.controls.forEach((defaultOptionControl, currIndex) => {
            // turn other controls defaultOption to false except the current one thats just been selected
            if (index !== currIndex) {
              // @ts-ignore
              if (defaultOptionControl.controls.defaultOption.value) {
                // @ts-ignore
                defaultOptionControl.controls.defaultOption.setValue(false, { emitEvent: false });
              }
            }
          }); // @ts-ignore
          if (!control.controls.defaultOption.value) {
            // @ts-ignore
            control.controls.defaultOption.setValue(true, { emitEvent: false });
          }
          // @ts-ignore
          control.controls.show.setValue(true, { emitEvent: false });
          this.formArray.updateValueAndValidity({ onlySelf: false, emitEvent: true });
        }),
        this.formArray.valueChanges.subscribe((res) => {
          this.onChange(res);
        }),
      );
    });
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: any) => void) {
    this.onTouched = fn;
  }

  validate({ value }: FormControl) {
    return !this.formArray || this.formArray.valid ? null : this.formArray.errors;
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);

    if (ngControl) {
      this.control = ngControl.control as FormControl;
      setTimeout(() => this.control.setErrors(this.validate(this.control)));
    }
  }

  requireRadioButtonToBeCheckedValidator(): ValidatorFn {
    return function validate(formGroup: FormArray) {
      const totalSelected = formGroup.controls
        .map((control) => {
          // @ts-ignore
          return control.controls.defaultOption.value;
        })
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      return totalSelected >= 1 ? null : { atleastOneCashflowTypeRequired: true };
    };
  }

  requireDefaultToBeShownValidator(): ValidatorFn {
    return function validate(formGroup: FormArray) {
      const defaultOptionHasShow = formGroup.value.find((v) => v.defaultOption);
      return defaultOptionHasShow?.show ? null : { defaultOptionMustBeShown: true };
    };
  }
}
