import { ValidatorFn } from '@ng-stack/forms';

export type IntegerError = { integer: { actual: number } };

export const integer: ValidatorFn<IntegerError> = (control) => {
  if (!control.value) {
    return null;
  }

  return Number.isInteger(control.value)
    ? null
    : {
        integer: {
          actual: control.value,
        },
      };
};
