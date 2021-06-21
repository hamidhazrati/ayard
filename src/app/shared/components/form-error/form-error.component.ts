import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { Status, ValidatorsModel } from '@ng-stack/forms';
import { Observable, of, Subscription } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PositiveError } from '@app/shared/validators/positive-number.validator';
import { RegexpError } from '@app/shared/validators/regexp.validator';
import { MultipleOfError } from '@app/shared/validators/multiple-of.validator';
import { map } from 'rxjs/operators';
import { IntegerError } from '@app/shared/validators/integer.validator';

export type RangeError = { range: { min: number; max: number } };

export type ErrorMessageFn<T> = ({ label, error }: { label: string; error: T }) => string;

type Validators = ValidatorsModel &
  PositiveError &
  RegexpError &
  MultipleOfError &
  IntegerError &
  RangeError;

const DEFAULT_MESSAGES: {
  [K in keyof Validators]: ErrorMessageFn<Validators[K]>;
} = {
  required: ({ label }) => {
    return `${label} is <b>required</b>.`;
  },
  min: ({ label, error }) => {
    return `${label} must be greater than or equal to <b>${error.min}</b>.`;
  },
  max: ({ label, error }) => {
    return `${label} must be less than or equal to <b>${error.max}</b>.`;
  },
  minlength: ({ label, error }) => {
    return `${label} does not meet minimum length of <b>${error.requiredLength}</b>.`;
  },
  maxlength: ({ label, error }) => {
    return `${label} exceeds maximum length of <b>${error.requiredLength}</b>.`;
  },
  email: ({ label }) => {
    return `${label} is not a valid email address.`;
  },
  pattern: ({ label, error }) => {
    return `${label} does not match pattern <b>${error.requiredPattern}</b>.`;
  },
  fileRequired: ({ label, error }) => {
    return `${label} is <b>required</b>.`;
  },
  fileMaxSize: ({ label, error }) => {
    return `${label} exceeds maximum size of <b>${error.requiredSize}</b>.`;
  },
  filesMinLength: ({ label, error }) => {
    return `${label} requires at least <b>${error.requiredLength}</b> files.`;
  },
  filesMaxLength: ({ label, error }) => {
    return `${label} exceeds maximum of <b>${error.requiredLength}</b> files.`;
  },
  positive: ({ label }) => `${label} must be a <b>positive number</b>.`,
  regexp: ({ label }) => `${label} <b>is not</b> a valid regular expression.`,
  multipleOf: ({ label, error }) => `${label} must be a multiple of <b>${error.multiple}</b>.`,
  integer: ({ label }) => `${label} must be a <b>whole number</b>.`,
  range: ({ label, error }) =>
    `${label} <b>Max(${error.max})</b> must be greater than <b>Min(${error.min})</b>.`,
};

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent implements OnInit, OnDestroy, DoCheck {
  @Input()
  private label = 'This field';

  @Input()
  private messages?: {
    [key: string]: ErrorMessageFn<any>;
  };

  @Input()
  control: AbstractControl;

  errors: Observable<string[]> = of([]);

  private status: string;
  private subscriptions: Subscription[] = [];

  constructor() {}

  static cannotBeEmpty(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string)?.trim().length === 0) {
      return { 'Field cannot be empty.': true };
    }
    return null;
  }

  ngOnInit() {
    if (!this.control) {
      return;
    }

    this.errors = this.control.statusChanges.pipe(
      map(() => this.statusChanged(this.control.status as Status)),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngDoCheck(): void {
    if (!this.control?.touched) {
      return;
    }

    this.status = this.control.status;
    this.errors = of(this.statusChanged(this.control.status as Status));
  }

  private statusChanged(status: Status) {
    if (status !== 'INVALID' || !this.control.errors) {
      return [];
    }

    const [firstError] = Object.entries(this.control.errors).filter(([_, hasError]) => hasError);

    const [key, error] = firstError;

    return [
      this.messages?.[key]?.({ label: this.label, error }) ||
        DEFAULT_MESSAGES[key]?.({ label: this.label, error }) ||
        key,
    ];
  }
}
