import { ValidatorFn } from '@ng-stack/forms';

type WithKey<K extends string | number | symbol> = {
  [k in K]: true;
};

export function predicateValidator<K extends string | number | symbol, T = string>(
  validationKey: K,
  predicate: (value: T) => boolean,
): ValidatorFn<WithKey<K>> {
  return (control) => {
    if (predicate(control.value) === false) {
      return { [validationKey]: true } as WithKey<K>;
    }

    return null;
  };
}
