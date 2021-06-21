import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrimFormControl } from '@app/shared/form/trim-form-control';
import { EntitySearch } from '@app/features/entities/models/entity-search.model';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

interface Country {
  code: string;
  description: string;
}

@Component({
  selector: 'app-resolve-entity-form',
  styleUrls: ['./resolve-entity-form.component.scss'],
  templateUrl: './resolve-entity-form.component.html',
})
export class ResolveEntityFormComponent implements OnInit, OnDestroy {
  @Output() whenSearch = new EventEmitter<EntitySearch>();
  countryList: Country[] = [
    { code: '', description: 'Select a country' },
    { code: 'GB', description: 'United Kingdom' },
    { code: 'US', description: 'USA' },
    { code: 'AU', description: 'Australia' },
    { code: 'ZA', description: 'South Africa' },
    { code: 'DE', description: 'Germany' },
    { code: 'CH', description: 'Switzerland' },
  ];
  form: FormGroup;
  subscriptions = new Subscription();

  readonly isPopulated = new BehaviorSubject<boolean>(false);
  readonly isPopulated$ = this.isPopulated.asObservable();

  constructor(private readonly formBuilder: FormBuilder, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      country: new TrimFormControl(''),
      region: new TrimFormControl('', [Validators.maxLength(64)]),
      name: new TrimFormControl('', [Validators.maxLength(100)]),
      dunsNumber: new TrimFormControl('', [Validators.pattern('^[0-9]{9}')]),
      registrationNumber: new TrimFormControl('', []),
      address: new TrimFormControl(''),
      postalCode: new TrimFormControl(''),
    });

    // disable button if form is empty
    const valueChanges = this.form.valueChanges.subscribe((values: object) => {
      const notEmpty = Object.keys(values).some(
        (key: string) => values[key] && values[key].trim().length,
      );
      this.isPopulated.next(!!notEmpty);
    });

    // populate form based on query parameters
    const routeChanges = this.route.queryParams.subscribe((params) => {
      this.form.patchValue({ ...params, name: params.name });
    });

    this.subscriptions.add(this.isPopulated);
    this.subscriptions.add(routeChanges);
    this.subscriptions.add(valueChanges);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  trimValues(): EntitySearch {
    return Object.keys(this.form.value)
      .filter((key) => this.form.value[key] && this.form.value[key])
      .reduce((acc, curr) => ({ ...acc, [curr]: this.form.value[curr] }), {}) as EntitySearch;
  }

  validate(): void {
    const { address, country, name, postalCode, region, registrationNumber } = this.form.controls;

    // add validation for the following fields
    this._checkValidation(
      [name, registrationNumber, postalCode, address, region],
      country,
      'Please select country',
    );
    this._checkValidation([postalCode, address, region], name, 'Please enter entity name');
  }

  // events go here -----------------------------------------------------------

  onSubmit(): void {
    this.validate();
    if (!this.form.valid) {
      return;
    }

    const { dunsNumber } = this.form.controls;
    if (dunsNumber.value && dunsNumber.valid) {
      this.whenSearch.emit(this.trimValues());
      return;
    }
    this.whenSearch.emit(this.trimValues());
  }

  // private methods go here --------------------------------------------------

  private _checkValidation(
    control: AbstractControl | AbstractControl[],
    mandatory: AbstractControl,
    message: string,
  ): void {
    const validate = (arg1, arg2) => {
      if (arg1.value && arg1.value.length && (!arg2.value || arg2.value.length < 1)) {
        return arg2.setErrors({ ...arg2.errors, required: message });
      }
    };

    if (Array.isArray(control)) {
      control.forEach((field: AbstractControl) => validate(field, mandatory));
      return;
    }
    validate(control, mandatory);
  }
}
