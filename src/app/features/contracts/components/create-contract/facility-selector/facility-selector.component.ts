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
import { Control, FormBuilder, FormControl, FormGroup } from '@ng-stack/forms';
import { map } from 'rxjs/operators';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { Facility } from '@app/features/facilities/models/facility.model';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import { uniqBy } from 'lodash-es';

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FacilitySelectorComponent),
  multi: true,
};

const DEFAULT_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => FacilitySelectorComponent),
  multi: true,
};

export type OnChange = (facility: Facility) => void;
type SimpleRelationshipView = { name: string; facilities: Facility[] };

@Component({
  selector: 'app-facility-selector',
  templateUrl: './facility-selector.component.html',
  providers: [DEFAULT_VALUE_ACCESSOR, DEFAULT_VALIDATOR],
})
export class FacilitySelectorComponent
  implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterViewInit, DoCheck {
  @Input()
  disabled = false;

  @Input()
  inputId = '';

  form: FormGroup<{
    relationship: Control<SimpleRelationshipView>;
    facility: Control<Facility>;
  }>;

  relationships: Observable<SimpleRelationshipView[]> = of([]);

  private control: FormControl;
  private value: Facility;
  private subscriptions: Subscription[] = [];

  private onTouched: () => void = () => {};
  private onChange: OnChange = () => {};
  private onValidatorChange = () => {};

  constructor(
    private injector: Injector,
    private formBuilder: FormBuilder,
    private facilityService: FacilityService,
  ) {
    this.form = formBuilder.group({
      relationship: formBuilder.control(null),
      facility: formBuilder.control(null),
    });
  }

  ngOnInit() {
    this.relationships = this.facilityService.search({ type: 'contract' }).pipe(
      map((results) => {
        return uniqBy(results, (r) => r.facilityTree.id).map((r) => {
          return {
            name: r.facilityTree.name,
            facilities: results
              .filter((c) => c.facilityTree.id === r.facilityTree.id)
              .map((c) => c.facility),
          };
        });
      }),
    );

    this.subscriptions.push(
      this.form.controls.relationship.valueChanges.subscribe(() => {
        if (this.form.controls.facility.dirty || this.form.controls.facility.touched) {
          this.form.controls.facility.reset();
        }
      }),
      this.form.controls.facility.valueChanges.subscribe((v) => {
        this.writeValue(v);
      }),
    );
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

    if (this.control.touched) {
      if (!this.form.controls.relationship.touched) {
        this.form.controls.relationship.markAsTouched();
      }

      if (this.form.value.relationship && !this.form.controls.facility.touched) {
        this.form.controls.facility.markAsTouched();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions?.forEach((s) => s.unsubscribe());
  }

  registerOnChange(onChange: OnChange): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: Facility): void {
    this.value = value;
    this.onChange(this.value);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.controls.relationship.valid && this.form.controls.facility.valid
      ? null
      : { facility: true };
  }
}
