import { ValidatorFn } from '@ng-stack/forms';

export type PositiveError = { positive: { actual: number } };

export const positiveNumber: ValidatorFn<PositiveError> = (control) => {
  if ((control.value || control.value === 0) && control.value <= 0) {
    return { positive: { actual: control.value } };
  }

  return null;
};
