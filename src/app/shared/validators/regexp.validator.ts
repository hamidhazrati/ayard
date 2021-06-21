import { ValidatorFn } from '@ng-stack/forms';

export type RegexpError = { regexp: true };

export const regexp: ValidatorFn<RegexpError> = (control) => {
  if (!control.value) {
    return null;
  }

  try {
    // tslint:disable-next-line:no-unused-expression
    new RegExp(control.value);
    return null;
  } catch (e) {
    return { regexp: true };
  }
};
